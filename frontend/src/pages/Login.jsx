import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    // ✅ BASIC VALIDATION
    if (!email || !password || (isSignup && !username)) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isSignup) {
        const res = await axios.post("http://127.0.0.1:8000/signup", {
          username,
          email,
          password,
        });

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // ✅ clear fields
          setUsername("");
          setEmail("");
          setPassword("");

          navigate("/", { replace: true })
        } else {
          alert(res.data.error || "Signup failed");
        }
      } else {
        const res = await axios.post("http://127.0.0.1:8000/login", {
          email,
          password,
        });

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // ✅ clear fields
          setEmail("");
          setPassword("");

          navigate("/profile");
        } else {
          alert(res.data.error || "Invalid credentials");
        }
      }
    } catch (err) {
      alert("Server error. Check backend.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        {/* Username only in signup */}
        {isSignup && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          {isSignup ? "Already have an account?" : "New user?"}
        </p>

        <button
          onClick={() => setIsSignup(!isSignup)}
          style={styles.linkBtn}
        >
          {isSignup ? "Login here" : "Create account"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#4CAF50",
    cursor: "pointer",
    marginTop: "5px",
  },
};

export default Login;