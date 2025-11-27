const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function main() {
  const artifactsDir = path.join(__dirname, '..', 'artifacts', 'security');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const eslintJsonPath = path.join(artifactsDir, 'eslint.json');
  const zapHtmlPath = path.join(artifactsDir, 'zap_report.html');
  const zapJsonPath = path.join(artifactsDir, 'zap_report.json');

  const eslintData = fs.existsSync(eslintJsonPath)
    ? JSON.parse(fs.readFileSync(eslintJsonPath, 'utf-8'))
    : null;
  const zapHtml = fs.existsSync(zapHtmlPath)
    ? fs.readFileSync(zapHtmlPath, 'utf-8')
    : '<p>ZAP report not found. Run security:zap.</p>';
  const zapJson = fs.existsSync(zapJsonPath)
    ? JSON.parse(fs.readFileSync(zapJsonPath, 'utf-8'))
    : null;

  const summary = {
    eslintIssues: eslintData ? eslintData.length : 0,
    zapAlerts: zapJson ? zapJson.length || (zapJson.site && zapJson.site[0]?.alerts?.length) || 0 : 0,
  };

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Security Assessment Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; }
        h1 { color: #0ea5e9; }
        h2 { color: #111827; }
        .section { margin-bottom: 24px; }
        pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; }
        .summary { background: #e0f2fe; padding: 12px; border-radius: 6px; }
      </style>
    </head>
    <body>
      <h1>Security Assessment Report</h1>
      <div class="summary">
        <p><strong>ESLint Security Issues:</strong> ${summary.eslintIssues}</p>
        <p><strong>ZAP Alerts:</strong> ${summary.zapAlerts}</p>
      </div>

      <div class="section">
        <h2>OWASP ZAP Baseline Report</h2>
        ${zapHtml}
      </div>

      <div class="section">
        <h2>ESLint Security Findings (JSON)</h2>
        <pre>${eslintData ? JSON.stringify(eslintData, null, 2) : 'No eslint.json found'}</pre>
      </div>
    </body>
  </html>`;

  const outHtml = path.join(artifactsDir, 'security-report.html');
  fs.writeFileSync(outHtml, html, 'utf-8');
  console.log('Wrote', outHtml);

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outPdf = path.join(artifactsDir, 'security-report.pdf');
  await page.pdf({ path: outPdf, format: 'A4' });
  console.log('Wrote', outPdf);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
