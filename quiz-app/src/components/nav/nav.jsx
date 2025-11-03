import { NavLink } from "react-router-dom";
import "./nav.css";

function Nav() {
  return (
    <nav className="nav">
      <NavLink className="nav__btn" to="/">
        🏠 Quiz
      </NavLink>
      <NavLink className="nav__btn" to="/projects">
        📁 Projects
      </NavLink>
    </nav>
  );
}

export default Nav;
