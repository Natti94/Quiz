// Cookie Utilities Library
// Comprehensive cookie management functions

class CookieUtils {
  constructor(options = {}) {
    this.defaultOptions = {
      secure: true,
      sameSite: 'strict',
      ...options
    };
  }

  // Set a cookie with security defaults
  set(name, value, options = {}) {
    const opts = { ...this.defaultOptions, ...options };

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (opts.maxAge) {
      cookieString += `; max-age=${opts.maxAge}`;
    }

    if (opts.expires) {
      cookieString += `; expires=${opts.expires.toUTCString()}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    } else {
      cookieString += '; path=/';
    }

    if (opts.domain) {
      cookieString += `; domain=${opts.domain}`;
    }

    if (opts.secure) {
      cookieString += '; secure';
    }

    if (opts.httpOnly) {
      cookieString += '; httponly';
    }

    if (opts.sameSite) {
      cookieString += `; samesite=${opts.sameSite}`;
    }

    document.cookie = cookieString;
    return true;
  }

  // Get a cookie value
  get(name) {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  // Check if a cookie exists
  exists(name) {
    return this.get(name) !== null;
  }

  // Remove a cookie
  remove(name, options = {}) {
    const opts = { ...options, maxAge: -1 };
    this.set(name, '', opts);
    return true;
  }

  // Get all cookies as an object
  getAll() {
    const cookies = {};
    const cookieArray = document.cookie.split(';');

    cookieArray.forEach(cookie => {
      cookie = cookie.trim();
      const [name, ...valueParts] = cookie.split('=');
      if (name) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(valueParts.join('='));
      }
    });

    return cookies;
  }

  // Clear all cookies (use with caution)
  clearAll(options = {}) {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(name => {
      this.remove(name, options);
    });
    return true;
  }

  // Set multiple cookies at once
  setMultiple(cookies) {
    Object.entries(cookies).forEach(([name, config]) => {
      if (typeof config === 'string') {
        this.set(name, config);
      } else {
        this.set(name, config.value, config.options);
      }
    });
    return true;
  }

  // Cookie security helpers
  setSecureSession(name, value) {
    return this.set(name, value, {
      httpOnly: false, // Can't set httpOnly from client-side
      secure: true,
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });
  }

  setAnalyticsConsent(granted) {
    return this.set('analytics_consent', granted ? 'true' : 'false', {
      maxAge: 31536000, // 1 year
      secure: true,
      sameSite: 'lax'
    });
  }

  setMarketingConsent(granted) {
    return this.set('marketing_consent', granted ? 'true' : 'false', {
      maxAge: 31536000, // 1 year
      secure: true,
      sameSite: 'lax'
    });
  }

  // GDPR compliance helpers
  hasConsent(category) {
    const consent = this.get(`${category}_consent`);
    return consent === 'true';
  }

  getConsentStatus() {
    return {
      necessary: true, // Always true
      analytics: this.hasConsent('analytics'),
      marketing: this.hasConsent('marketing'),
      functional: this.hasConsent('functional')
    };
  }

  setConsentStatus(status) {
    const cookies = {};

    if (status.analytics !== undefined) {
      cookies.analytics_consent = status.analytics ? 'true' : 'false';
    }

    if (status.marketing !== undefined) {
      cookies.marketing_consent = status.marketing ? 'true' : 'false';
    }

    if (status.functional !== undefined) {
      cookies.functional_consent = status.functional ? 'true' : 'false';
    }

    return this.setMultiple(cookies);
  }

  // Cookie parsing and validation
  parseCookieString(cookieString) {
    const parts = cookieString.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split('=');

    const cookie = {
      name: decodeURIComponent(name),
      value: decodeURIComponent(value || ''),
      attributes: {}
    };

    attributes.forEach(attr => {
      const [key, val] = attr.split('=');
      cookie.attributes[key.toLowerCase()] = val || true;
    });

    return cookie;
  }

  // Validate cookie security
  validateSecurity(name) {
    const cookieString = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith(encodeURIComponent(name) + '='));

    if (!cookieString) return null;

    const parsed = this.parseCookieString(cookieString);

    return {
      hasSecure: !!parsed.attributes.secure,
      hasHttpOnly: !!parsed.attributes.httponly,
      sameSite: parsed.attributes.samesite || 'lax',
      isValid: parsed.attributes.secure && parsed.attributes.samesite
    };
  }

  // Batch operations
  migrateOldCookies(migrations) {
    // Example: { 'old_cookie': 'new_cookie' }
    Object.entries(migrations).forEach(([oldName, newName]) => {
      const value = this.get(oldName);
      if (value !== null) {
        this.set(newName, value);
        this.remove(oldName);
      }
    });
  }

  // Expiration helpers
  setWithExpiration(name, value, hours) {
    return this.set(name, value, {
      maxAge: hours * 3600
    });
  }

  setSessionCookie(name, value) {
    // Expires when browser closes
    return this.set(name, value, {
      maxAge: null,
      expires: null
    });
  }

  // JSON cookie helpers
  setJSON(name, object, options = {}) {
    try {
      return this.set(name, JSON.stringify(object), options);
    } catch (error) {
      console.error('Failed to stringify JSON for cookie:', error);
      return false;
    }
  }

  getJSON(name) {
    const value = this.get(name);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Failed to parse JSON from cookie:', error);
      return null;
    }
  }

  // Debug helpers
  logAll() {
    console.table(this.getAll());
  }

  getCookieStats() {
    const cookies = this.getAll();
    const stats = {
      total: Object.keys(cookies).length,
      secure: 0,
      httpOnly: 0,
      sameSite: { strict: 0, lax: 0, none: 0 }
    };

    Object.keys(cookies).forEach(name => {
      const validation = this.validateSecurity(name);
      if (validation) {
        if (validation.hasSecure) stats.secure++;
        if (validation.hasHttpOnly) stats.httpOnly++;
        stats.sameSite[validation.sameSite]++;
      }
    });

    return stats;
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CookieUtils;
} else if (typeof window !== 'undefined') {
  window.CookieUtils = CookieUtils;
}