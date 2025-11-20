// Vanilla JavaScript Cookie Consent Banner
// No dependencies required - pure JavaScript

class CookieConsentManager {
  constructor(options = {}) {
    this.options = {
      cookieName: 'cookie_consent',
      preferencesCookie: 'cookie_preferences',
      bannerId: 'cookie-banner',
      consentDuration: 365, // days
      onConsent: () => {},
      onReject: () => {},
      ...options
    };

    this.preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };

    this.init();
  }

  init() {
    // Check if consent already given
    if (this.getCookie(this.options.cookieName)) {
      this.loadSavedPreferences();
      this.options.onConsent(this.preferences);
      return;
    }

    this.createBanner();
    this.bindEvents();
  }

  createBanner() {
    const banner = document.createElement('div');
    banner.id = this.options.bannerId;
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <p>We use cookies to enhance your experience and analyze site traffic.
             You can choose which cookies to accept.</p>
        </div>

        <div class="cookie-banner-buttons">
          <button class="cookie-btn cookie-btn-secondary" id="customize-cookies">
            Customize
          </button>
          <button class="cookie-btn cookie-btn-secondary" id="reject-all-cookies">
            Reject All
          </button>
          <button class="cookie-btn cookie-btn-primary" id="accept-all-cookies">
            Accept All
          </button>
        </div>

        <div class="cookie-banner-details" id="cookie-details" style="display: none;">
          <h4>Cookie Preferences</h4>

          <div class="cookie-category">
            <label class="cookie-label">
              <input type="checkbox" checked disabled id="necessary-cookies">
              <span class="checkmark"></span>
              <div class="cookie-info">
                <strong>Necessary Cookies</strong>
                <p>Required for basic site functionality. Cannot be disabled.</p>
              </div>
            </label>
          </div>

          <div class="cookie-category">
            <label class="cookie-label">
              <input type="checkbox" id="analytics-cookies">
              <span class="checkmark"></span>
              <div class="cookie-info">
                <strong>Analytics Cookies</strong>
                <p>Help us understand how visitors interact with our website.</p>
              </div>
            </label>
          </div>

          <div class="cookie-category">
            <label class="cookie-label">
              <input type="checkbox" id="functional-cookies">
              <span class="checkmark"></span>
              <div class="cookie-info">
                <strong>Functional Cookies</strong>
                <p>Remember your preferences and settings.</p>
              </div>
            </label>
          </div>

          <div class="cookie-category">
            <label class="cookie-label">
              <input type="checkbox" id="marketing-cookies">
              <span class="checkmark"></span>
              <div class="cookie-info">
                <strong>Marketing Cookies</strong>
                <p>Used to deliver personalized advertisements.</p>
              </div>
            </label>
          </div>

          <div class="cookie-detail-buttons">
            <button class="cookie-btn cookie-btn-secondary" id="save-preferences">
              Save Preferences
            </button>
          </div>
        </div>

        <div class="cookie-banner-links">
          <a href="/privacy-policy">Privacy Policy</a> |
          <a href="/cookie-policy">Cookie Policy</a>
        </div>
      </div>
    `;

    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
      .cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2c3e50;
        color: white;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .cookie-banner-content {
        max-width: 1200px;
        margin: 0 auto;
      }

      .cookie-banner-text p {
        margin: 0 0 15px 0;
        line-height: 1.5;
      }

      .cookie-banner-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }

      .cookie-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .cookie-btn-primary {
        background: #27ae60;
        color: white;
      }

      .cookie-btn-primary:hover {
        background: #229954;
      }

      .cookie-btn-secondary {
        background: transparent;
        color: #ecf0f1;
        border: 1px solid #ecf0f1;
      }

      .cookie-btn-secondary:hover {
        background: rgba(255,255,255,0.1);
      }

      .cookie-banner-details {
        background: #34495e;
        padding: 20px;
        border-radius: 4px;
        margin: 15px 0;
      }

      .cookie-banner-details h4 {
        margin: 0 0 15px 0;
        color: #ecf0f1;
      }

      .cookie-category {
        margin-bottom: 15px;
      }

      .cookie-label {
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        position: relative;
      }

      .cookie-label input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .checkmark {
        width: 20px;
        height: 20px;
        background: #555;
        margin-right: 10px;
        border-radius: 3px;
        flex-shrink: 0;
        margin-top: 2px;
        position: relative;
      }

      .cookie-label input:checked ~ .checkmark {
        background: #27ae60;
      }

      .cookie-label input:checked ~ .checkmark:after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 14px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .cookie-info strong {
        display: block;
        color: #ecf0f1;
        margin-bottom: 5px;
      }

      .cookie-info p {
        margin: 0;
        font-size: 14px;
        color: #bdc3c7;
        line-height: 1.4;
      }

      .cookie-detail-buttons {
        text-align: center;
        margin-top: 20px;
      }

      .cookie-banner-links {
        font-size: 12px;
        text-align: center;
      }

      .cookie-banner-links a {
        color: #27ae60;
        text-decoration: none;
      }

      .cookie-banner-links a:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .cookie-banner-buttons {
          flex-direction: column;
        }

        .cookie-btn {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);
  }

  bindEvents() {
    // Accept all
    document.getElementById('accept-all-cookies').addEventListener('click', () => {
      this.acceptAll();
    });

    // Reject all
    document.getElementById('reject-all-cookies').addEventListener('click', () => {
      this.rejectAll();
    });

    // Customize
    document.getElementById('customize-cookies').addEventListener('click', () => {
      this.toggleDetails();
    });

    // Save preferences
    document.getElementById('save-preferences').addEventListener('click', () => {
      this.savePreferences();
    });

    // Update checkboxes when details are shown
    document.getElementById('customize-cookies').addEventListener('click', () => {
      this.updateCheckboxes();
    });
  }

  toggleDetails() {
    const details = document.getElementById('cookie-details');
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
  }

  updateCheckboxes() {
    document.getElementById('analytics-cookies').checked = this.preferences.analytics;
    document.getElementById('functional-cookies').checked = this.preferences.functional;
    document.getElementById('marketing-cookies').checked = this.preferences.marketing;
  }

  acceptAll() {
    this.preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    this.saveAndHide();
    this.options.onConsent(this.preferences);
  }

  rejectAll() {
    this.preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    this.saveAndHide();
    this.options.onReject(this.preferences);
  }

  savePreferences() {
    this.preferences.analytics = document.getElementById('analytics-cookies').checked;
    this.preferences.functional = document.getElementById('functional-cookies').checked;
    this.preferences.marketing = document.getElementById('marketing-cookies').checked;

    this.saveAndHide();
    this.options.onConsent(this.preferences);
  }

  saveAndHide() {
    this.setCookie(this.options.cookieName, 'true', this.options.consentDuration);
    this.setCookie(this.options.preferencesCookie, JSON.stringify(this.preferences), this.options.consentDuration);

    const banner = document.getElementById(this.options.bannerId);
    if (banner) {
      banner.style.display = 'none';
    }
  }

  loadSavedPreferences() {
    const saved = this.getCookie(this.options.preferencesCookie);
    if (saved) {
      try {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Invalid cookie preferences, using defaults');
      }
    }
  }

  // Cookie utility functions
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
  const consentManager = new CookieConsentManager({
    onConsent: (preferences) => {
      console.log('Consent given:', preferences);

      // Enable Google Analytics if consented
      if (preferences.analytics && typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }

      // Enable marketing pixels if consented
      if (preferences.marketing) {
        // Load Facebook Pixel, etc.
      }
    },
    onReject: (preferences) => {
      console.log('Consent rejected:', preferences);

      // Disable all tracking
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied'
        });
      }
    }
  });
});