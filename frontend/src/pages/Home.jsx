import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>AI Interview System</h1>

      <div className="card">
        <h2 style={{ fontSize: "50px", marginBottom: "5px" }}>😄</h2>
        <h2>Welcome!</h2>

        <p>Practice Smarter. Perform Better.</p>

        {/* 🔥 BUTTON GROUP */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <button onClick={() => navigate("/practice")}>
            Start Practice 🎤
          </button>

          <button onClick={() => navigate("/interview")}>
            Start Interview 🧪
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;