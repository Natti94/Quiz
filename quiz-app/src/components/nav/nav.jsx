import { NavLink } from "react-router-dom";
import "./nav.css";

function Nav() {
  const projectsLink = import.meta.env.VITE_PROJECT_LINK;

  return (
    <nav className="nav">
      <NavLink className="nav__btn" to="/">
        🏠 Quiz
      </NavLink>
      <a
        className="nav__btn"
        href={projectsLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Visit Projects"
        title="Open Projects Portfolio"
      >
        📁 Projects
      </a>
    </nav>
  );
}

export default Nav;
