const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, '..', 'artifacts', 'accessibility', 'accessibility-results.json');
const reportDir = path.join(__dirname, '..', 'artifacts', 'accessibility');
const htmlReportPath = path.join(reportDir, 'accessibility-report.html');
const pdfReportPath = path.join(reportDir, 'accessibility-report.pdf');

function generateHtml(data) {
    let testResultsHtml = '';
    if (data.testResults && data.testResults.length > 0) {
        data.testResults.forEach(testResult => {
            testResultsHtml += `<h2>${testResult.name}</h2>`;
            if (testResult.assertionResults && testResult.assertionResults.length > 0) {
                testResult.assertionResults.forEach(assertion => {
                    const status = assertion.status === 'passed' ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>';
                    testResultsHtml += `<p><strong>${assertion.title}</strong>: ${status}</p>`;
                });
            } else {
                testResultsHtml += '<p>No assertions found.</p>';
            }
        });
    } else {
        testResultsHtml = '<p>No test results found.</p>';
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Accessibility Test Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                h2 { color: #555; }
                p { font-size: 14px; }
            </style>
        </head>
        <body>
            <h1>Accessibility Test Report</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            ${testResultsHtml}
        </body>
        </html>
    `;
}

async function createReport() {
    try {
        const rawData = fs.readFileSync(resultsPath);
        const data = JSON.parse(rawData);

        const htmlContent = generateHtml(data);
        fs.writeFileSync(htmlReportPath, htmlContent);
        console.log('HTML report generated successfully.');

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: pdfReportPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        await browser.close();
        console.log('PDF report generated successfully.');

    } catch (error) {
        console.error('Error generating accessibility report:', error);
        process.exit(1);
    }
}

createReport();
