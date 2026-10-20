from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import pandas as pd
import re
import unicodedata
from symspellpy import SymSpell, Verbosity

app = FastAPI()

print("Memuat Kamus Alay...")
df_kamus = pd.read_csv('../resources/kamus_alay_master.csv')
kamus_alay_gabungan = dict(zip(df_kamus['slang'], df_kamus['formal']))

print("Mempersiapkan SymSpell (Spell Checker)...")
sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
dictionary_path = "../resources/kamus_symspell_final.txt"
sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1, separator='\t')

def preprocess_toxic(text):
    text = str(text)
    text = re.sub(r':[^:\s]+:', ' ', text)
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'http\S+|www\.\S+', '', text)
    text = text.lower()
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    # Kamus Alay
    words = text.split()
    normalized_words = [kamus_alay_gabungan.get(word, word) for word in words]
    text_normalized = ' '.join(normalized_words)

    text_final = re.sub(r'\s+', ' ', text_normalized).strip()
    return text_final

def preprocess_judi(text):
    text = str(text)
    text = re.sub(r':[^:\s]+:', ' ', text)
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'http\S+|www\.\S+', '', text)
    text = text.lower()
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    # Spell Checker
    spell_checked_words = []
    for word in text.split():
        if word.isnumeric():
            spell_checked_words.append(word)
            continue
            
        suggestions = sym_spell.lookup(word, Verbosity.CLOSEST, max_edit_distance=1, include_unknown=True)
        
        if suggestions:
            spell_checked_words.append(suggestions[0].term)
        else:
            spell_checked_words.append(word)
            
    text_spell_checked = ' '.join(spell_checked_words)
    text_spell_checked = re.sub(r'\s+', ' ', text_spell_checked).strip()
    
    # Kamus Alay
    words = text_spell_checked.split()
    normalized_words = [kamus_alay_gabungan.get(word, word) for word in words]
    text_normalized = ' '.join(normalized_words)

    text_final = re.sub(r'\s+', ' ', text_normalized).strip()
    return text_final


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Menjalankan FastAPI menggunakan device: {device}")

PATH_MODEL_TOXIC = "./model/model_indobertweet_chat_toxic_preprocessing_alay"
PATH_MODEL_JUDI = "./model/model_indoberttweet_chat_judi_online_preprocessing_typo_correction"

print("Memuat model Toxic...")
tokenizer_toxic = AutoTokenizer.from_pretrained(PATH_MODEL_TOXIC)
model_toxic = AutoModelForSequenceClassification.from_pretrained(PATH_MODEL_TOXIC).to(device)
model_toxic.eval()

print("Memuat model Judi...")
tokenizer_judi = AutoTokenizer.from_pretrained(PATH_MODEL_JUDI)
model_judi = AutoModelForSequenceClassification.from_pretrained(PATH_MODEL_JUDI).to(device)
model_judi.eval()


def predict_text(text: str, model, tokenizer):
    # Tokenization
    inputs = tokenizer(
        text, 
        return_tensors="pt", 
        truncation=True, 
        padding='max_length', 
        max_length=64
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        
    probabilities = F.softmax(logits, dim=-1)
    score = probabilities[0][1].item() 
    return score

class TextRequest(BaseModel):
    text: str

@app.post("/check-text")
async def check_text(req: TextRequest):
    original_text = req.text.lower()

    print("Menerima teks untuk diperiksa:", original_text)

    text_for_toxic = preprocess_toxic(original_text)
    text_for_judi = preprocess_judi(original_text)

    print("Teks setelah preprocessing untuk model Toxic:", text_for_toxic)
    print("Teks setelah preprocessing untuk model Judi:", text_for_judi)

    toxic_probability = predict_text(text_for_toxic, model_toxic, tokenizer_toxic)
    judi_probability = predict_text(text_for_judi, model_judi, tokenizer_judi) 

    THRESHOLD = 0.70 
    
    if judi_probability >= THRESHOLD:
        final_status = "JUDI_ONLINE"
    elif toxic_probability >= THRESHOLD:
        final_status = "TOXIC"
    else:
        final_status = "ACCEPTED"

    return {
        "status": final_status,
        "toxic_score": toxic_probability,
        "judi_score": judi_probability
    }

# uvicorn main:app --reload --port 8000