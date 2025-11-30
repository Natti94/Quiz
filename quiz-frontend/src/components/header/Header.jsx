import { useState } from "react";
import { useTranslation } from "../../lib/i18n/useTranslation.js";
import Language from "./header-wrapper/Language.jsx";
import Auth from "./header-wrapper/Auth.jsx";
import Profile from "./header-wrapper/auth-sections/Profile.jsx";
import "./Header.css";

function Header() {
  const { t } = useTranslation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const handleClose = () => setIsLoginOpen(false);
  const handleProfileClose = () => setIsProfileOpen(false);

  return (
    <header className="header">
      <h1 className="header__title">{t("header.title")}</h1>
      <div className="header__right">
        <Auth
          mode="compact"
          onAuthClick={(loginMode) => {
            console.log("Header onAuthClick called with loginMode:", loginMode);
            setIsLogin(loginMode);
            setIsLoginOpen(true);
            console.log("Modal should now be open, isLoginOpen:", true);
          }}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        <Language />
      </div>

      {isLoginOpen && (
        <div
          className="header__modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target.classList.contains("header__modal-overlay")) {
              setIsLoginOpen(false);
            }
          }}
        >
          <section
            className="header__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="header__modal-header">
              <h3 className="header__modal-title">
                {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
              </h3>
              <button
                type="button"
                className="header__btn header__modal-close"
                onClick={handleClose}
                aria-label={t("auth.close")}
              >
                ×
              </button>
            </div>
            <Auth
              mode="modal"
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              onSuccess={handleClose}
            />

            <div className="header__modal-footer">
              <p className="header__modal-text">
                {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
              </p>
              <button
                type="button"
                className="header__modal-toggle header__btn header__btn--secondary"
                onClick={() => setIsLogin((s) => !s)}
              >
                {isLogin ? t("auth.createAccount") : t("auth.loginLink")}
              </button>
            </div>
          </section>
        </div>
      )}

      {isProfileOpen && (
        <div
          className="header__modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target.classList.contains("header__modal-overlay")) {
              setIsProfileOpen(false);
            }
          }}
        >
          <section
            className="header__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="header__modal-header">
              <h3 className="header__modal-title">{t("profile.title")}</h3>
              <button
                type="button"
                className="header__btn header__modal-close"
                onClick={handleProfileClose}
                aria-label={t("profile.close")}
              >
                ×
              </button>
            </div>
            <Profile mode="modal" onClose={handleProfileClose} />
          </section>
        </div>
      )}
    </header>
  );
}

export default Header;
