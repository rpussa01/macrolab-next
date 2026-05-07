import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/add-recipe") ||
    request.nextUrl.pathname.startsWith("/manage-recipe")

  const isLoginPage = request.nextUrl.pathname === "/admin-login"

  const isLoggedIn =
    request.cookies.get("admin-auth")?.value === "true"

  if (isAdminRoute && !isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin-login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/add-recipe/:path*",
    "/manage-recipe/:path*",
  ],
}