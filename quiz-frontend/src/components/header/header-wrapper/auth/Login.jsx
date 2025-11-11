import { useState } from "react";
import { useTranslation } from "../../../../i18n/useTranslation";

function Login() {
  const { t } = useTranslation();
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { username, password });
  };

  return (
    <form className="header__auth-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="header__input"
        value={username}
        onChange={(e) => setUser(e.target.value)}
        placeholder={t("header.username")}
        aria-label={t("header.username")}
      />
      <input
        type="password"
        className="header__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("header.password")}
        aria-label={t("header.password")}
      />
      <button type="submit" className="header__btn">
        {t("header.login")}
      </button>
    </form>
  );
}

export default Login;
