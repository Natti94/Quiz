import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "../../../../lib/i18n/useTranslation";
import { loginUser } from "../../../../services/index";

function Login({ onSuccess }) {
  const { t } = useTranslation();
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      await loginUser(username, password);
      setSuccess(t("header.loginSuccess"));
      if (onSuccess) onSuccess();
      setTimeout(() => {
        navigate("/auth/dashboard");
      }, 1000);
    } catch {
      setError(t("header.loginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="header__auth-form" onSubmit={handleLogin}>
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
      <button type="submit" className="header__btn" disabled={loading}>
        {loading ? t("header.loggingIn") : t("header.login")}
      </button>
      {success && <p className="header__success-message">{success}</p>}
      {error && <p className="header__error-message">{error}</p>}
    </form>
  );
}

export default Login;
