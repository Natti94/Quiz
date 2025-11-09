import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages-wrapper/AuthPage";
import LeaderboarsdPage from "./pages-wrapper/LeaderboardsPage";
import ProjectsPage from "./pages-wrapper/ProjectsPage";
import "./Pages.css";

const Pages = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/leaderboard" element={<LeaderboarsdPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  );
};

export default Pages;
