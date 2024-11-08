import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to login and landing page
  const { pathname } = request.nextUrl
  
  if (pathname === '/' || pathname === '/login' || pathname === '/onboarding') {
    return NextResponse.next()
  }

  // Check for Firebase Auth Session Cookie
  const session = request.cookies.get('__session')?.value

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/discover/:path*',
    '/chats/:path*'
  ]
} 