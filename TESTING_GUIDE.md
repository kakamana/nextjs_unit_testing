# 🧪 Complete Testing Guide - QA & Security

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [QA Testing (Functional & Non-Functional)](#qa-testing)
- [Accessibility Testing (WCAG)](#accessibility-testing)
- [Security Testing (OWASP VAPT)](#security-testing)
- [CI/CD Integration](#cicd-integration)
- [Report Generation](#report-generation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js 20.x LTS** (or Node 23.7.0 - works with warnings)
- **Docker Desktop** (for OWASP ZAP scans)
- **Git** (for version control)

### Installation Check
```cmd
node --version
docker --version
git --version
```

---

## Quick Start

### 1. Install Dependencies
```cmd
npm install
```

### 2. Run All Tests (Quick Check)
```cmd
# Run all unit tests
npm test

# Run all security unit tests
npm run security:unit
```

---

## QA Testing (Functional & Non-Functional)

### Functional Testing

#### Run All Unit Tests
```cmd
npm test
```

**What it tests:**
- ✅ Component rendering (ProfileForm, ProfilePreview, ImageUpload, etc.)
- ✅ User interactions (typing, clicking, form submission)
- ✅ Form validation (email format, required fields)
- ✅ State management (form data updates)
- ✅ Event handlers (onChange, onSubmit)
- ✅ Props passing and component integration

#### Run Tests in Watch Mode (During Development)
```cmd
npm run test:watch
```

#### Run Tests with Coverage
```cmd
npm test -- --coverage
```

**Coverage targets:**
- Statements: ≥ 80%
- Branches: ≥ 80%
- Functions: ≥ 80%
- Lines: ≥ 80%

#### View Coverage Report
```cmd
# Open in browser
start coverage/lcov-report/index.html
```

### Non-Functional Testing

#### Performance Testing
```cmd
# Build and measure build time
npm run build

# Check bundle size
npm run build -- --profile
```

#### Accessibility Testing
```cmd
# Run tests with accessibility checks (if configured)
npm test -- --testNamePattern="accessibility"
```

### Generate QA Report
```cmd
# Step 1: Run tests with coverage
npm test -- --coverage

# Step 2: Generate QA report (HTML + PDF)
npm run qa:report
```

**Output:**
- `artifacts/qa/qa-report.html`
- `artifacts/qa/qa-report.pdf` ⭐ (For QA/ISR sign-off)
- `coverage/lcov-report/index.html` (Detailed coverage)

---

## Accessibility Testing (WCAG)

This section covers how to run accessibility tests to ensure the application is usable by people with disabilities, following the Web Content Accessibility Guidelines (WCAG).

### Run Accessibility Tests
```cmd
npm run test:accessibility
```

**What it tests:**
- ✅ Color contrast
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Form labels
- ✅ Image alt text
- ✅ And many other WCAG rules via `axe-core`.

**Output:**
- `artifacts/accessibility/accessibility-results.json`

### Generate Accessibility Report
```cmd
# Step 1: Run accessibility tests
npm run test:accessibility

# Step 2: Generate accessibility report (HTML + PDF)
npm run report:accessibility
```

**Output:**
- `artifacts/accessibility/accessibility-report.html`
- `artifacts/accessibility/accessibility-report.pdf` ⭐ (For accessibility compliance sign-off)

---

## Security Testing (OWASP VAPT)

### Security Test Categories

Our implementation covers **OWASP Top 10 (2021)**:

1. **A01:2021 – Broken Access Control**
   - ✅ Headers security (HSTS, X-Frame-Options, CSP)
   - ⏳ Role-based access control (authentication.test.ts)

2. **A02:2021 – Cryptographic Failures**
   - ✅ HTTPS enforcement (HSTS header)
   - ✅ Secure cookie settings

3. **A03:2021 – Injection**
   - ✅ XSS prevention (input-validation.test.ts)
   - ✅ SQL injection detection patterns
   - ✅ Command injection prevention
   - ✅ Path traversal detection

4. **A04:2021 – Insecure Design**
   - ✅ Rate limiting (rate-limiting.test.ts)
   - ✅ Brute force protection

5. **A05:2021 – Security Misconfiguration**
   - ✅ Security headers (headers.test.ts)
   - ✅ CORS configuration
   - ✅ Error handling (no stack traces in production)

6. **A06:2021 – Vulnerable Components**
   - ✅ OWASP ZAP dependency checks
   - ⏳ npm audit (can add to CI)

7. **A07:2021 – Identification & Authentication**
   - ✅ Password policies (authentication.test.ts)
   - ✅ Session management
   - ✅ MFA support tests

8. **A08:2021 – Software and Data Integrity**
   - ✅ File upload validation (input-validation.test.ts)
   - ✅ MIME type verification
   - ✅ Double extension detection

9. **A09:2021 – Security Logging**
   - ⏳ Audit logging (can be added)

10. **A10:2021 – SSRF**
    - ✅ URL validation
    - ✅ Suspicious scheme detection

### Running Security Tests

#### 1. Security Unit Tests
```cmd
# Run all security unit tests
npm run security:unit
```

**What it tests:**
- Security headers configuration
- Input validation patterns
- XSS prevention
- SQL injection detection
- Command injection prevention
- File upload validation
- Buffer overflow prevention
- Rate limiting logic
- Authentication patterns

#### 2. SAST (Static Application Security Testing)
```cmd
# Run ESLint security scan
npm run security:sast
```

**Output:**
- `artifacts/security/eslint.json`

**What it detects:**
- Code quality issues
- Potential security vulnerabilities
- TypeScript errors
- Best practice violations

#### 3. DAST (Dynamic Application Security Testing) - OWASP ZAP

**Prerequisites:**
- Docker Desktop must be running
- Next.js dev server must be running

**Step-by-step:**

```cmd
# Terminal 1: Start Next.js app
npm run dev

# Terminal 2: Run ZAP baseline scan (wait for app to start)
npm run security:zap:local
```

**What it scans:**
- ✅ Security headers presence
- ✅ CSP configuration
- ✅ Cookie security
- ✅ SSL/TLS configuration
- ✅ Vulnerable JavaScript libraries
- ✅ Information disclosure
- ✅ Cross-site scripting (XSS)
- ✅ CSRF protection
- ✅ Clickjacking protection
- ✅ And 50+ other OWASP checks

**ZAP scan typically takes 2-5 minutes.**

**Output:**
- `artifacts/security/zap_report.html` (Detailed findings)
- `artifacts/security/zap_report.json` (Machine-readable)

#### 4. File Upload Security Testing

**Manual test (recommended):**
1. Start the app: `npm run dev`
2. Try uploading:
   - ✅ Valid: `image.png`, `photo.jpg`, `avatar.svg`
   - ❌ Malicious: `script.php`, `malware.exe`, `shell.sh`
   - ❌ Double extension: `image.png.exe`, `photo.jpg.php`
   - ❌ Large files: > 5MB (should be rejected)

**Automated test:**
```cmd
# Run file validation tests
npm run security:unit -- --testNamePattern="File Upload"
```

#### 5. Buffer Overflow Testing

**Automated test:**
```cmd
npm run security:unit -- --testNamePattern="Buffer Overflow"
```

**Manual test:**
1. Open app: `http://localhost:3000`
2. Try pasting very long strings (>10,000 chars) into:
   - First Name field
   - Last Name field
   - Email field
   - Description field
   - Social links

**Expected behavior:**
- Input should be truncated or rejected
- No app crashes
- No console errors

#### 6. XSS Testing

**Automated test:**
```cmd
npm run security:unit -- --testNamePattern="XSS"
```

**Manual XSS payloads to test:**
```javascript
// Test these in input fields:
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')">
```

**Expected behavior:**
- No alert boxes appear
- Input is sanitized or escaped
- `<` and `>` are converted to `&lt;` and `&gt;`

### Generate Security Report

```cmd
# After running ZAP scan
npm run security:report
```

**Output:**
- `artifacts/security/security-report.html`
- `artifacts/security/security-report.pdf` ⭐ (For ISR/Security team sign-off)

---

## Complete Testing Workflow

### Local Testing (Before Commit)

```cmd
# Step 1: Run all unit tests with coverage
npm test -- --coverage

# Step 2: Run security unit tests
npm run security:unit

# Step 3: Run SAST scan
npm run security:sast

# Step 4: Start app and run ZAP scan
# Terminal 1:
npm run dev

# Terminal 2:
npm run security:zap:local

# Step 5: Generate reports
npm run qa:report
npm run security:report

# Step 6: Review reports
start artifacts\qa\qa-report.pdf
start artifacts\security\security-report.pdf
```

### CI/CD Testing (GitHub Actions)

**Automatic on every push to `main`:**

1. ✅ Run unit tests with coverage
2. ✅ Build Next.js app
3. ✅ Start production server
4. ✅ Run ESLint security scan
5. ✅ Run OWASP ZAP baseline scan
6. ✅ Generate QA report
7. ✅ Generate security report
8. ✅ Upload artifacts
9. ✅ Gate on High severity alerts

**View results:**
1. Go to: `https://github.com/kakamana/nextjs_unit_testing/actions`
2. Click latest workflow run
3. Download artifacts:
   - `qa-artifacts.zip`
   - `security-artifacts.zip`

---

## Report Generation

### QA Report Contents

**Metrics included:**
- ✅ Test execution summary (44 tests)
- ✅ Statement coverage (87.4%)
- ✅ Branch coverage (95%)
- ✅ Function coverage (95.65%)
- ✅ Line coverage (87.4%)
- ✅ Visual coverage bars
- ✅ QA sign-off criteria checklist
- ✅ Tested components list

### Security Report Contents

**Sections included:**
- ✅ Summary (ESLint issues, ZAP alerts)
- ✅ OWASP ZAP detailed findings (HTML embedded)
- ✅ ESLint security findings (JSON formatted)
- ✅ Risk level breakdown
- ✅ Remediation recommendations

---

## Additional Security Testing Recommendations

### 1. Penetration Testing (Manual)

**Tools to use:**
- Burp Suite Community Edition
- OWASP ZAP (GUI mode for deeper testing)
- Browser DevTools

**Test scenarios:**
- Session hijacking attempts
- CSRF token bypass
- Authentication bypass
- Privilege escalation

### 2. Dependency Vulnerability Scanning

```cmd
# Check for vulnerable dependencies
npm audit

# Fix automatically (if possible)
npm audit fix

# View detailed report
npm audit --json
```

### 3. Container Security (If using Docker)

```cmd
# Scan Docker images
docker scan your-image-name
```

### 4. API Security Testing (If you add backend APIs)

**Add to test suite:**
- Rate limiting enforcement
- Authentication required
- Input validation
- SQL injection in API params
- Authorization checks
- API key exposure

### 5. Sensitive Data Exposure Testing

**Manual checks:**
- ✅ No passwords in localStorage/sessionStorage
- ✅ No API keys in client-side code
- ✅ No PII in URLs or logs
- ✅ No secrets in Git history

---

## Troubleshooting

### Tests Failing

```cmd
# Clear Jest cache
npm test -- --clearCache

# Update snapshots (if needed)
npm test -- -u
```

### ZAP Scan Connection Errors

**Error:** `Connection refused to http://host.docker.internal:3000`

**Fix:**
1. Ensure Next.js is running: `npm run dev`
2. Wait 10 seconds for app to start
3. Verify app is accessible: `http://localhost:3000`
4. Re-run: `npm run security:zap:local`

### Docker Issues

```cmd
# Restart Docker Desktop
# Then re-pull ZAP image
docker pull zaproxy/zap-stable
```

### Report Generation Fails

```cmd
# Ensure Puppeteer dependencies are installed
npm install

# If still failing, try:
npm rebuild puppeteer
```

---

## Test Execution Times

| Test Type | Duration | Frequency |
|-----------|----------|-----------|
| Unit Tests | ~30s | Every commit |
| Security Unit Tests | ~5s | Every commit |
| ESLint SAST | ~10s | Every commit |
| OWASP ZAP Baseline | 2-5 min | Pre-release |
| Full CI/CD Pipeline | 5-8 min | Every push |

---

## Sign-Off Checklist

### QA Sign-Off ✅
- [ ] All 44 unit tests passing
- [ ] Statement coverage ≥ 80%
- [ ] Branch coverage ≥ 80%
- [ ] Function coverage ≥ 80%
- [ ] No critical bugs
- [ ] UI/UX meets requirements
- [ ] Performance benchmarks met

### Security Sign-Off 🔒
- [ ] All security unit tests passing
- [ ] OWASP ZAP scan: 0 High alerts
- [ ] OWASP ZAP scan: ≤ 5 Medium alerts
- [ ] Security headers configured correctly
- [ ] CSP policy enforced (production)
- [ ] Input validation implemented
- [ ] File upload restrictions in place
- [ ] XSS protection verified
- [ ] No sensitive data exposure

---

## Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Jest Testing Documentation](https://jestjs.io/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

## Contact

For issues or questions:
- Open a GitHub issue
- Contact security team before deploying to production

---

**Last Updated:** November 28, 2025
**Version:** 1.0.0
