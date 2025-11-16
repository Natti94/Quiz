import { useState } from "react";
import { useTranslation } from "../../../lib/i18n/useTranslation";
import Register from "./auth-wrapper/Register";
import Login from "./auth-wrapper/Login";

function Auth({
  mode = "page",
  isLogin: isLoginProp,
  setIsLogin: setIsLoginProp,
  onSuccess,
}) {
  const { t } = useTranslation();
  const [internalIsLogin, internalSetIsLogin] = useState(true);
  const isLogin =
    typeof isLoginProp === "boolean" ? isLoginProp : internalIsLogin;
  const setIsLogin = setIsLoginProp || internalSetIsLogin;

  if (mode === "compact") {
    return (
      <div className="header__auth-compact">
        <button
          type="button"
          className="header__btn header__btn--secondary"
          onClick={() => setIsLogin(true)}
        >
          {t("header.login")}
        </button>
        <button
          type="button"
          className="header__btn"
          onClick={() => setIsLogin(false)}
        >
          {t("header.register")}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-toggle">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
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
          onClick={() => setIsLogin(false)}
          className={
            !isLogin
              ? "auth-toggle__btn auth-toggle__btn--active"
              : "auth-toggle__btn"
          }
        >
          {t("auth.registerTitle")}
        </button>
      </div>
      <div className="auth-forms">
        {isLogin ? (
          <Login onSuccess={onSuccess} mode={mode} />
        ) : (
          <Register onSuccess={onSuccess} mode={mode} />
        )}
      </div>
    </div>
  );
}

export default Auth;
