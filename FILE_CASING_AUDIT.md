# File Casing Audit Report - Netlify Deployment

## ⚠️ Critical Issues Found

Netlify deploys to **Linux (case-sensitive)** while Windows is **case-insensitive**. This causes imports to break in production.

---

## 🔴 **MISMATCHES - Must Fix**

### 1. CSS Module Files

| Import Statement | Actual Filename | Status | Fix Required |
|-----------------|-----------------|---------|--------------|
| `./language-selector.css` | `language.selector.css` | ❌ MISMATCH | Rename file or update import |
| `./side-nav.css` | `side.nav.module.css` | ❌ MISMATCH | Rename file or update import |
| `./cookie-consent.css` | `cookie.consent.css` | ❌ MISMATCH | Rename file or update import |

**Files to Check:**
```
quiz-frontend/src/components/header/header-wrapper/language/
  - Importing: language-selector.css
  - Actual: language.selector.css

quiz-frontend/src/components/nav/
  - Importing: side-nav.css
  - Actual: side.nav.module.css

quiz-frontend/src/components/footer/footer-wrapper/cookies/
  - Importing: cookie-consent.css
  - Actual: cookie.consent.css
```

### 2. Component Files (Case Sensitivity)

| Import Statement | Actual Filename | Status |
|-----------------|-----------------|---------|
| `./content-wrapper/Subjects` | `Subjects.jsx` | ✅ Match |
| `./content-wrapper/Form` | `Form.jsx` | ✅ Match |
| `./header-wrapper/auth/Auth.jsx` | `Auth.jsx` | ✅ Match |

---

## 🟡 **WARNINGS - Inconsistent Patterns**

### Mixed Casing Conventions

Your project uses **three different naming conventions**:

#### Pattern 1: PascalCase (Components)
```
✅ Good for components:
Header.jsx
Footer.jsx
Content.jsx
SideNav.jsx
LanguageSelector.jsx
CookieConsent.jsx
```

#### Pattern 2: kebab-case (CSS files)
```
⚠️ Imported but don't exist:
language-selector.css
side-nav.css
cookie-consent.css
```

#### Pattern 3: dot.case (Actual CSS files)
```
⚠️ Exist but not imported correctly:
language.selector.css
side.nav.module.css
cookie.consent.css
```

---

## ✅ **CORRECT PATTERNS**

These files follow good conventions:

```
✅ Components (PascalCase):
- Header.jsx + header.css
- Footer.jsx + Footer.css (inconsistent but works)
- Content.jsx + Content.css (inconsistent but works)
- Updates.jsx + updates.css
- Statistics.jsx + statistics.css
- Pages.jsx + pages.css

✅ Utility files (camelCase):
- cookies.js
- jwtUtils.js
- authService.js
```

---

## 📋 **RECOMMENDED FIXES**

### Option 1: Rename CSS Files (Recommended)
Make filenames match imports:

```bash
# In quiz-frontend/src/components/header/header-wrapper/language/
mv language.selector.css language-selector.css

# In quiz-frontend/src/components/nav/
mv side.nav.module.css side-nav.css

# In quiz-frontend/src/components/footer/footer-wrapper/cookies/
mv cookie.consent.css cookie-consent.css
```

### Option 2: Update Import Statements
Change imports to match actual filenames:

```javascript
// LanguageSelector.jsx
-import "./language-selector.css";
+import "./language.selector.css";

// SideNav.jsx
-import "./side-nav.css";
+import "./side.nav.module.css";

// CookieConsent.jsx
-import "./cookie-consent.css";
+import "./cookie.consent.css";
```

---

## 📐 **RECOMMENDED NAMING STANDARD**

For consistency and Netlify compatibility:

### Components
```
PascalCase.jsx + kebab-case.css or PascalCase.css

Examples:
✅ Button.jsx + button.css
✅ UserProfile.jsx + user-profile.css
✅ CookieConsent.jsx + cookie-consent.css
```

### Utilities & Services
```
camelCase.js

Examples:
✅ authService.js
✅ jwtUtils.js
✅ cookies.js
```

### Data Files
```
camelCase.js or kebab-case.js

Examples:
✅ waiExam.js
✅ pluExam.js
✅ apt.js
```

---

## 🔍 **HOW TO VERIFY**

### Before Deployment:
```bash
# Check for case-sensitive import issues
npm run build

# If build succeeds, test locally
npm run preview
```

### After Fixing:
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

---

## 🚀 **ACTION ITEMS**

### High Priority (Breaks Deployment)
- [ ] Fix `language.selector.css` → `language-selector.css`
- [ ] Fix `side.nav.module.css` → `side-nav.css` 
- [ ] Fix `cookie.consent.css` → `cookie-consent.css`

### Medium Priority (Consistency)
- [ ] Standardize all CSS naming to kebab-case
- [ ] Ensure component imports match exact casing
- [ ] Update naming convention documentation

### Low Priority (Nice to Have)
- [ ] Add ESLint rule for import casing
- [ ] Add pre-commit hook to check case sensitivity
- [ ] Document naming conventions in README

---

## 🛠️ **AUTOMATION SCRIPT**

Run this PowerShell script to fix all mismatches:

```powershell
cd C:\dev_natti\quiz\quiz-frontend

# Rename CSS files to match imports
Rename-Item "src\components\header\header-wrapper\language\language.selector.css" "language-selector.css"
Rename-Item "src\components\nav\side.nav.module.css" "side-nav.css"
Rename-Item "src\components\footer\footer-wrapper\cookies\cookie.consent.css" "cookie-consent.css"

# Verify
npm run build
```

---

## 📚 **Additional Resources**

- [Netlify Build Docs](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Vite Case Sensitivity](https://vitejs.dev/guide/troubleshooting.html#case-sensitivity)
- [JavaScript Module Import Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
