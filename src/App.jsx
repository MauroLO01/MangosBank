import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard.jsx";
import Login from "./pages/login.jsx";
import Cadastro from "./pages/cadastro.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />}/>
      <Route path="/cadastro" element={<Cadastro />}/>
    </Routes>
  );
}

export default App;