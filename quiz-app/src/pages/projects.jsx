import "./projects.css";

function Projects() {
  const projects = import.meta.env.VITE_PROJECT_LINK;

  return (
    <div className="projects-page">
      <h2>My Projects</h2>
      <p>Check out my other projects and work!</p>
      <button
        onClick={() => window.open(projects, "_blank", "noreferrer")}
        aria-label="Visit Projects"
        title="Open Projects Portfolio"
        className="projects-page__btn"
      >
        📁 Visit Projects Portfolio
      </button>
    </div>
  );
}

export default Projects;
