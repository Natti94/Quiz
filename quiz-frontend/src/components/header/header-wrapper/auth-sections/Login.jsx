import { useState } from "react";
import { useTranslation } from "../../../../lib/i18n/useTranslation";
import { useAuth } from "../../../../contexts";

function Login({ onSuccess }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      await login(username, password);
      setSuccess(t("header.loginSuccess"));
      if (onSuccess) onSuccess();
      // User is now authenticated, header will show dashboard options
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
