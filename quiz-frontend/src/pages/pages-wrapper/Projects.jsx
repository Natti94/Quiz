import { useTranslation } from "../../i18n/useTranslation";
import "./Pages.css";

function Projects() {
  const { t } = useTranslation();

  return (
    <div className="projects">
      <div className="projects__header">
        <h1 className="projects__title">{t("projects.title")}</h1>
        <p className="projects__subtitle">{t("projects.subtitle")}</p>
      </div>
      <div className="projects__content">
        <p className="projects__text">{t("projects.underDevelopment")}</p>
      </div>
    </div>
  );
}

export default Projects;
