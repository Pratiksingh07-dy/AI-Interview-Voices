import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import json
import os

from sentence_transformers import SentenceTransformer, util

# ================= INIT ================= #

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('all-MiniLM-L6-v2')

# ================= USER STORAGE ================= #

USER_FILE = "users.json"

if not os.path.exists(USER_FILE):
    with open(USER_FILE, "w") as f:
        json.dump([], f)

# ================= AUTH ================= #

@app.post("/signup")
def signup(data: dict):
    users = json.load(open(USER_FILE))

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    for u in users:
        if u["email"] == email:
            return {"error": "User already exists"}

    user = {
        "username": username,
        "email": email,
        "password": password
    }

    users.append(user)
    json.dump(users, open(USER_FILE, "w"))

    return {"message": "Signup successful", "user": user}


@app.post("/login")
def login(data: dict):
    users = json.load(open(USER_FILE))

    email = data.get("email")
    password = data.get("password")

    for u in users:
        if u["email"] == email and u["password"] == password:
            return {"message": "Login success", "user": u}

    return {"error": "Invalid credentials"}

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

    selected = random.choice(choices if choices else questions)

    last_question[topic] = selected

    return selected

# ================= CLEAN TEXT ================= #

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

# ================= EVALUATE ================= #

@app.post("/evaluate")
def evaluate(data: dict):
    user_answer = clean_text(data.get("answer", ""))
    keywords = data.get("keywords", [])
    ideal_answer = clean_text(
        data.get("ideal_answer") or " ".join(keywords)
    )

    # 🔹 KEYWORD MATCHING
    matched = []
    missing = []

    for k in keywords:
        if is_match(user_answer, k):
            matched.append(k)
        else:
            missing.append(k)

    keyword_score = len(matched) / len(keywords) if keywords else 0

    # 🔹 SEMANTIC SCORE
    emb1 = model.encode(user_answer, convert_to_tensor=True)
    emb2 = model.encode(ideal_answer, convert_to_tensor=True)

    similarity = util.cos_sim(emb1, emb2).item()
    semantic_score = similarity  # 0–1

    # 🔥 FINAL SCORE
    final_score = (0.5 * keyword_score + 0.5 * semantic_score) * 10
    final_score = round(final_score)

    # 🔥 FIX LOGIC: if keywords matched but explanation weak
    if len(matched) == len(keywords) and final_score < 8:
        missing = ["explanation depth"]

    # 🔹 FEEDBACK
    if final_score >= 8:
        feedback = "Excellent answer! Very strong explanation."
    elif final_score >= 5:
        feedback = "Good answer, but add more clarity."
    elif final_score > 0:
        feedback = "Partial answer. Improve explanation."
    else:
        feedback = "Answer not relevant."

    return {
        "score": final_score,
        "semantic_score": round(semantic_score * 10, 2),
        "keyword_score": round(keyword_score * 10, 2),
        "matched_keywords": matched,
        "missing_keywords": missing,
        "feedback": feedback
    }