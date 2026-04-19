import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No data available</h2>;
  }

  const { finalScore, results } = state;

  const percentage = ((finalScore / (results.length * 10)) * 100).toFixed(2);

  return (
    <div className="container">
      <h1>📊 Interview Result</h1>

      <h2>Your Score: {percentage}%</h2>

      <button onClick={() => navigate("/")}>
         Go Home
      </button>

      <div style={{ marginTop: "20px" }}>
        {results.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "15px",
              background: "#222",
              borderRadius: "10px",
            }}
          >
            <h3>Q{index + 1}: {item.question}</h3>

            <p><strong>Your Answer:</strong> {item.answer}</p>

            <p><strong>Score:</strong> {item.score}/10</p>

            <p><strong>Feedback:</strong> {item.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Result;