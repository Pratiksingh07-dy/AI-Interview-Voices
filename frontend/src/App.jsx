import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Practice from "./pages/Practice";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </Router>
  );
}

export default App;