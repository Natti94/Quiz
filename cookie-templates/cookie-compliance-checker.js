// Cookie Compliance Checker
// Run with: node cookie-compliance-checker.js [url]

const https = require('https');
const http = require('http');
const { URL } = require('url');

class CookieComplianceChecker {
  constructor(options = {}) {
    this.options = {
      userAgent: 'Cookie-Compliance-Checker/1.0',
      timeout: 10000,
      followRedirects: true,
      maxRedirects: 5,
      ...options
    };
  }

  async checkWebsite(url) {
    console.log(`🔍 Checking cookie compliance for: ${url}`);
    console.log('=' .repeat(60));

    try {
      const response = await this.makeRequest(url);
      const results = {
        url,
        timestamp: new Date().toISOString(),
        statusCode: response.statusCode,
        headers: response.headers,
        cookies: this.parseCookies(response.headers['set-cookie'] || []),
        compliance: {}
      };

      // Run compliance checks
      results.compliance = this.runComplianceChecks(results);

      this.displayResults(results);
      return results;

    } catch (error) {
      console.error(`❌ Error checking website: ${error.message}`);
      return { url, error: error.message };
    }
  }

  async makeRequest(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': this.options.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'close'
        },
        timeout: this.options.timeout
      };

      const req = client.request(options, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirectCount < this.options.maxRedirects && this.options.followRedirects) {
            const redirectUrl = new URL(res.headers.location, url).href;
            console.log(`↪️  Redirecting to: ${redirectUrl}`);
            return this.makeRequest(redirectUrl, redirectCount + 1)
              .then(resolve)
              .catch(reject);
          }
        }

        resolve(res);
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  parseCookies(setCookieHeaders) {
    const cookies = [];

    setCookieHeaders.forEach(header => {
      const cookie = this.parseCookieString(header);
      cookies.push(cookie);
    });

    return cookies;
  }

  parseCookieString(cookieString) {
    const parts = cookieString.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split('=');

    const cookie = {
      name: name || '',
      value: value || '',
      attributes: {}
    };

    attributes.forEach(attr => {
      const [key, val] = attr.split('=');
      const lowerKey = key.toLowerCase();
      cookie.attributes[lowerKey] = val || true;
    });

    return cookie;
  }

  runComplianceChecks(results) {
    const checks = {
      hasCookieBanner: false,
      hasPrivacyPolicy: false,
      hasCookiePolicy: false,
      secureCookies: 0,
      insecureCookies: 0,
      httpOnlyCookies: 0,
      sameSiteCookies: 0,
      sessionCookies: 0,
      persistentCookies: 0,
      thirdPartyCookies: 0,
      issues: []
    };

    // Check cookies
    results.cookies.forEach(cookie => {
      // Security checks
      if (cookie.attributes.secure) {
        checks.secureCookies++;
      } else {
        checks.insecureCookies++;
        checks.issues.push(`Insecure cookie: ${cookie.name}`);
      }

      if (cookie.attributes.httponly) {
        checks.httpOnlyCookies++;
      }

      if (cookie.attributes.samesite) {
        checks.sameSiteCookies++;
      } else {
        checks.issues.push(`Missing SameSite attribute: ${cookie.name}`);
      }

      // Expiration checks
      if (cookie.attributes['max-age'] || cookie.attributes.expires) {
        checks.persistentCookies++;
      } else {
        checks.sessionCookies++;
      }

      // Third-party detection (simplified)
      if (cookie.name.includes('_ga') || cookie.name.includes('_gid')) {
        checks.thirdPartyCookies++;
      }
    });

    // Check for common compliance indicators in headers
    const headers = results.headers;

    if (headers['content-security-policy']) {
      checks.hasCSP = true;
    }

    if (headers['strict-transport-security']) {
      checks.hasHSTS = true;
    }

    return checks;
  }

  displayResults(results) {
    console.log(`📊 Compliance Report for ${results.url}`);
    console.log(`Status: ${results.statusCode}`);
    console.log(`Cookies Found: ${results.cookies.length}`);
    console.log('');

    console.log('🍪 Cookie Analysis:');
    results.cookies.forEach(cookie => {
      const secure = cookie.attributes.secure ? '🔒' : '⚠️ ';
      const httpOnly = cookie.attributes.httponly ? '🛡️ ' : '';
      const sameSite = cookie.attributes.samesite ? `(${cookie.attributes.samesite})` : '(missing)';

      console.log(`  ${secure}${httpOnly}${cookie.name}: SameSite=${sameSite}`);
    });

    console.log('');
    console.log('⚖️  Compliance Summary:');
    const c = results.compliance;

    console.log(`  Secure Cookies: ${c.secureCookies}/${results.cookies.length}`);
    console.log(`  HttpOnly Cookies: ${c.httpOnlyCookies}/${results.cookies.length}`);
    console.log(`  SameSite Cookies: ${c.sameSiteCookies}/${results.cookies.length}`);
    console.log(`  Session Cookies: ${c.sessionCookies}`);
    console.log(`  Persistent Cookies: ${c.persistentCookies}`);

    if (c.issues.length > 0) {
      console.log('');
      console.log('🚨 Issues Found:');
      c.issues.forEach(issue => console.log(`  ❌ ${issue}`));
    } else {
      console.log('');
      console.log('✅ No obvious cookie security issues found');
    }

    console.log('');
    console.log('📋 Recommendations:');

    if (c.insecureCookies > 0) {
      console.log('  • Set Secure flag on all cookies in production');
    }

    if (results.cookies.length - c.sameSiteCookies > 0) {
      console.log('  • Add SameSite attribute to all cookies');
    }

    if (c.httpOnlyCookies < results.cookies.length) {
      console.log('  • Consider HttpOnly flag for session/auth cookies');
    }

    console.log('  • Implement cookie consent banner');
    console.log('  • Create privacy and cookie policies');
    console.log('  • Regular cookie audit and cleanup');
  }

  async checkMultiple(urls) {
    const results = [];

    for (const url of urls) {
      const result = await this.checkWebsite(url);
      results.push(result);

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  generateReport(results) {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalSites: results.length,
        totalCookies: results.reduce((sum, r) => sum + (r.cookies?.length || 0), 0),
        sitesWithIssues: results.filter(r => r.compliance?.issues?.length > 0).length
      },
      results
    };

    return report;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node cookie-compliance-checker.js <url> [url2] [url3]');
    console.log('Example: node cookie-compliance-checker.js https://example.com');
    process.exit(1);
  }

  const checker = new CookieComplianceChecker();

  if (args.length === 1) {
    checker.checkWebsite(args[0]);
  } else {
    checker.checkMultiple(args).then(results => {
      console.log('\n📄 Batch Report Summary:');
      console.log(`Sites checked: ${results.length}`);
      console.log(`Total cookies found: ${results.reduce((sum, r) => sum + (r.cookies?.length || 0), 0)}`);
      console.log(`Sites with issues: ${results.filter(r => r.compliance?.issues?.length > 0).length}`);
    });
  }
}

module.exports = CookieComplianceChecker;