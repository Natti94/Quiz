import { useState } from "react";
import { useTranslation } from "../../../../lib/i18n/useTranslation";
import { registerUser } from "../../../../services/index";

function Register({ onSuccess }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError(t("header.passwordsDoNotMatch"));
      return;
    }
    try {
      setLoading(true);
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      setSuccess(t("header.registrationSuccess"));
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.message || t("header.registrationError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="header__auth-form" onSubmit={handleRegister}>
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
        <button
          type="submit"
          className="header__btn header__btn--secondary"
          disabled={loading}
        >
          {loading ? t("header.registering") : t("header.register")}
        </button>
      </form>
      {success && <p className="header__success-message">{success}</p>}
      {error && <p className="header__error-message">{error}</p>}
    </>
  );
}

export default Register;
