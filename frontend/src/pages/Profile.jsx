import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Dynamic history state
  const [history, setHistory] = useState([]);

  // ✅ Load user-specific history
  useEffect(() => {
    if (user) {
      const key = `history_${user.email}`;
      const data = JSON.parse(localStorage.getItem(key)) || [];
      setHistory(data);
    }
  }, [user]);

  return (
    <div className="container" style={{ width: "100%", overflowX: "hidden" }}>

  
      <button
  onClick={() => {
    window.location.href = "/";
  }}
  style={{
    position: "fixed",
    top: "20px",
    left: "20px",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "#111",
    color: "white",
    border: "none",
    cursor: "pointer",
    zIndex: 1000
  }}
>
  Back
</button>

      {/* Title */}
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        👤 User Profile
      </h1>

      {/* 🔝 USER INFO */}
      <div
        style={{
          marginTop: "30px",
          padding: "30px",
          background: "#1e1e1e",
          borderRadius: "15px",
          textAlign: "center",
          maxWidth: "500px",
          marginInline: "auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}
      >
        <h3>User Info</h3>

        {user ? (
          <>
            {/* Avatar */}
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>
              👤
            </div>

            {/* Username */}
            <h2 style={{ marginBottom: "10px" }}>
              {user.username || "User"}
            </h2>

            {/* Email */}
            <p><strong>Email:</strong> {user.email}</p>

            {/* Logout */}
            <button
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#e74c3c",
                color: "white",
                cursor: "pointer"
              }}
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p>Please login to continue</p>

            <button
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#4CAF50",
                color: "white",
                cursor: "pointer"
              }}
              onClick={() => navigate("/login")}
            >
              Login / Sign Up
            </button>
          </>
        )}
      </div>

      {/* 🔽 HISTORY */}
      <div style={{ marginTop: "40px", width: "100%" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          📊 Performance History
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "30px",
            padding: "0 80px"
          }}
        >
          {history.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
              No tests taken yet
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "30px",
                  background: "#222",
                  borderRadius: "20px",
                  textAlign: "center",
                  fontSize: "18px",
                  boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                  transition: "0.3s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 0 25px rgba(0,0,0,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>{item.test}</h3>
                <p>Subject: <strong>{item.subject}</strong></p>
                <p>Score: <strong>{item.score}</strong></p>
                <p style={{ fontSize: "12px", opacity: 0.7 }}>
                  {item.date}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Profile;