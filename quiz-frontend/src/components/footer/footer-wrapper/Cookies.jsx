import { useState, useEffect } from "react";
import { useTranslation } from "../../../lib/i18n/useTranslation";
import {
  getCookieConsent,
  setCookieConsent,
  hasConsented,
  CookieCategories,
} from "../../../utils/cookies";

function Cookies() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    [CookieCategories.NECESSARY]: true,
    [CookieCategories.FUNCTIONAL]: false,
    [CookieCategories.ANALYTICS]: false,
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!hasConsented()) {
      setShowBanner(true);
    } else if (consent) {
      setPreferences(consent);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      [CookieCategories.NECESSARY]: true,
      [CookieCategories.FUNCTIONAL]: true,
      [CookieCategories.ANALYTICS]: true,
    };
    setCookieConsent(allAccepted);
    setPreferences(allAccepted);
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      [CookieCategories.NECESSARY]: true,
      [CookieCategories.FUNCTIONAL]: false,
      [CookieCategories.ANALYTICS]: false,
    };
    setCookieConsent(necessaryOnly);
    setPreferences(necessaryOnly);
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    setShowBanner(false);
    setShowCustomize(false);
  };

  const toggleCategory = (category) => {
    if (category === CookieCategories.NECESSARY) return;
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!showBanner) return null;

  return (
    <div
      className="app-footer__cookie-consent-overlay"
      role="dialog"
      aria-modal="true"
    >
      <div className="app-footer__cookie-consent">
        {!showCustomize ? (
          <>
            <h2 className="app-footer__cookie-consent-title">
              {t("cookies.title")}
            </h2>
            <p className="app-footer__cookie-consent-description">
              {t("cookies.description")}
            </p>

            <div className="app-footer__cookie-consent-actions">
              <button
                type="button"
                className="app-footer__cookie-btn app-footer__cookie-btn--primary"
                onClick={handleAcceptAll}
              >
                {t("cookies.acceptAll")}
              </button>
              <button
                type="button"
                className="app-footer__cookie-btn app-footer__cookie-btn--secondary"
                onClick={handleAcceptNecessary}
              >
                {t("cookies.acceptNecessary")}
              </button>
              <button
                type="button"
                className="app-footer__cookie-btn app-footer__cookie-btn--tertiary"
                onClick={() => setShowCustomize(true)}
              >
                {t("cookies.customize")}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="app-footer__cookie-consent-title">
              {t("cookies.customize")}
            </h2>

            <div className="app-footer__cookie-consent-categories">
              <div className="app-footer__cookie-category">
                <label className="app-footer__cookie-category-label">
                  <input
                    type="checkbox"
                    checked={preferences[CookieCategories.NECESSARY]}
                    disabled
                    className="app-footer__cookie-category-checkbox"
                  />
                  <div className="app-footer__cookie-category-content">
                    <strong>{t("cookies.necessary")}</strong>
                    <p className="app-footer__cookie-category-desc">
                      {t("cookies.necessaryDesc")}
                    </p>
                  </div>
                </label>
              </div>

              <div className="app-footer__cookie-category">
                <label className="app-footer__cookie-category-label">
                  <input
                    type="checkbox"
                    checked={preferences[CookieCategories.FUNCTIONAL]}
                    onChange={() => toggleCategory(CookieCategories.FUNCTIONAL)}
                    className="app-footer__cookie-category-checkbox"
                  />
                  <div className="app-footer__cookie-category-content">
                    <strong>{t("cookies.functional")}</strong>
                    <p className="app-footer__cookie-category-desc">
                      {t("cookies.functionalDesc")}
                    </p>
                  </div>
                </label>
              </div>

              <div className="app-footer__cookie-category">
                <label className="app-footer__cookie-category-label">
                  <input
                    type="checkbox"
                    checked={preferences[CookieCategories.ANALYTICS]}
                    onChange={() => toggleCategory(CookieCategories.ANALYTICS)}
                    className="app-footer__cookie-category-checkbox"
                  />
                  <div className="app-footer__cookie-category-content">
                    <strong>{t("cookies.analytics")}</strong>
                    <p className="app-footer__cookie-category-desc">
                      {t("cookies.analyticsDesc")}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="app-footer__cookie-consent-actions">
              <button
                type="button"
                className="app-footer__cookie-btn app-footer__cookie-btn--primary"
                onClick={handleSavePreferences}
              >
                {t("cookies.savePreferences")}
              </button>
              <button
                type="button"
                className="app-footer__cookie-btn app-footer__cookie-btn--tertiary"
                onClick={() => setShowCustomize(false)}
              >
                {t("quizSelector.cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cookies;
