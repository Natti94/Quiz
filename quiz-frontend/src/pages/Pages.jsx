import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages-wrapper/AuthPage";
import StatisticsPage from "./pages-wrapper/StatisticsPage";
import ProjectsPage from "./pages-wrapper/ProjectsPage";
import "./pages.css";

function Pages() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  );
}

export default Pages;
