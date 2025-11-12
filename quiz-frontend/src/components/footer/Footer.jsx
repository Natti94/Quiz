import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import Version from "./footer-wrapper/Version";
import Copyright from "./footer-wrapper/Copyright";
import Cookies from "./footer-wrapper/cookies/Cookies";
import { clearCookieConsent } from "../../utils/cookies";
import "./Footer.css";

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [, setReload] = useState(0);

  const handleManageCookies = () => {
    clearCookieConsent();
    setReload((prev) => prev + 1);
    window.location.reload();
  };

  return (
    <footer className="app-footer" role="contentinfo" aria-label="Sidfot">
      <div className="app-footer__inner">
        <Copyright owner="Natnael Berhane" since={year} />
        <button
          type="button"
          className="app-footer__cookie-btn"
          onClick={handleManageCookies}
          title={t("cookies.manageConsent")}
        >
          🍪 {t("cookies.manageConsent")}
        </button>
        <Cookies />
        <Version />
      </div>
    </footer>
  );
}

export default Footer;
