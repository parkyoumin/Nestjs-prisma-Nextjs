import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  const { pathname } = request.nextUrl;

  if (accessToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!accessToken && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/have-to-login", request.url));
  }

  return NextResponse.next();
}
