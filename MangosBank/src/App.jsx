import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Cliente from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cliente" element={<Cliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;