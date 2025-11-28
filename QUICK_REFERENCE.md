# 🚀 Quick Testing Commands Reference

## 📊 QA Testing

```cmd
# Run all unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Generate QA report (HTML + PDF)
npm run qa:report

# View coverage report
start coverage\lcov-report\index.html

# View QA PDF report
start artifacts\qa\qa-report.pdf
```

## 🔒 Security Testing

```cmd
# Run security unit tests
npm run security:unit

# Run static analysis (ESLint)
npm run security:sast

# Run dynamic scan (OWASP ZAP)
# Terminal 1:
npm run dev
# Terminal 2:
npm run security:zap:local

# Generate security report
npm run security:report

# View security PDF report
start artifacts\security\security-report.pdf
```

## 🎯 Complete Workflow

```cmd
# 1. Install dependencies (first time)
npm install

# 2. Run all QA tests
npm test -- --coverage

# 3. Run all security tests
npm run security:unit

# 4. Run SAST
npm run security:sast

# 5. Run DAST (in separate terminals)
npm run dev                    # Terminal 1
npm run security:zap:local     # Terminal 2 (after app starts)

# 6. Generate both reports
npm run qa:report
npm run security:report

# 7. Review reports
start artifacts\qa\qa-report.pdf
start artifacts\security\security-report.pdf
```

## 📋 What Each Test Covers

### QA Tests (44 tests)
- ✅ ProfileForm component
- ✅ ProfilePreview component  
- ✅ ImageUpload component
- ✅ InputField component
- ✅ TextArea component
- ✅ SocialFields component
- ✅ Label and Icons components
- ✅ Security headers validation

### Security Tests
- ✅ **Input Validation**: XSS, SQL injection, command injection, path traversal
- ✅ **File Upload**: Extension validation, MIME types, double extensions, size limits
- ✅ **Buffer Overflow**: Input length restrictions
- ✅ **Authentication**: Password policies, MFA, session management
- ✅ **Authorization**: RBAC, privilege escalation prevention
- ✅ **Rate Limiting**: Brute force protection
- ✅ **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- ✅ **DAST (ZAP)**: 59+ OWASP security checks

### OWASP Top 10 Coverage
1. ✅ A01 - Broken Access Control
2. ✅ A02 - Cryptographic Failures
3. ✅ A03 - Injection
4. ✅ A04 - Insecure Design
5. ✅ A05 - Security Misconfiguration
6. ✅ A06 - Vulnerable Components
7. ✅ A07 - Authentication Failures
8. ✅ A08 - Data Integrity Failures
9. ⏳ A09 - Logging Failures (can add)
10. ✅ A10 - SSRF

## 📦 Output Files

```
artifacts/
├── qa/
│   ├── qa-report.html      # Interactive HTML report
│   └── qa-report.pdf       # ⭐ For QA sign-off
└── security/
    ├── security-report.html
    ├── security-report.pdf # ⭐ For ISR/Security sign-off
    ├── eslint.json
    ├── zap_report.html
    └── zap_report.json

coverage/
└── lcov-report/
    └── index.html          # Detailed code coverage
```

## ⏱️ Test Durations

| Test | Time |
|------|------|
| Unit Tests | ~30 seconds |
| Security Unit Tests | ~5 seconds |
| ESLint SAST | ~10 seconds |
| OWASP ZAP Scan | 2-5 minutes |
| Report Generation | ~10 seconds |
| **Total** | **~6-8 minutes** |

## 🎯 Sign-Off Criteria

### QA ✅
- [ ] All tests passing (44/44)
- [ ] Coverage ≥ 80% (all metrics)
- [ ] No critical bugs

### Security 🔒
- [ ] Security tests passing
- [ ] ZAP: 0 High alerts
- [ ] Headers configured
- [ ] Input validation working

## 🆘 Troubleshooting

### Tests fail?
```cmd
npm test -- --clearCache
npm install
```

### ZAP connection error?
```cmd
# 1. Ensure Docker is running
# 2. Ensure Next.js is running (npm run dev)
# 3. Wait 10 seconds
# 4. Try again
```

### Report generation fails?
```cmd
npm install
npm rebuild puppeteer
```

## 📖 Full Documentation

See `TESTING_GUIDE.md` for complete details.

## 🔗 GitHub Actions

View CI/CD results:
https://github.com/kakamana/nextjs_unit_testing/actions

Download artifacts from completed workflow runs.
