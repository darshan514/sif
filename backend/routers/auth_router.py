from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, RegisterFaceRequest, LoginFaceRequest, Token, UserResponse
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user
import json
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_password = get_password_hash(user_in.password)
    
    new_user = User(
        full_name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password,
        role=user_in.role,
        employee_id=user_in.employeeId or user_in.officerId,
        department=user_in.department,
        designation=user_in.designation,
        company=user_in.company,
        phone=user_in.phone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    user_resp = UserResponse.model_validate(new_user)
    return {"status": "success", "token": access_token, "user": user_resp}

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if user_credentials.role and user.role != user_credentials.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This account is not authorized as a {user_credentials.role}",
        )
        
    access_token = create_access_token(data={"sub": str(user.id)})
    
    user_resp = UserResponse.model_validate(user)
    return {"status": "success", "token": access_token, "user": user_resp}

@router.post("/logout")
def logout():
    return {"status": "success"}

@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    user_resp = UserResponse.model_validate(current_user)
    return {"status": "success", "user": user_resp}

@router.post("/register-face")
def register_face(data: RegisterFaceRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.employee_id != data.officerId and current_user.id != data.officerId:
        raise HTTPException(status_code=403, detail="Unauthorized to register face for this user")
        
    current_user.face_embeddings = json.dumps(data.embeddings)
    current_user.face_registered = True
    db.commit()
    
    return {"status": "success", "message": "Biometric face profile registered"}

@router.post("/login-face", response_model=Token)
def login_face(data: LoginFaceRequest, db: Session = Depends(get_db)):
    users_with_faces = db.query(User).filter(User.face_registered == True).all()
    if not users_with_faces:
        raise HTTPException(status_code=404, detail="No registered Safety Officer facial profiles found")
        
    live = data.embeddings
    best_match_id = None
    highest_sim = -1.0
    matched_user = None
    
    for user in users_with_faces:
        if not user.face_embeddings:
            continue
        stored = json.loads(user.face_embeddings)
        if len(live) != len(stored):
            continue
            
        dot = sum(a * b for a, b in zip(live, stored))
        norm_a = (sum(a * a for a in live)) ** 0.5
        norm_b = (sum(b * b for b in stored)) ** 0.5
        sim = dot / (norm_a * norm_b + 1e-7)
        
        if sim > highest_sim:
            highest_sim = sim
            best_match_id = user.id
            matched_user = user
            
    if highest_sim >= 0.82 and matched_user:
        access_token = create_access_token(data={"sub": str(matched_user.id)})
        user_resp = UserResponse.model_validate(matched_user)
        return {"status": "success", "token": access_token, "user": user_resp, "similarity": round(highest_sim * 100, 2)}
        
    raise HTTPException(status_code=401, detail="Face Not Recognized. Biometric similarity score below safety threshold.")
