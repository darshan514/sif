import os
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from .database import engine, Base
from .routers import auth_router, reports_router

# Initialize Database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIF AI API")

# ---------------- CORS ----------------
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load Model ----------------
# Hierarchy: ENV -> Local 'models/sif_model' -> HF Hub 'darsh90844/sif' -> Fallback 'distilbert-base-uncased'
MODEL_PATH = os.getenv("MODEL_PATH")
if not MODEL_PATH:
    if os.path.exists("models/sif_model"):
        MODEL_PATH = "models/sif_model"
    else:
        MODEL_PATH = "darsh90844/sif"

try:
    tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
    model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
except Exception as e:
    # Safe fallback if Hugging Face repo is private or unavailable
    FALLBACK_MODEL = "distilbert-base-uncased"
    tokenizer = DistilBertTokenizer.from_pretrained(FALLBACK_MODEL)
    model = DistilBertForSequenceClassification.from_pretrained(FALLBACK_MODEL, num_labels=2)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()


class ReportModel(BaseModel):
    report: str


@app.get("/")
def home():
    return {"message": "SIF AI API is running!"}


@app.post("/predict")
def predict(data: ReportModel):

    encoding = tokenizer(
        data.report,
        padding="max_length",
        truncation=True,
        max_length=128,
        return_tensors="pt",
    )

    input_ids = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)

    with torch.no_grad():
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
        )

        probabilities = torch.softmax(outputs.logits, dim=1)
        confidence, prediction = torch.max(probabilities, dim=1)

    label = "SIF" if prediction.item() == 1 else "Non-SIF"

    return {
        "prediction": label,
        "confidence": round(confidence.item() * 100, 2),
    }

# Mount Routers
app.include_router(auth_router.router, prefix="/api")
app.include_router(reports_router.router, prefix="/api/reports")