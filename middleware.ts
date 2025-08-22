import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const adminSession = request.cookies.get("admin-session")


  if (pathname === "/admin/login") {
    if (adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }else if (pathname.startsWith('/admin')){
    if (!adminSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  }else{
    return NextResponse.next()
  }
  

  return NextResponse.next()
}
