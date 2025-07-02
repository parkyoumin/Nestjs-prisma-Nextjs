import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 미들웨어가 정적 파일, API 라우트 등 내부 요청을 가로채지 않도록 예외 처리
  if (
    pathname.startsWith("/_next/") || // Next.js 빌드 결과물
    pathname.startsWith("/api/") || // API 라우트
    pathname.startsWith("/static/") || // 정적 파일 (public 폴더)
    pathname.includes("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  // 1. 로그인한 사용자가 루트 경로(/) 접근 시 대시보드로 리디렉션
  if (accessToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. 인증이 필요 없는 공개 경로 정의
  const publicPaths = ["/", "/have-to-login", "/login-success"];

  // 3. 공개 경로 및 피드백 경로는 인증 로직을 건너뜀
  if (pathname.startsWith("/feedback") || publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 4. 이하 모든 경로는 보호된 경로로 간주하고 인증 상태를 확인
  // accessToken이 있으면 통과
  if (accessToken) {
    return NextResponse.next();
  }

  // accessToken이 없으면 리프레시 토큰으로 재발급 시도
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const providerAccountId = request.cookies.get("provider_account_id")?.value;

  // 리프레시 토큰도 없으면 로그인 페이지로 리디렉션
  if (!refreshToken || !providerAccountId) {
    const response = NextResponse.redirect(
      new URL("/have-to-login", request.url),
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("provider_account_id");
    return response;
  }

  // 리프레시 토큰으로 새 accessToken 발급 시도
  try {
    // TODO : env
    const refreshResponse = await fetch("http://localhost:3001/auth/refresh", {
      method: "GET",
      headers: {
        Cookie: `refresh_token=${refreshToken}; provider_account_id=${providerAccountId}`,
      },
    });

    if (refreshResponse.ok) {
      // 성공 시, 새 토큰이 포함된 쿠키와 함께 원래 요청 경로로 리디렉션
      const newResponse = NextResponse.redirect(request.url);
      const setCookies = refreshResponse.headers.getSetCookie();

      setCookies.forEach((cookie) => {
        newResponse.headers.append("Set-Cookie", cookie);
      });

      return newResponse;
    }
  } catch (error) {
    console.error("Refresh token error:", error);
  }

  // 재발급 실패 시, 로그인 페이지로 리디렉션하고 쿠키 정리
  const response = NextResponse.redirect(
    new URL("/have-to-login", request.url),
  );
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("provider_account_id");
  return response;
}
