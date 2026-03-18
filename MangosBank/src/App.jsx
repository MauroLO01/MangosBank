import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Dashboard from "./pages/dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;