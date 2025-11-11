import { useTranslation } from "../../../../i18n/useTranslation";
import { supportedLanguages } from "../../../../i18n/translations";
import "./language.css";

function Language() {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="language-selector">
      <select
        className="language-selector__select"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label="Välj språk / Select language"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Language;
