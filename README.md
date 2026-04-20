# 🤖 AI Interview System

An AI-powered interview preparation platform that helps users practice and improve their technical interview skills using voice-based answers, intelligent evaluation, and performance tracking.

---

## 🚀 Features

### 🎤 Voice-Based Answering

* Users can answer questions using microphone input
* Real-time speech-to-text conversion

### 🧠 AI Answer Evaluation

* Uses **Sentence Transformers (MiniLM)** for semantic similarity
* Combines:

  * Keyword matching
  * Semantic understanding
* Provides:

  * Score (out of 10)
  * Matched keywords
  * Missing concepts
  * Feedback

### 🧪 Practice Mode

* Instant feedback on the same page
* Ideal answer displayed immediately
* Helps in quick learning and improvement

### 🎯 Interview Mode

* Simulates real interview experience
* 5-question structured flow
* Final result page with performance summary

### 👤 User Authentication

* Signup/Login system
* User data stored in backend (`users.json`)

### 📊 Performance History

* Tracks all previous attempts
* Displays:

  * Subject
  * Score
  * Date
* Stored per user

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* CSS (Custom styling)

### Backend

* FastAPI (Python)
* REST APIs

### AI / NLP

* SentenceTransformers (`all-MiniLM-L6-v2`)
* Cosine Similarity
* Keyword + Synonym Matching

### Storage

* JSON-based storage (`users.json`)
* Browser LocalStorage (session handling)

---

## 📂 Project Structure

```
AI-Interview-System/
│
├── backend/
│   ├── main.py
│   ├── users.json
│   └── data/ (questions)
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
```

---

## ⚙️ How It Works

1. User selects a subject (ML, OS, DBMS, etc.)
2. System fetches a question from backend
3. User answers using voice input
4. Answer is:

   * Cleaned and processed
   * Compared using:

     * Keyword matching
     * Semantic similarity (AI)
5. System generates:

   * Score
   * Feedback
   * Missing concepts
6. Result is stored in user history

---

## ▶ How to Run Locally

### 1️⃣ Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 2️⃣ Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌟 Key Highlights

* Combines **AI + Full Stack Development**
* Real-time **voice interaction**
* Smart evaluation using **NLP models**
* User-based tracking system
* Clean UI with interactive experience

---

## 📌 Future Improvements

* Database integration (MongoDB / Firebase)
* Better speech recognition accuracy
* Advanced analytics dashboard
* Difficulty levels (Easy/Medium/Hard)
* Deployment (Cloud)

