import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import json
import os

from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')


# ================= INIT ================= #

app = FastAPI()   

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= SYNONYMS ================= #

SYNONYMS = {
    "fast": ["quick", "rapid", "speed"],
    "error": ["mistake", "fault", "bug"],
    "data": ["information", "values"],
    "store": ["save", "keep"],
    "send": ["transfer", "transmit"],
    "receive": ["get", "accept"],
    "improve": ["enhance", "increase", "boost"],
    "learn": ["study", "understand"],
    "problem": ["issue", "challenge"],
    "solution": ["answer", "fix"]
}

# ================= MATCH FUNCTION ================= #

def is_match(user_text, keyword):
    keyword = keyword.lower()
    user_text = user_text.lower()

    if keyword in user_text:
        return True

    words = user_text.split()
    if keyword in words:
        return True

    if keyword in SYNONYMS:
        for syn in SYNONYMS[keyword]:
            if syn in user_text:
                return True

    return False

# ================= LOAD DATA ================= #

DATA_FOLDER = "data"

def load_questions(topic):
    file_path = os.path.join(DATA_FOLDER, f"{topic}.json")

    if not os.path.exists(file_path):
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

# ================= MEMORY ================= #

last_question = {}

# ================= ROUTES ================= #

@app.get("/")
def home():
    return {"message": "AI Interview Backend Running"}

@app.get("/get-question/{topic}")
def get_question(topic: str):
    topic = topic.lower()

    questions = load_questions(topic)

    if not questions:
        return {"error": "Topic not found or empty"}

    previous = last_question.get(topic)
    choices = [q for q in questions if q != previous]

    if not choices:
        selected = random.choice(questions)
    else:
        selected = random.choice(choices)

    last_question[topic] = selected

    return selected

def clean_text(text):
    import re
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

@app.post("/evaluate")
def evaluate(data: dict):
    user_answer = clean_text(data.get("answer", ""))
    keywords = data.get("keywords", [])
    ideal_answer = clean_text(
    data.get("ideal_answer") or data.get("answer") or " ".join(keywords)
)

    # 🔹 SEMANTIC SCORE (0–10)
    emb1 = model.encode(user_answer, convert_to_tensor=True)
    emb2 = model.encode(ideal_answer, convert_to_tensor=True)

    similarity = util.cos_sim(emb1, emb2).item()
    semantic_score = int(similarity * 10)

    # 🔹 KEYWORD SCORE (0–10)
    matched = []
    for word in keywords:
        if is_match(user_answer, word):
            matched.append(word)

            

    if len(keywords) == 0:
        keyword_score = 0
    else:
        keyword_score = int((len(matched) / len(keywords)) * 10)

    # 🔥 FINAL SCORE (COMBINED)
    final_score = int((semantic_score * 0.7) + (keyword_score * 0.3))
    final_score = min(final_score, 10)

    # 🔹 FEEDBACK
    if final_score >= 8:
        feedback = "Excellent answer! Very strong explanation."
    elif final_score >= 5:
        feedback = "Good answer, but add more clarity and key concepts."
    elif final_score > 0:
        feedback = "Partial answer. Improve explanation and structure."
    else:
        feedback = "Answer not relevant. Try again."

    return {
        "score": final_score,
        "semantic_score": semantic_score,
        "keyword_score": keyword_score,
        "matched_keywords": matched,
        "feedback": feedback
    }