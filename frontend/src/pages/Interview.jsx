import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Interview() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const [topic, setTopic] = useState("ml");
  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [idealAnswer, setIdealAnswer] = useState("");

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const totalQuestions = 5;
  const [results, setResults] = useState([]);

  // 🎤 FILLER + CONFIDENCE LOGIC
  const fillers = ["um", "uh", "like", "you know", "basically", "actually"];

  const countFillers = (text) => {
    let count = 0;
    fillers.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const getConfidence = () => {
    const words = transcript.trim().split(/\s+/).length;
    const fillerCount = countFillers(transcript);

    let confidence = 100 - fillerCount * 5;
    if (words < 20) confidence -= 20;

    return Math.max(0, confidence);
  };

  // 🔥 Get Question
  const getQuestion = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/get-question/${topic}`
    );

    setQuestion(res.data.question);
    setKeywords(res.data.keywords);
    setIdealAnswer(res.data.answer); 
    setTranscript("");
  };

  // 🔥 Evaluate Answer
  const evaluateAnswer = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/evaluate",
      {
        answer: transcript,
        keywords: keywords,
        ideal_answer: idealAnswer, 
      }
    );

    const newScore = score + res.data.score;
    const newCount = count + 1;

    const currentResult = {
      question,
      answer: transcript,
      score: res.data.score,
      feedback: res.data.feedback,
    };

    const updatedResults = [...results, currentResult];

    setScore(newScore);
    setCount(newCount);
    setResults(updatedResults);

    if (newCount < totalQuestions) {
      getQuestion();
    } else {
      navigate("/result", {
        state: {
          finalScore: newScore,
          results: updatedResults,
        },
      });
    }
  };

  // 🎤 Start Voice
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Use Google Chrome");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.start();
    setIsRecording(true);
    setTranscript("");

    setTimeLeft(60);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text);
    };
  };

  // 🛑 Stop Voice
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  return (
    <div className="container">
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        <div style={{ flex: 2 }}>

  {/* 🔙 BACK BUTTON */}
  <div style={{ position: "absolute", top: "20px", left: "20px" }}>
    <button onClick={() => navigate("/")}>Back</button>
  </div>

  {/* 🧪 HEADING */}
  <h1 style={{ textAlign: "center", marginTop: "10px" }}>
     Interview Mode
  </h1>

  {/* BEFORE START */}
  {!started && (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      
      {/* DROPDOWN */}
      <select
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: "8px", minWidth: "220px" }}
      >
        <option value="ml">Machine Learning</option>
        <option value="dsa">DSA</option>
        <option value="os">Operating Systems</option>
        <option value="dbms">DBMS</option>
        <option value="ai">Artificial Intelligence</option>
        <option value="cn">Computer Networks</option>
        <option value="oops">OOPS</option>
        <option value="aptitude">Aptitude</option>
      </select>

      {/* START BUTTON */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            setStarted(true);
            getQuestion();
          }}
        >
          Start Interview
        </button>
      </div>
    </div>
  )}

  {/* AFTER START */}
  {started && (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      
      {!question ? (
        <p>Loading question...</p>
      ) : (
        <h3>{question}</h3>
      )}

      <p>⏱ Time Left: {timeLeft}s</p>

      {/* MIC */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={startListening} disabled={isRecording}>
          🎤 Start
        </button>

        <button
          onClick={stopListening}
          disabled={!isRecording}
          style={{ marginLeft: "10px" }}
        >
          🛑 Stop
        </button>
      </div>

      {/* TRANSCRIPT */}
      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: "#222",
          borderRadius: "8px",
        }}
      >
        <strong>Your Answer:</strong>
        <p>{transcript || "Start speaking..."}</p>
      </div>

      {/* SUBMIT */}
      <button
        onClick={evaluateAnswer}
        disabled={!transcript || isRecording}
        style={{ marginTop: "10px" }}
      >
        Submit Answer
      </button>

      <p style={{ marginTop: "10px" }}>
        Question {count + 1} / {totalQuestions}
      </p>
    </div>
  )}
</div>

        {started && (
  <div
    style={{
      flex: 1,
      background: "#1e1e1e",
      padding: "15px",
      borderRadius: "10px",
    }}
  >
    <h3>🎤 Voice Analysis</h3>

    <p>
      <strong>Filler Words:</strong> {countFillers(transcript)}
    </p>

    <p>
      <strong>Confidence:</strong> {getConfidence()}%
    </p>

    <hr />

    <h4>Suggestions</h4>

    {countFillers(transcript) > 2 && (
      <p>⚠️ Reduce filler words</p>
    )}

    {getConfidence() < 60 && (
      <p>📉 Try to speak more clearly</p>
    )}

    {getConfidence() >= 80 && (
      <p>🔥 Great speaking style!</p>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default Interview;