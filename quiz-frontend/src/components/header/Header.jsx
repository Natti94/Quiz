import { useState } from "react";
import { useTranslation } from "../../lib/i18n/useTranslation.js";
import Language from "./header-wrapper/Language.jsx";
import Auth from "./header-wrapper/Auth.jsx";
import "./header.css";

function Header() {
  const { t } = useTranslation();
  const [user, _setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const handleClose = () => setIsLoginOpen(false);

  return (
    <header className="header">
      <h1 className="header__title">{t("header.title")}</h1>
      <div className="header__right">
        {user ? (
          <div className="header__user">
            <span className="header__user-icon" aria-hidden="true">
              👤
            </span>
            <span className="header__user-name">{user.username}</span>
          </div>
        ) : (
          <div className="header__auth">
            <button
              type="button"
              className="header__btn header__btn--secondary"
              onClick={() => {
                setIsLogin(true);
                setIsLoginOpen(true);
              }}
            >
              {t("header.login")}
            </button>
            <button
              type="button"
              className="header__btn"
              onClick={() => {
                setIsLogin(false);
                setIsLoginOpen(true);
              }}
            >
              {t("header.register")}
            </button>
          </div>
        )}
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
    </header>
  );
}

export default Header;
