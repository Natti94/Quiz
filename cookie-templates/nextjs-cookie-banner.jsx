// Next.js Cookie Consent Component
// Place in components/CookieConsent.jsx or pages/_app.js

import { useState, useEffect } from 'react';
import { setCookie, getCookie, hasCookie } from 'cookies-next';

const CookieConsent = ({ lang = 'en' }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if consent already given
    const consentGiven = hasCookie('cookie_consent');
    if (!consentGiven) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      const savedPrefs = getCookie('cookie_preferences');
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
        } catch (error) {
          console.warn('Invalid cookie preferences');
        }
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };

    setPreferences(allAccepted);
    saveConsent(allAccepted);
    setShowBanner(false);

    // Update Google Consent Mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted'
      });
    }
  };

  const rejectAll = () => {
    const allRejected = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };

    setPreferences(allRejected);
    saveConsent(allRejected);
    setShowBanner(false);

    // Update Google Consent Mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied'
      });
    }
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);

    // Update Google Consent Mode based on preferences
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied'
      });
    }
  };

  const saveConsent = (prefs) => {
    setCookie('cookie_consent', 'true', {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    setCookie('cookie_preferences', JSON.stringify(prefs), {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Log consent for GDPR compliance
    logConsentEvent(prefs);
  };

  const logConsentEvent = async (prefs) => {
    try {
      await fetch('/api/consent/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: prefs,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.warn('Failed to log consent:', error);
    }
  };

  const texts = {
    en: {
      title: 'Cookie Preferences',
      description: 'We use cookies to enhance your experience and analyze site traffic.',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Required for basic site functionality.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us understand how visitors interact with our website.',
      functional: 'Functional Cookies',
      functionalDesc: 'Remember your preferences and settings.',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Used to deliver personalized advertisements.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      customize: 'Customize',
      save: 'Save Preferences',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy'
    }
  };

  const t = texts[lang] || texts.en;

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#2c3e50',
      color: 'white',
      padding: '20px',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{t.title}</h3>
            <p style={{ margin: '0 0 15px 0', lineHeight: '1.5' }}>{t.description}</p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: '#ecf0f1',
                  border: '1px solid #ecf0f1',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showDetails ? 'Hide Details' : t.customize}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={rejectAll}
              style={{
                padding: '10px 20px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {t.rejectAll}
            </button>
            <button
              onClick={acceptAll}
              style={{
                padding: '10px 20px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {t.acceptAll}
            </button>
          </div>
        </div>

        {showDetails && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: '#34495e',
            borderRadius: '4px'
          }}>
            <div style={{ display: 'grid', gap: '15px' }}>
              {/* Necessary Cookies */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <strong>{t.necessary}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#bdc3c7' }}>
                    {t.necessaryDesc}
                  </p>
                </div>
              </label>

              {/* Analytics Cookies */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <strong>{t.analytics}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#bdc3c7' }}>
                    {t.analyticsDesc}
                  </p>
                </div>
              </label>

              {/* Functional Cookies */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <strong>{t.functional}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#bdc3c7' }}>
                    {t.functionalDesc}
                  </p>
                </div>
              </label>

              {/* Marketing Cookies */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <strong>{t.marketing}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#bdc3c7' }}>
                    {t.marketingDesc}
                  </p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={saveCustomPreferences}
                style={{
                  padding: '10px 20px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {t.save}
              </button>
            </div>
          </div>
        )}

        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #34495e',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <a href="/privacy-policy" style={{ color: '#3498db', textDecoration: 'none', marginRight: '15px' }}>
            {t.privacy}
          </a>
          <a href="/cookie-policy" style={{ color: '#3498db', textDecoration: 'none' }}>
            {t.cookies}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;