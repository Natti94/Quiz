import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import Login from "../../components/header/header-wrapper/auth/auth-wrapper/Login";
import Register from "../../components/header/header-wrapper/auth/auth-wrapper/Register";
import "./../pages.css";

function AuthPage() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);

  const authClassNames = {
    form: "auth__form",
    input: "auth__input",
    button: "auth__btn",
    label: "auth__label",
    field: "auth__field",
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h2 className="auth__title">
            {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
          </h2>
          <p className="auth__subtitle">
            {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
          </p>
        </div>

        {isLogin ? (
          <Login classNames={authClassNames} showLabels={true} />
        ) : (
          <Register classNames={authClassNames} showLabels={true} />
        )}

        <div className="auth__footer">
          <p className="auth__footer-text">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
          </p>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="auth__link"
          >
            {isLogin ? t("auth.createAccount") : t("auth.loginLink")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
