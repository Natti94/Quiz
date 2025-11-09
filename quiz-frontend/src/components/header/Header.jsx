import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation.js";
import Language from "./header-wrapper/language/Language.jsx";
import "./header.css";

function Header() {
  const { t } = useTranslation();

  const [user, _setUser] = useState(null);

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
            <Link
              to="/auth/login"
              className="header__btn header__btn--secondary"
            >
              {t("header.login")}
            </Link>
            <Link to="/auth/register" className="header__btn">
              {t("header.register")}
            </Link>
          </div>
        )}
        <Language />
      </div>
    </header>
  );
}

export default Header;
