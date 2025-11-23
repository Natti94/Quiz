import { useState } from "react";
import { useTranslation } from "../../../../../lib/i18n/useTranslation";
import { useAuth } from "../../../../../contexts";

function UserSettings({ onSave }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [theme, setTheme] = useState(user?.settings?.theme || "light");
  const [language, setLanguage] = useState(user?.settings?.language || "en");

  const handleSave = () => {
    const settingsData = { notifications, theme, language };
    onSave(settingsData);
  };

  return (
    <div className="profile-settings">
      <div className="profile-settings__field">
        <label className="profile-settings__checkbox-label">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="profile-settings__checkbox"
          />
          {t("profile.notifications")}
        </label>
      </div>

      <div className="profile-settings__field">
        <label htmlFor="theme">{t("profile.theme")}</label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="profile-settings__select"
        >
          <option value="light">{t("profile.themeLight")}</option>
          <option value="dark">{t("profile.themeDark")}</option>
          <option value="auto">{t("profile.themeAuto")}</option>
        </select>
      </div>

      <div className="profile-settings__field">
        <label htmlFor="language">{t("profile.language")}</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="profile-settings__select"
        >
          <option value="en">English</option>
          <option value="sv">Svenska</option>
        </select>
      </div>

      <div className="profile-settings__actions">
        <button
          type="button"
          className="profile-settings__save-btn"
          onClick={handleSave}
        >
          {t("profile.saveSettings")}
        </button>
      </div>
    </div>
  );
}

export default UserSettings;