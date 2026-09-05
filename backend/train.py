import os
import torch
import pandas as pd

from tqdm import tqdm
from torch.optim import AdamW
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from transformers import DistilBertTokenizer

from dataset import SafetyDataset
from model import load_model

# -----------------------------
# Load Dataset
# -----------------------------

df = pd.read_csv("data/industrial_safety_sif_binary_200.csv")

label_map = {
    "SIF": 1,
    "Non-SIF": 0
}

df["label"] = df["sif_label"].map(label_map)

# -----------------------------
# Train-Test Split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    df["report_text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)

# -----------------------------
# Create Dataset
# -----------------------------

train_dataset = SafetyDataset(X_train, y_train)
test_dataset = SafetyDataset(X_test, y_test)

train_loader = DataLoader(
    train_dataset,
    batch_size=8,
    shuffle=True
)

test_loader = DataLoader(
    test_dataset,
    batch_size=8
)

# -----------------------------
# Load Model
# -----------------------------

model = load_model()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using Device:", device)

model.to(device)

optimizer = AdamW(
    model.parameters(),
    lr=2e-5
)

print("Everything Loaded Successfully!")
print("Training batches:", len(train_loader))
print("Testing batches:", len(test_loader))

# -----------------------------
# Training
# -----------------------------

epochs = 3

print("\nStarting Training...\n")

for epoch in range(epochs):

    model.train()

    total_loss = 0

    progress_bar = tqdm(train_loader)

    for batch in progress_bar:

        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels
        )

        loss = outputs.loss

        optimizer.zero_grad()

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

        progress_bar.set_description(f"Epoch {epoch+1}")
        progress_bar.set_postfix(loss=loss.item())

    avg_loss = total_loss / len(train_loader)

    print(f"\nEpoch {epoch+1} Average Loss: {avg_loss:.4f}")

# -----------------------------
# Evaluation
# -----------------------------

print("\nEvaluating Model...\n")

model.eval()

predictions = []
actual_labels = []

with torch.no_grad():

    for batch in test_loader:

        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        preds = torch.argmax(outputs.logits, dim=1)

        predictions.extend(preds.cpu().numpy())
        actual_labels.extend(labels.cpu().numpy())

accuracy = accuracy_score(actual_labels, predictions)

print(f"\nTest Accuracy: {accuracy:.4f}")

print("\nConfusion Matrix:")
print(confusion_matrix(actual_labels, predictions))

print("\nClassification Report:")
print(classification_report(actual_labels, predictions))

# -----------------------------
# Save Model
# -----------------------------

print("\nSaving Model...")

save_path = "models/sif_model"

os.makedirs(save_path, exist_ok=True)

model.save_pretrained(save_path)

tokenizer = DistilBertTokenizer.from_pretrained(
    "distilbert-base-uncased"
)

tokenizer.save_pretrained(save_path)

print(f"\nModel saved successfully to '{save_path}'")