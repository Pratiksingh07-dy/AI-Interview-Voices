import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import "../App.css"; 

function Practice() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("ml");
  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [modelAnswer, setModelAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // 🔊 Speak Question
  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // 📥 Get Question
 const getQuestion = async () => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/get-question/${topic}`
    );

    setQuestion(res.data.question);
    setKeywords(res.data.keywords);
    setModelAnswer(res.data.answer);
    setTranscript("");
    setResult(null);

    speakQuestion(res.data.question);

  } catch (error) {
    console.error(error);
    alert("❌ Failed to fetch question. Check backend.");
  }
};

 // 🧠 Evaluate Answer
const evaluateAnswer = async () => {
  stopListening(); // stop mic + timer

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/evaluate",
      {
        answer: transcript,
        keywords: keywords,
        topic: topic
      }
    );

    setResult(res.data);

    // ✅ scroll AFTER result is set
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

  } catch (error) {
    console.error(error);
    alert("❌ Evaluation failed.");
  }
};

  // 🎤 Start Recording
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Please use Google Chrome");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.start();
    setIsRecording(true);
    setTimeLeft(60);

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Speech capture
    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    // 🔥 Fix: restart if stopped unexpectedly
    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };
  };

  // 🛑 Stop Recording
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
  };

  return (
    <div className="container">
      <button onClick={() => navigate("/")}>
  ⬅ Back to Home
</button>
      <h1>🎤 AI Interview Practice</h1>

      <div className="card">
        <div className="controls">
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
  <option value="ml">Machine Learning</option>
  <option value="dsa">DSA</option>
  <option value="os">Operating Systems</option>
  <option value="dbms">DBMS</option>
  <option value="ai">Artificial Intelligence</option>
  <option value="cn">Computer Networks</option>
  <option value="oops">OOPS</option>
  <option value="aptitude">Aptitude</option>
</select>

          <button onClick={getQuestion}>Get Question</button>
        </div>

        {question && (
  <>
    <h3 style={{ color: "#888" }}>
      Topic: {topic.toUpperCase()}
    </h3>

    <h3 className="question">{question}</h3>

            <div style={{ marginTop: "15px" }}>
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

              <p style={{ marginTop: "10px" }}>
                ⏱ Time Left: {timeLeft}s
              </p>
            </div>

            <div className="answer-box">
              <strong>Your Answer:</strong>
              <p>{transcript}</p>
            </div>

            <button
  className="submit-btn"
  onClick={evaluateAnswer}
  disabled={!transcript.trim()}
>
  Submit Answer
  
</button>
          </>
        )}

        {result && (
          <div className="result-box">
            <h2>
              {topic === "aptitude"
              ? "Evaluation Result"
              : `Score: ${result.score}%`}
            </h2>

            <p>
              <strong>
  {topic === "aptitude" ? "Key Points Covered" : "Matched"}
</strong>{" "}
              {result.matched_keywords.join(", ")}
            </p>

            {topic !== "aptitude" && (
  <p>
    <strong>Missing:</strong>{" "}
    {result.missing_keywords.join(", ")}
  </p>
)}

            <p>
              <strong>Feedback:</strong> {result.feedback}
            </p>

            <hr style={{ margin: "20px 0" }} />

            <h3>📖 Ideal Answer:</h3>
            <p>{modelAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Practice;