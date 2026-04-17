import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1> AI Interview System</h1>

      <div className="card">
        <h2 style={{ fontSize: "25px" }}>😄</h2>
        <h2>Welcome!</h2>
        <p> Practice Smarter. Perform Better.</p>

        <button onClick={() => navigate("/practice")}>
          Start Practice 🎤
        </button>
      </div>
    </div>
  );
}

export default Home;