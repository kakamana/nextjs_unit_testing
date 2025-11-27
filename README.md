# Next.js Unit Testing & Security Assessment Project

A complete Next.js 15 application with comprehensive unit testing (Jest), security assessment (OWASP ZAP, ESLint), and CI/CD integration for QA and ISR sign-off.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [Security Assessment](#security-assessment)
- [Docker Setup](#docker-setup)
- [GitHub Actions](#github-actions)
- [Vercel Deployment](#vercel-deployment)
- [Reports](#reports)

## Prerequisites

### Required Software

- **Node.js 20.x LTS** (Required for Jest 30.x compatibility)
  - Download from [nodejs.org](https://nodejs.org/)
  - Or use nvm-windows: `nvm install 20.11.1 && nvm use 20.11.1`
- **Docker Desktop** (For OWASP ZAP scans)
  - Download from [docker.com](https://www.docker.com/products/docker-desktop)
- **Git** (For version control)

### Node Version Check

```cmd
node -v
```
Should show `v20.x.x`. If you see `v23.x.x` or other versions, install Node 20.

## Quick Start

1. **Clone and install**
   ```cmd
   git clone https://github.com/kakamana/nextjs_unit_testing.git
   cd nextjs_unit_testing
   npm install
   ```

2. **Run the app**
   ```cmd
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Run all tests**
   ```cmd
   npm test
   ```

## Testing

### Unit Tests (Jest)

Run all unit tests with coverage:
```cmd
npm test
```

Run tests in watch mode:
```cmd
npm run test:watch
```

**Coverage targets:**
- Statements: 99.47%
- Branches: 96.61%
- Functions: 100%
- Lines: 99.47%

### Test Structure

```
__tests__/
  ├── imageUpload.test.tsx
  ├── inputField.test.tsx
  ├── profileForm.test.tsx
  ├── profilePreview.test.tsx
  ├── socialFields.test.tsx
  └── textarea.test.tsx
security-tests/
  └── unit/
      └── headers.test.ts
```

## Security Assessment

### Security Headers

Security headers are configured in `next.config.ts`:
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Content-Security-Policy`

### Run Security Unit Tests

```cmd
npm run security:unit
```

### Run SAST (ESLint Security Scan)

```cmd
npm run security:sast
```

Outputs JSON report to `artifacts/security/eslint.json`

### Run DAST (OWASP ZAP Baseline)

**Prerequisites:**
- Docker Desktop running
- Next.js dev server running (`npm run dev`)

**On Windows/Mac (Docker Desktop):**
```cmd
npm run security:zap:local
```

**On Linux CI (GitHub Actions):**
```cmd
npm run security:zap
```

Outputs reports to:
- `artifacts/security/zap_report.html`
- `artifacts/security/zap_report.json`

### Generate Consolidated Security Report

Combines all security findings into HTML and PDF:

```cmd
npm run security:report
```

Outputs:
- `artifacts/security/security-report.html`
- `artifacts/security/security-report.pdf`

### Complete Security Workflow (Local)

```cmd
# Terminal 1: Start the app
npm run dev

# Terminal 2: Run all security checks
npm run security:unit
npm run security:sast
npm run security:zap:local
npm run security:report
```

Check `artifacts\security\` for all reports.

## Docker Setup

### What Docker Does

Docker runs OWASP ZAP in a container to perform DAST (Dynamic Application Security Testing) against your running Next.js application.

### Docker Desktop

1. Ensure Docker Desktop is running (check system tray icon)
2. No additional configuration needed
3. ZAP image (`owasp/zap2docker-stable`) will auto-download on first run

### ZAP Scan Targets

- **Local (Windows/Mac):** `http://host.docker.internal:3000`
  - Uses `npm run security:zap:local`
- **CI (Linux):** `http://localhost:3000`
  - Uses `npm run security:zap` with `--network host`

## GitHub Actions

### Enable Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Ensure:
   - **Actions permissions:** "Allow all actions and reusable workflows"
   - **Workflow permissions:** "Read repository contents permission" (minimum)

### Security Assessment Workflow

Located at `.github/workflows/security.yml`

**Triggers:**
- Push to `main`
- Pull requests to `main`
- Manual dispatch

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run unit tests with coverage
5. Build Next.js app
6. Start Next.js server
7. Wait for server ready
8. Run ESLint security scan (JSON output)
9. Run OWASP ZAP baseline scan
10. Generate consolidated security report (HTML/PDF)
11. Upload artifacts
12. Gate on High severity alerts (fails workflow if found)

### View Reports

1. Go to **Actions** tab
2. Click on latest "Security Assessment" run
3. Download **security-artifacts** artifact
4. Extract and open `security-report.html` or `security-report.pdf`

### Gating Logic

Workflow fails if ZAP detects **High** risk alerts:
```bash
if [ "$HIGH" -gt "0" ]; then
  echo "Found High risk alerts";
  exit 1;
fi
```

## Vercel Deployment

### Recommended Workflow

1. **First:** Get local and CI security scans passing consistently
2. **Then:** Link to Vercel for staging and production

### Link Vercel

1. Go to [vercel.com](https://vercel.com/)
2. **New Project** → Import `kakamana/nextjs_unit_testing`
3. Framework: **Next.js**
4. Node Version: **20.x**
5. Build Command: `npm run build` (default)
6. Deploy

### Preview Deployments

Vercel automatically creates preview deployments for pull requests, which can be scanned as staging environments.

### Future Enhancement: Scan Vercel Previews

You can enhance CI/CD to:
- Deploy PR to Vercel Preview
- Run ZAP scan against preview URL instead of localhost
- Provides realistic staging environment DAST

## Reports

### Coverage Report

After `npm test`:
- HTML: `coverage/lcov-report/index.html`
- JSON: `coverage/coverage-final.json`

### Security Reports

After `npm run security:report`:
- **Consolidated HTML:** `artifacts/security/security-report.html`
- **Consolidated PDF:** `artifacts/security/security-report.pdf`
- **ESLint JSON:** `artifacts/security/eslint.json`
- **ZAP HTML:** `artifacts/security/zap_report.html`
- **ZAP JSON:** `artifacts/security/zap_report.json`

### For QA & ISR Sign-Off

1. Run complete security workflow (see above)
2. Share `security-report.pdf` from `artifacts/security/`
3. Include unit test coverage report from `coverage/`
4. GitHub Actions artifacts available for audit trail

## Troubleshooting

### Node Version Mismatch

**Error:** `npm warn EBADENGINE Unsupported engine`

**Fix:** Install Node 20.x LTS:
```cmd
nvm install 20.11.1
nvm use 20.11.1
```

### Docker Not Running

**Error:** `Cannot connect to the Docker daemon`

**Fix:** Ensure Docker Desktop is running

### ZAP Scan Fails (Connection Refused)

**Error:** `Connection refused to http://host.docker.internal:3000`

**Fix:** Ensure Next.js dev server is running:
```cmd
npm run dev
```

### ESLint TypeScript Errors

**Error:** TypeScript lint errors in scripts or tests

**Fix:** Errors are informational; review `artifacts/security/eslint.json` for details

## Project Structure

```
nextjs_unit_testing/
├── __tests__/              # Unit tests (Jest)
├── app/                    # Next.js app directory
├── components/             # React components
├── security-tests/         # Security unit tests
├── scripts/                # Utility scripts (security report)
├── artifacts/security/     # Security scan outputs
├── coverage/               # Jest coverage reports
├── .github/workflows/      # CI/CD workflows
├── next.config.ts          # Next.js config (security headers)
├── jest.config.ts          # Jest configuration
├── eslint.config.mjs       # ESLint configuration
└── package.json            # Dependencies and scripts
```

## Next Steps

- [ ] Run local security workflow successfully
- [ ] Verify GitHub Actions run and artifacts upload
- [ ] Link Vercel for staging/production
- [ ] Enhance CI to scan Vercel preview URLs
- [ ] Integrate CodeQL or Semgrep for deeper SAST
- [ ] Add Snyk for dependency vulnerability scanning

## Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Next.js Security Headers](https://nextjs.org/docs/pages/api-reference/next-config-js/headers)
- [Jest Testing Framework](https://jestjs.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## License

MIT

---

For questions or issues, please open a GitHub issue or contact the maintainer.
