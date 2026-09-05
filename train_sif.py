from torch.utils.data import DataLoader
from transformers import DistilBertForSequenceClassification
import pandas as pd
import torch

from sklearn.model_selection import train_test_split
from transformers import DistilBertTokenizer

# -------------------------
# Load Dataset
# -------------------------

df = pd.read_csv("data/industrial_safety_sif_binary_200.csv")

label_map = {
    "SIF": 1,
    "Non-SIF": 0
}

df["label"] = df["sif_label"].map(label_map)

X_train, X_test, y_train, y_test = train_test_split(
    df["report_text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)

# -------------------------
# Load Tokenizer
# -------------------------

tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

# -------------------------
# Dataset Class
# -------------------------

class SafetyDataset(torch.utils.data.Dataset):

    def __init__(self, texts, labels):

        self.texts = texts.tolist()
        self.labels = labels.tolist()

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):

        encoding = tokenizer(
            self.texts[idx],
            truncation=True,
            padding="max_length",
            max_length=128,
            return_tensors="pt"
        )

        return {
            "input_ids": encoding["input_ids"].squeeze(),
            "attention_mask": encoding["attention_mask"].squeeze(),
            "labels": torch.tensor(self.labels[idx], dtype=torch.long)
        }


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

print(f"Training batches: {len(train_loader)}")
print(f"Testing batches: {len(test_loader)}")

print("Dataset Created Successfully!")

sample = train_dataset[0]

print(sample.keys())

print(sample["input_ids"].shape)

print(sample["attention_mask"].shape)

print(sample["labels"])
print("\nLoading DistilBERT Model...")

model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=2
)

print("Model Loaded Successfully!")

print(model.config)
