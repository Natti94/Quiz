import { useState } from "react";
import { useTranslation } from "../../../../lib/i18n/useTranslation";
import { useAuth } from "../../../../contexts";
import UserBio from "./auth-profile-sections/UserBio";
import UserSettings from "./auth-profile-sections/UserSettings";

function Profile({ mode = "view", onClose }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // Profile state
  const [activeTab, setActiveTab] = useState("bio");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (profileData) => {
    // TODO: Implement profile update API call
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  const handleSaveSettings = (settingsData) => {
    // TODO: Implement settings update API call
    console.log("Saving settings:", settingsData);
  };

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  if (mode === "modal") {
    return (
      <div className="profile-modal">
        <div className="profile-modal__header">
          <h2 className="profile-modal__title">{t("profile.title")}</h2>
          <button
            type="button"
            className="profile-modal__close"
            onClick={onClose}
            aria-label={t("profile.close")}
          >
            ×
          </button>
        </div>

        <div className="profile-modal__tabs">
          <button
            type="button"
            className={`profile-modal__tab ${activeTab === "bio" ? "profile-modal__tab--active" : ""}`}
            onClick={() => setActiveTab("bio")}
          >
            {t("profile.bio")}
          </button>
          <button
            type="button"
            className={`profile-modal__tab ${activeTab === "settings" ? "profile-modal__tab--active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            {t("profile.settings")}
          </button>
        </div>

        <div className="profile-modal__content">
          {activeTab === "bio" && (
            <UserBio isEditing={isEditing} onSave={handleSaveProfile} />
          )}

          {activeTab === "settings" && (
            <UserSettings onSave={handleSaveSettings} />
          )}
        </div>

        <div className="profile-modal__actions">
          {activeTab === "bio" && (
            <>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="profile-modal__btn profile-modal__btn--secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    {t("profile.cancel")}
                  </button>
                  <button
                    type="button"
                    className="profile-modal__btn"
                    onClick={handleSaveProfile}
                  >
                    {t("profile.save")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="profile-modal__btn"
                  onClick={() => setIsEditing(true)}
                >
                  {t("profile.edit")}
                </button>
              )}
            </>
          )}

          {activeTab === "settings" && (
            <button
              type="button"
              className="profile-modal__btn"
              onClick={handleSaveSettings}
            >
              {t("profile.saveSettings")}
            </button>
          )}

          <button
            type="button"
            className="profile-modal__btn profile-modal__btn--danger"
            onClick={handleLogout}
          >
            {t("header.logout")}
          </button>
        </div>
      </div>
    );
  }

  // Default view mode - just show basic profile info
  return (
    <div className="profile">
      <div className="profile__info">
        <div className="profile__avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={t("profile.avatarAlt")} />
          ) : (
            <div className="profile__avatar-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 20c0-4.4-3.6-8-8-8s-8 3.6-8 8" />
              </svg>
            </div>
          )}
        </div>
        <div className="profile__details">
          <h3 className="profile__name">{user?.username || user?.email}</h3>
          <p className="profile__email">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;