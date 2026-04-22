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
  const [results, setResults] = useState([]);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const totalQuestions = 5;

 const fillers = [
  // basic
  "um", "uh", "hmm", "erm",

  // common conversational
  "like", "you know", "i mean", "sort of", "kind of",

  // thinking fillers
  "let me think", "let me see", "how do i say", "what i mean is",

  // overused clarity fillers
  "basically", "actually", "literally", "obviously", "simply",

  // hesitation phrases
  "so yeah", "and yeah", "right", "okay", "ok",
  "well", "so", "hmm so", "uh so",

  // repetition starters
  "so basically", "like i said", "as i said",

  // casual speech
  "kinda", "sorta", "you see", "you can say",

  // weak confidence words
  "maybe", "probably", "i guess", "i think",

  // indian conversational fillers
  "matlab", "bas", "toh", "haan", "achha", "waise",
  "actually na", "toh basically", "samjho"
];

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

  //  GET QUESTION
  const getQuestion = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/get-question/${topic}`
    );

    setQuestion(res.data.question);
    setKeywords(res.data.keywords);
    setIdealAnswer(res.data.answer);
    setTranscript("");
  };

  //  EVALUATE ANSWER
  const evaluateAnswer = async () => {
    try {
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

      //  LAST QUESTION
      if (newCount === totalQuestions) {
        //  SAVE FOR RESULT PAGE
        localStorage.setItem("results", JSON.stringify(updatedResults));

        //  SAVE PER USER (PROFILE)
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
          const key = `history_${user.email}`;
          const existing = JSON.parse(localStorage.getItem(key)) || [];

          const newEntry = {
            test: `Test ${existing.length + 1}`,
            subject: topic,
            score: `${newScore}/10`,
            date: new Date().toLocaleDateString(),
            details: updatedResults,
          };

          localStorage.setItem(
            key,
            JSON.stringify([...existing, newEntry])
          );
        }

        navigate("/result");
      } else {
        getQuestion();
      }

    } catch (err) {
      console.error(err);
    }
  };

  // 🎤 START VOICE
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

  //  STOP VOICE
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  return (
    <div className="container">
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* LEFT SIDE */}
        <div style={{ flex: 2 }}>

          <div style={{ position: "absolute", top: "20px", left: "20px" }}>
            <button onClick={() => navigate("/")}>Back</button>
          </div>

          <h1 style={{ textAlign: "center" }}>Interview Mode</h1>

          {!started && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="ml">Machine Learning</option>
                <option value="dsa">DSA</option>
                <option value="os">OS</option>
                <option value="dbms">DBMS</option>
                <option value="ai">AI</option>
                <option value="cn">CN</option>
                <option value="oops">OOPS</option>
              </select>

              <br /><br />

              <button onClick={() => {
                setStarted(true);
                getQuestion();
              }}>
                Start Interview
              </button>
            </div>
          )}

          {started && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h3>{question}</h3>
              <p>⏱ {timeLeft}s</p>

              <button onClick={startListening} disabled={isRecording}>
                🎤 Start
              </button>

              <button onClick={stopListening} disabled={!isRecording}>
                🛑 Stop
              </button>

              {/* ANSWER BOX */}
              <div style={{
                marginTop: "20px",
                padding: "20px",
                minHeight: "80px",
                width: "400px",
                background: "#1e1e1e",
                borderRadius: "10px",
                marginInline: "auto"
              }}>
                {transcript || "Start speaking..."}
              </div>

              <button
                onClick={evaluateAnswer}
                disabled={!transcript || isRecording}
                style={{ marginTop: "10px" }}
              >
                Submit
              </button>

              <p>Question {count + 1} / {totalQuestions}</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        {started && (
          <div style={{ flex: 1, background: "#1e1e1e", padding: "15px" }}>
            <h3>Voice Analysis</h3>
            <p>Fillers: {countFillers(transcript)}</p>
            <p>Confidence: {getConfidence()}%</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Interview;