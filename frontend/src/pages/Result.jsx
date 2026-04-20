import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("results"));
    if (data && data.length > 0) {
      setResults(data);
    }
  }, []);

  if (results.length === 0) {
    return (
      <div className="container">
        <h2 style={{ textAlign: "center" }}>No data available</h2>
      </div>
    );
  }

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);

  return (
    <div className="container">

      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px"
        }}
      >
        Back
      </button>

      <h1 style={{ textAlign: "center" }}>Interview Result</h1>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Final Score: {totalScore}/10
      </h2>

      {results.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#1e1e1e",
            padding: "20px",
            margin: "15px",
            borderRadius: "10px"
          }}
        >
          <h3>Q{index + 1}: {item.question}</h3>
          <p><strong>Your Answer:</strong> {item.answer}</p>
          <p><strong>Score:</strong> {item.score}</p>
          <p><strong>Feedback:</strong> {item.feedback}</p>
        </div>
      ))}

    </div>
  );
}

export default Result;