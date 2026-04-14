import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import json
import os

# ================= INIT ================= #

app = FastAPI()   # ✅ MUST BE BEFORE middleware

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

    # phrase match (multi-word support)
    if keyword in user_text:
        return True

    # word match
    words = user_text.split()
    if keyword in words:
        return True

    # synonym match
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

@app.post("/evaluate")
def evaluate(data: dict):
    user_answer = data.get("answer", "").lower()
    keywords = data.get("keywords", [])

    matched = []

    for word in keywords:
        if is_match(user_answer, word):
            matched.append(word)

    total_keywords = len(keywords)
    score = int((len(matched) / total_keywords) * 100) if total_keywords else 0

    missing = [word for word in keywords if word not in matched]

    if score >= 80:
        feedback = "Excellent answer! Very strong explanation."
    elif score >= 50:
        feedback = "Good attempt, but you can include more key concepts."
    elif score > 0:
        feedback = "Partial answer. Try to explain more details."
    else:
        feedback = "Try again and include the important concepts."

    return {
        "score": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "feedback": feedback
    }