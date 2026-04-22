import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  //  Get user
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      className="container"
      style={{ position: "relative" }} 
    >
      {/* 👤 Avatar (Top Right) */}
      <div
        onClick={() => navigate("/profile")}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer",
          zIndex: 1000,    
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          transition: "0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {user?.username ? user.username[0].toUpperCase() : "U"}
      </div>

      <h1>AI Interview System</h1>

      <div className="card">
        <h2 style={{ fontSize: "50px", marginBottom: "5px" }}>😄</h2>
        <h2>Welcome!</h2>

        <p>Practice Smarter. Perform Better.</p>

        {/*  BUTTON GROUP */}
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