import { useState, useEffect } from "react";
import { useTranslation } from "../../../../i18n/useTranslation";
import {
  getCookieConsent,
  setCookieConsent,
  hasConsented,
  CookieCategories,
} from "../../../../utils/cookies";
import "./cookie-consent.css";

function CookieConsent() {
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
    <div className="cookie-consent-overlay" role="dialog" aria-modal="true">
      <div className="cookie-consent">
        {!showCustomize ? (
          <>
            <h2 className="cookie-consent__title">{t("cookies.title")}</h2>
            <p className="cookie-consent__description">
              {t("cookies.description")}
            </p>

            <div className="cookie-consent__actions">
              <button
                type="button"
                className="cookie-btn cookie-btn--primary"
                onClick={handleAcceptAll}
              >
                {t("cookies.acceptAll")}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--secondary"
                onClick={handleAcceptNecessary}
              >
                {t("cookies.acceptNecessary")}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--tertiary"
                onClick={() => setShowCustomize(true)}
              >
                {t("cookies.customize")}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="cookie-consent__title">{t("cookies.customize")}</h2>

            <div className="cookie-consent__categories">
              <div className="cookie-category">
                <label className="cookie-category__label">
                  <input
                    type="checkbox"
                    checked={preferences[CookieCategories.NECESSARY]}
                    disabled
                    className="cookie-category__checkbox"
                  />
                  <div className="cookie-category__content">
                    <strong>{t("cookies.necessary")}</strong>
                    <p className="cookie-category__desc">
                      {t("cookies.necessaryDesc")}
                    </p>
                  </div>
                </label>
              </div>

              <div className="cookie-category">
                <label className="cookie-category__label">
                  <input
                    type="checkbox"
                    checked={preferences[CookieCategories.FUNCTIONAL]}
                    onChange={() => toggleCategory(CookieCategories.FUNCTIONAL)}
                    className="cookie-category__checkbox"
                  />
                  <div className="cookie-category__content">
                    <strong>{t("cookies.functional")}</strong>
                    <p className="cookie-category__desc">
                      {t("cookies.functionalDesc")}
                    </p>
                  </div>
                </label>
              </div>

              <div className="cookie-category">
                <label className="cookie-category__label">
                  <input
                    type="checkbox"
                    checked={preferences[CookieCategories.ANALYTICS]}
                    onChange={() => toggleCategory(CookieCategories.ANALYTICS)}
                    className="cookie-category__checkbox"
                  />
                  <div className="cookie-category__content">
                    <strong>{t("cookies.analytics")}</strong>
                    <p className="cookie-category__desc">
                      {t("cookies.analyticsDesc")}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="cookie-consent__actions">
              <button
                type="button"
                className="cookie-btn cookie-btn--primary"
                onClick={handleSavePreferences}
              >
                {t("cookies.savePreferences")}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--tertiary"
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

export default CookieConsent;
