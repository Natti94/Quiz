// Cookie consent utilities
const CONSENT_KEY = "cookie_consent";
const CONSENT_TIMESTAMP_KEY = "cookie_consent_timestamp";
const CONSENT_VERSION = "1.0";

export const CookieCategories = {
  NECESSARY: "necessary",
  FUNCTIONAL: "functional",
  ANALYTICS: "analytics",
};

export const getCookieConsent = () => {
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  } catch {
    return null;
  }
};

export const setCookieConsent = (preferences) => {
  try {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        ...preferences,
        version: CONSENT_VERSION,
      }),
    );
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    return true;
  } catch {
    return false;
  }
};

export const hasConsented = () => {
  return getCookieConsent() !== null;
};

export const clearCookieConsent = () => {
  try {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
    return true;
  } catch {
    return false;
  }
};

export const isCategoryAllowed = (category) => {
  const consent = getCookieConsent();
  if (!consent) return category === CookieCategories.NECESSARY;
  return consent[category] === true || category === CookieCategories.NECESSARY;
};
