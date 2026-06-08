# 🤖 AI Interview System

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/React.js-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/NLP-SentenceTransformers-FF6F00?style=for-the-badge&logo=huggingface&logoColor=white"/>
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>
</p>

> An AI-powered interview preparation platform where users practice technical interviews using **voice input**, receive **intelligent NLP-based feedback**, and track their **performance over time**.

---

## 💡 Motivation

Most people who struggle in interviews aren't unprepared — they just haven't practiced *speaking their answers out loud* to something that feels real.

Practicing with a friend is helpful, but you can't do it anytime you want. Reading answers from a textbook is different from actually articulating them under pressure. And the hardest part? **Learning to speak confidently to a screen, when you can't even tell if anyone is really listening.**

I built this platform because I felt that gap myself. The moment you sit in front of a digital device in an interview — no body language from the interviewer, no nods, no reactions — it's a completely different experience. Most people have never practiced for *that* specific scenario.

**AI Interview System** is my attempt to fix that — a platform where anyone can practice technical interviews, speak their answers out loud, and get real feedback, anytime, without needing another person on the other side.

---

## 🚀 Features

### 🎤 Voice-Based Answering
- Answer questions using your microphone — just like a real interview
- Real-time speech-to-text conversion

### 🧠 AI Answer Evaluation
- Powered by **Sentence Transformers (MiniLM)** for deep semantic understanding
- Evaluates answers using a combination of keyword matching and semantic similarity
- Returns a **score out of 10**, matched keywords, missing concepts, and actionable feedback

### 🧪 Practice Mode
- Instant feedback on every answer
- Ideal answer shown immediately after submission
- Best for quick learning and concept reinforcement

### 🎯 Interview Mode
- Simulates a real interview experience end-to-end
- Structured 5-question flow with no mid-way feedback
- Final performance summary shown at the end

### 👤 User Authentication
- Signup and login system
- User data persisted in backend storage

### 📊 Performance History
- Tracks all previous interview attempts per user
- Displays subject, score, and date for every session

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, JavaScript, CSS |
| Backend | FastAPI (Python), REST APIs |
| AI / NLP | SentenceTransformers `all-MiniLM-L6-v2`, Cosine Similarity, Keyword + Synonym Matching |
| Storage | JSON-based (prototype stage) → MongoDB / Firebase (planned) |
| Speech | Web Speech API (Browser-native) |

---

## 📂 Project Structure

```
AI-Interview-System/
│
├── backend/
│   ├── main.py              # FastAPI app & all endpoints
│   ├── users.json           # User data storage (prototype)
│   └── data/                # Question bank (per subject)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Practice.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Result.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md
```

---

## ⚙️ How It Works

```
User selects subject (ML, OS, DBMS, etc.)
        │
        ▼
Backend fetches question from question bank
        │
        ▼
User answers via voice input (speech-to-text)
        │
        ▼
Answer is cleaned & processed
        │
        ├── Keyword Matching
        └── Semantic Similarity (MiniLM)
        │
        ▼
AI generates Score + Feedback + Missing Concepts
        │
        ▼
Result saved to user's performance history
```

---

## ▶️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/AI-Interview-System.git
cd AI-Interview-System
```

### 2. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🌟 Key Highlights

- Built entirely **self-initiated** — not a college assignment, a real problem worth solving
- Combines **Full Stack Development + NLP + Voice Interaction** in one project
- Evaluation goes beyond keyword matching — uses actual **semantic understanding**
- Designed to simulate the discomfort of speaking to a screen, which is what real interviews feel like

---

## 🚧 Roadmap

- [x] Voice-based answer input
- [x] AI evaluation with semantic similarity
- [x] Practice & Interview modes
- [x] User authentication & performance history
- [ ] MongoDB / Firebase integration
- [ ] Difficulty levels (Easy / Medium / Hard)
- [ ] Advanced analytics dashboard
- [ ] Deployment (Vercel + Render / Railway)
- [ ] Mobile responsive UI

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/Pratiksingh07-dy/AI-Interview-Voices/blob/main/LICENSE).

---

## 🙋 Author

**Pratik Singh**
- GitHub: [@Pratiksingh07-dy](https://github.com/Pratiksingh07-dy)
- LinkedIn: [@PratikSingh2005](https://www.linkedin.com/in/pratiksingh2005/)

---

> ⭐ If this project resonates with you or helped you in any way, consider giving it a star!