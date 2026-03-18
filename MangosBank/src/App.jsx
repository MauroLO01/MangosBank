<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home.jsx';
import Cliente from "./pages/dashboard";
=======
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Dashboard from "./pages/dashboard.jsx";
>>>>>>> 4111010dab1b879c881190eb64cec7c0b2033944

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;