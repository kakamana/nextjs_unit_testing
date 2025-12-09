"use client";
import Link from "next/link";

const AUTH_URL = new URL("https://stg-id.uaepass.ae/idshub/authorize");
const params = new URLSearchParams({
  response_type: "code",
  client_id: process.env.NEXT_PUBLIC_UAE_PASS_CLIENT_ID || "sandbox_stage",
  scope: "urn:uae:digitalid:profile:general",
  state: "HnlHOJTkTb66Y5H",
  // Use HTTPS proxy on 8000 which forwards to Next dev server
  redirect_uri: "https://localhost:8000/callback",
  acr_values: "urn:safelayer:tws:policies:authentication:level:low",
});
AUTH_URL.search = params.toString();

export default function UAEPassLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 rounded-lg bg-gray-800 border border-gray-700">
        <h1 className="text-2xl font-semibold text-white mb-4">Login with UAE PASS</h1>
        <p className="text-gray-300 mb-6">You will be redirected to UAE PASS staging to authenticate, then returned to this app.</p>
        <Link
          href={AUTH_URL.toString()}
          className="inline-block px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          Continue to UAE PASS
        </Link>
      </div>
    </div>
  );
}
