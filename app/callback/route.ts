import { NextRequest, NextResponse } from "next/server";

const HTTPS_ORIGIN = "https://localhost:8000"; // ensure redirects stay on the HTTPS proxy

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${HTTPS_ORIGIN}/uaepass?error=missing_code`);
  }

  const clientId = process.env.UAE_PASS_CLIENT_ID || "sandbox_stage";
  const clientSecret = process.env.UAE_PASS_CLIENT_SECRET || "sandbox_stage";
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const redirectUri = "https://localhost:8000/callback";

  // Exchange code for token
  const tokenUrl = new URL("https://stg-id.uaepass.ae/idshub/token");
  tokenUrl.search = new URLSearchParams({
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  }).toString();

  const tokenRes = await fetch(tokenUrl.toString(), {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${HTTPS_ORIGIN}/uaepass?error=token_${tokenRes.status}`);
  }
  const tokenJson = await tokenRes.json();
  const accessToken: string | undefined = tokenJson.access_token;
  if (!accessToken) {
    return NextResponse.redirect(`${HTTPS_ORIGIN}/uaepass?error=missing_token`);
  }

  // Fetch user info
  const userinfoRes = await fetch("https://stg-id.uaepass.ae/idshub/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!userinfoRes.ok) {
    return NextResponse.redirect(`${HTTPS_ORIGIN}/uaepass?error=userinfo_${userinfoRes.status}`);
  }
  const userinfo = await userinfoRes.json();
  const fullnameEN = userinfo.fullnameEN || userinfo.fullnameEn || userinfo.fullname || "";

  // Set a cookie and redirect to main page
  const response = NextResponse.redirect(`${HTTPS_ORIGIN}/`);
  response.cookies.set("uaepass_fullname", fullnameEN, { path: "/" });
  return response;
}
