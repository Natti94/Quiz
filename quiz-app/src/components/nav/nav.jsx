import "./nav.css";

function Nav() {
  const projects = import.meta.env.VITE_PROJECT_LINK;

  return (
    <nav className="nav">
      <button
        className="nav__btn"
        onClick={() => window.open(projects, "_blank", "noreferrer")}
        aria-label="Projects"
        title="Projects"
      >
        📁 Visit Other Projects
      </button>
    </nav>
  );
}

export default Nav;
