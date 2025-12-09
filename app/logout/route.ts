import { NextResponse } from "next/server";

const HTTPS_ORIGIN = "https://localhost:8000";

export async function GET() {
  //const res = NextResponse.redirect(`${HTTPS_ORIGIN}/uaepass`);
  const res = NextResponse.redirect(`${HTTPS_ORIGIN}`);
  // Clear the UAE PASS fullname cookie
  res.cookies.set("uaepass_fullname", "", { path: "/", maxAge: 0 });
  return res;
}
