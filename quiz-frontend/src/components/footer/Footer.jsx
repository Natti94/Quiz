import { useState } from "react";
import { useTranslation } from "../../lib/i18n/useTranslation";
import { clearCookieConsent } from "../../utils/cookies";
import Version from "./footer-wrapper/Version";
import Copyright from "./footer-wrapper/Copyright";
import Cookies from "./footer-wrapper/Cookies";
import Updates from "./footer-wrapper/Updates";
import "./footer.css";

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
        <div className="app-footer__col app-footer__col--left">
          <div className="app-footer__brand-row">
            <Copyright owner="Natnael Berhane" since={year} />
            <Version />
            {}
            <Updates />
            {}
            <div className="app-footer__brand-cookies">
              <button
                type="button"
                className="app-footer__cookie-btn app-footer__manage-btn"
                onClick={handleManageCookies}
                title={t("cookies.manageConsent")}
              >
                <span className="app-footer__cookie-icon" aria-hidden>
                  🍪
                </span>
                {t("cookies.manageConsent")}
              </button>
              <Cookies />
            </div>
          </div>
        </div>

        <div className="app-footer__col app-footer__col--right" />
      </div>
    </footer>
  );
}

export default Footer;
