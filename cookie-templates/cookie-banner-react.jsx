// React Cookie Consent Banner Component
// Install: npm install react-cookie-consent js-cookie

import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';

const CookieBanner = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Load saved preferences
    const saved = Cookies.get('cookie_preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    Cookies.set('cookie_preferences', JSON.stringify(allAccepted), { expires: 365 });
    Cookies.set('cookie_consent_given', 'true', { expires: 365 });

    // Enable tracking/analytics here
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const handleSavePreferences = () => {
    Cookies.set('cookie_preferences', JSON.stringify(preferences), { expires: 365 });
    Cookies.set('cookie_consent_given', 'true', { expires: 365 });

    // Update Google Consent Mode
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied'
      });
    }
  };

  const handleRejectAll = () => {
    const allRejected = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(allRejected);
    Cookies.set('cookie_preferences', JSON.stringify(allRejected), { expires: 365 });
    Cookies.set('cookie_consent_given', 'true', { expires: 365 });

    // Disable all tracking
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied'
      });
    }
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Reject All"
      enableDeclineButton
      onAccept={handleAcceptAll}
      onDecline={handleRejectAll}
      cookieName="cookie_consent_given"
      style={{
        background: '#2B373B',
        fontSize: '14px',
        padding: '20px'
      }}
      buttonStyle={{
        background: '#4CAF50',
        color: 'white',
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '4px'
      }}
      declineButtonStyle={{
        background: '#f44336',
        color: 'white',
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '4px'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 15px 0', lineHeight: '1.4' }}>
          We use cookies to enhance your browsing experience, serve personalized content,
          and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        </p>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              color: '#ccc',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '3px'
            }}
          >
            {showDetails ? 'Hide Details' : 'Customize Preferences'}
          </button>
        </div>

        {showDetails && (
          <div style={{
            background: '#1a1a1a',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>Cookie Preferences</h4>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  style={{ marginRight: '10px' }}
                />
                <strong>Necessary Cookies</strong> - Required for basic site functionality
              </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                  style={{ marginRight: '10px' }}
                />
                Analytics Cookies - Help us understand how visitors interact with our website
              </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                  style={{ marginRight: '10px' }}
                />
                Functional Cookies - Remember your preferences and settings
              </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                  style={{ marginRight: '10px' }}
                />
                Marketing Cookies - Used to deliver personalized advertisements
              </label>
            </div>

            <button
              onClick={handleSavePreferences}
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Save Preferences
            </button>
          </div>
        )}

        <div style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
          <a href="/privacy-policy" style={{ color: '#4CAF50', textDecoration: 'none' }}>
            Privacy Policy
          </a>
          {' | '}
          <a href="/cookie-policy" style={{ color: '#4CAF50', textDecoration: 'none' }}>
            Cookie Policy
          </a>
        </div>
      </div>
    </CookieConsent>
  );
};

export default CookieBanner;