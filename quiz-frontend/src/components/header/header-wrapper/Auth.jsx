import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../lib/i18n/useTranslation";
import { useAuth } from "../../../contexts";
import Register from "./auth-sections/Register";
import Login from "./auth-sections/Login";

function Auth({
  mode = "page",
  isLogin: isLoginProp,
  setIsLogin: setIsLoginProp,
  onSuccess,
  onAuthClick,
  onProfileClick,
}) {
  const { t } = useTranslation();
  const [internalIsLogin, internalSetIsLogin] = useState(true);

  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const isLogin =
    typeof isLoginProp === "boolean" ? isLoginProp : internalIsLogin;
  const setIsLogin = setIsLoginProp || internalSetIsLogin;

  if (mode === "compact") {
    return (
      <>
        <div className="header__auth-compact">
          {isAuthenticated && user ? (
            <>
              <div
                className="header__user-profile"
                onClick={() => onProfileClick && onProfileClick()}
                style={{ cursor: "pointer" }}
              >
                <div className="header__user-avatar">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="8" r="4" fill="currentColor" />
                    <path
                      d="M20 20c0-4.4-3.6-8-8-8s-8 3.6-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className="header__user-name">
                  {user.username || user.email}
                </span>
              </div>
              <div className="header__dashboard-options">
                <button
                  type="button"
                  className="header__btn header__btn--secondary"
                  onClick={() => navigate("/")}
                  title={t("dashboard.goToQuiz")}
                >
                  {t("dashboard.goToQuiz")}
                </button>
                <button
                  type="button"
                  className="header__btn header__btn--secondary"
                  onClick={() => navigate("/statistics")}
                  title={t("dashboard.viewStatistics")}
                >
                  {t("dashboard.viewStatistics")}
                </button>
                <button
                  type="button"
                  className="header__btn header__btn--secondary"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  {t("header.logout")}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="header__btn header__btn--secondary"
                onClick={() => {
                  if (onAuthClick) {
                    onAuthClick(true);
                  } else {
                    setIsLogin(true);
                    navigate("/auth/login");
                  }
                }}
              >
                {t("header.login")}
              </button>
              <button
                type="button"
                className="header__btn"
                onClick={() => {
                  if (onAuthClick) {
                    onAuthClick(false);
                  } else {
                    setIsLogin(false);
                    navigate("/auth/register");
                  }
                }}
              >
                {t("header.register")}
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="auth-wrapper">
        {mode !== "modal" && (
          <div className="auth-toggle">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                navigate("/auth/login");
              }}
              className={
                isLogin
                  ? "auth-toggle__btn auth-toggle__btn--active"
                  : "auth-toggle__btn"
              }
            >
              {t("auth.loginTitle")}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                navigate("/auth/register");
              }}
              className={
                !isLogin
                  ? "auth-toggle__btn auth-toggle__btn--active"
                  : "auth-toggle__btn"
              }
            >
              {t("auth.registerTitle")}
            </button>
          </div>
        )}

        <div className="auth-forms">
          {isLogin ? (
            <Login onSuccess={onSuccess} mode={mode} />
          ) : (
            <Register onSuccess={onSuccess} mode={mode} />
          )}
        </div>
      </div>
    </>
  );
}

export default Auth;
