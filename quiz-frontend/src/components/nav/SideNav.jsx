import { NavLink } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";
import "./side-nav.css";

function SideNav({ onNavigate, hasActiveQuiz }) {
  const { t } = useTranslation();
  const projectsLink = import.meta.env.VITE_PROJECT_LINK;

  const handleNavClick = (e, path) => {
    if (hasActiveQuiz && onNavigate) {
      const canNavigate = onNavigate(path);
      if (!canNavigate) {
        e.preventDefault();
      }
    }
  };

  return (
    <nav className="nav" aria-label={t("aria.navigation")}>
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav__btn nav__btn--active" : "nav__btn"
        }
        to="/"
        end
      >
        🏠 {t("nav.quiz")}
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive ? "nav__btn nav__btn--active" : "nav__btn"
        }
        to="/statistics"
        onClick={(e) => handleNavClick(e, "/statistics")}
      >
        📈 {t("nav.statistics")}
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive ? "nav__btn nav__btn--active" : "nav__btn"
        }
        to="/leaderboard"
        onClick={(e) => handleNavClick(e, "/leaderboard")}
      >
        📊 {t("nav.leaderboard")}
      </NavLink>

      <a
        className="nav__btn"
        href={projectsLink}
        target="_blank"
        rel="noreferrer"
        aria-label={t("aria.visitProjects")}
        title={t("aria.openProjects")}
      >
        📁 {t("nav.projects")}
      </a>
    </nav>
  );
}

export default SideNav;
