import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home.jsx';
import Cliente from "./pages/dashboard";
import Dashboard from "./pages/dashboard.jsx";
import Logo from './assets/icon-logo2.png';
import linkPlayStore from './assets/playstore.png';
import linkAppleStore from './assets/apple-store.png';
import arrowLinkClient from './assets/arrow-right2.png';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;