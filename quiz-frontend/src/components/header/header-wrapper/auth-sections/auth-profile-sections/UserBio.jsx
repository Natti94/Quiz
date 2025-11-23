import { useState } from "react";
import { useTranslation } from "../../../../../lib/i18n/useTranslation";
import { useAuth } from "../../../../../contexts";

function UserBio({ isEditing, onSave }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleSave = () => {
    const profileData = { avatar, username, email, bio };
    onSave(profileData);
  };

  return (
    <div className="profile-bio">
      <div className="profile-bio__avatar-section">
        <div className="profile-bio__avatar">
          {avatar ? (
            <img src={avatar} alt={t("profile.avatarAlt")} />
          ) : (
            <div className="profile-bio__avatar-placeholder">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M20 20c0-4.4-3.6-8-8-8s-8 3.6-8 8" />
              </svg>
            </div>
          )}
        </div>
        {isEditing && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => setAvatar(e.target.result);
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: "none" }}
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="profile-bio__change-avatar"
            >
              {t("profile.changeAvatar")}
            </label>
          </>
        )}
      </div>

      <div className="profile-bio__fields">
        <div className="profile-bio__field">
          <label htmlFor="username">{t("profile.username")}</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditing}
            className="profile-bio__input"
          />
        </div>

        <div className="profile-bio__field">
          <label htmlFor="email">{t("profile.email")}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className="profile-bio__input"
          />
        </div>

        <div className="profile-bio__field">
          <label htmlFor="bio">{t("profile.bio")}</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={!isEditing}
            className="profile-bio__textarea"
            rows="3"
          />
        </div>
      </div>

      {isEditing && (
        <div className="profile-bio__actions">
          <button
            type="button"
            className="profile-bio__save-btn"
            onClick={handleSave}
          >
            {t("profile.save")}
          </button>
        </div>
      )}
    </div>
  );
}

export default UserBio;
