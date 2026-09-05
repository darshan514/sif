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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load Model ----------------
MODEL_PATH = "darsh90844/sif"

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

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