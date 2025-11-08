import { useState } from "react";
import { useTranslation } from "../../../../../i18n/useTranslation";

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }
    console.log("Register:", { username, email, password });
  };

  return (
    <form className="header__auth-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="header__input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={t("header.username")}
        aria-label={t("header.username")}
      />
      <input
        type="email"
        className="header__input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("header.email")}
        aria-label={t("header.email")}
      />
      <input
        type="password"
        className="header__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("header.password")}
        aria-label={t("header.password")}
      />
      <input
        type="password"
        className="header__input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t("header.confirmPassword")}
        aria-label={t("header.confirmPassword")}
      />
      <button type="submit" className="header__btn header__btn--secondary">
        {t("header.register")}
      </button>
    </form>
  );
}

export default Register;
