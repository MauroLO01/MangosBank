import Home from "./Pages/Home.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/login.jsx";
import { Routes, Route } from "react-router-dom";
import Logo from "./assets/icon-logo2.png"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;