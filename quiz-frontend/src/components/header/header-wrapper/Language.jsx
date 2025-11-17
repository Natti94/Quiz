import { useTranslation } from "../../../lib/i18n/useTranslation";
import { supportedLanguages } from "../../../lib/i18n/translations";

function Language() {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="language-selector header__language">
      <select
        className="language-selector__select header__language-select"
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
