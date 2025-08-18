import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is trying to access login page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next()
  }

  // Check for admin session cookie
  const adminSession = request.cookies.get("admin-session")

  if (!adminSession) {
    // Redirect to login if no session cookie
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
