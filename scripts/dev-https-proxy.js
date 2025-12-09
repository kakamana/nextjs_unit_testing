// Simple HTTPS reverse proxy for local UAE PASS callback
// Requires cert files at cert/localhost.key and cert/localhost.crt
const fs = require("fs");
const https = require("https");
const http = require("http");
const { createProxyServer } = require("http-proxy");

const TARGET_PORT = 8002; // Next.js dev server will run on 8002 (HTTP)
const HTTPS_PORT = 8000; // Public HTTPS endpoint for UAE PASS

const pemPath = process.env.LOCALHOST_SSL_PEM || "cert/localhost.pem"; // mkcert cert
const keyPemPath = process.env.LOCALHOST_SSL_KEY_PEM || "cert/localhost-key.pem"; // mkcert key
const keyPath = process.env.LOCALHOST_SSL_KEY || "cert/localhost.key"; // openssl key
const certPath = process.env.LOCALHOST_SSL_CERT || "cert/localhost.crt"; // openssl cert

let httpsOptions;
if (fs.existsSync(keyPemPath) && fs.existsSync(pemPath)) {
  // mkcert default: cert/localhost.pem + cert/localhost-key.pem
  httpsOptions = { key: fs.readFileSync(keyPemPath), cert: fs.readFileSync(pemPath) };
} else if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // separate key/crt
  httpsOptions = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
} else if (fs.existsSync(pemPath)) {
  // single PEM bundle containing both key+cert (rare)
  const pem = fs.readFileSync(pemPath);
  httpsOptions = { key: pem, cert: pem };
} else {
  console.error("Missing TLS cert files. Provide mkcert files cert/localhost.pem and cert/localhost-key.pem, or cert/localhost.key and cert/localhost.crt.");
  process.exit(1);
}

const proxy = createProxyServer({ target: { host: "localhost", port: TARGET_PORT } });
proxy.on("error", (err) => {
  console.error("Proxy error:", err.message);
});

const httpsServer = https.createServer(httpsOptions, (req, res) => {
  proxy.web(req, res);
});

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS proxy listening on https://localhost:${HTTPS_PORT} -> http://localhost:${TARGET_PORT}`);
});
