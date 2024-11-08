import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for auth token in cookies
  const token = request.cookies.get('auth')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/discover/:path*',
    '/chats/:path*'
  ]
} 