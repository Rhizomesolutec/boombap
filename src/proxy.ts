import { NextResponse, type NextRequest } from "next/server";
import { JWT_COOKIE, verifyAdminToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/** routes except the login page itself
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (!isAdminRoute || isLoginPage) return NextResponse.next();

  // Read JWT from cookie
  const token = request.cookies.get(JWT_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  const payload = await verifyAdminToken(token);
  if (!payload || payload.role !== "admin") {
    return redirectToLogin(request);
  }

  // Valid — pass through with identity headers for optional server-side use
  const response = NextResponse.next();
  response.headers.set("x-admin-user", payload.username);
  return response;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
