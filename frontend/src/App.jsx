import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Practice from "./pages/Practice";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Result from "./pages/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result/>} />
      </Routes>
    </Router>
  );
}

export default App;