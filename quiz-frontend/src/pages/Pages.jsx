import { Routes, Route } from "react-router-dom";
import Auth from "./pages-wrapper/Auth";
import Leaderboard from "./pages-wrapper/statistics-wrapper/LeaderboardPage";
import Projects from "./pages-wrapper/Projects";
import "./pages.css";

function Pages() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/projects" element={<Projects />} />
    </Routes>
  );
}

export default Pages;
