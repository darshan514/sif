import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

# Load saved model
model_path = "models/sif_model"

tokenizer = DistilBertTokenizer.from_pretrained(model_path)
model = DistilBertForSequenceClassification.from_pretrained(model_path)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)
model.eval()

print("SIF Predictor Ready!\n")

while True:

    text = input("Enter Incident Report (or type quit): ")

    if text.lower() == "quit":
        break

    encoding = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=128,
        return_tensors="pt"
    )

    input_ids = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)

    with torch.no_grad():

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        prediction = torch.argmax(outputs.logits, dim=1).item()

    if prediction == 1:
        print("\nPrediction: SIF\n")
    else:
        print("\nPrediction: Non-SIF\n")