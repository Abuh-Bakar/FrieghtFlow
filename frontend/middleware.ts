import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const guestRoutes = ["/login", "/register"];

function stripLocale(pathname: string) {
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);
  return pathname.replace(localePattern, "") || "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);
  const normalizedPathname = stripLocale(pathname);
  const authToken = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!authToken;

  const isProtected = protectedRoutes.some(
    (route) => normalizedPathname === route || normalizedPathname.startsWith(`${route}/`),
  );
  const isGuestOnly = guestRoutes.some(
    (route) => normalizedPathname === route || normalizedPathname.startsWith(`${route}/`),
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", normalizedPathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
