import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Temporarily allow all routes for debugging
  console.log('Middleware called for path:', pathname)
  
  // Public routes that don't require authentication (prototype mode)
  const publicRoutes = [
    '/', 
    '/mi-room/login', 
    '/mi-room/dashboard',  // Allow direct access to dashboard in prototype mode
    '/doctor/login', 
    '/doctor/dashboard',   // Allow direct access to doctor dashboard for testing
    '/api/auth/login',
    '/api/notifications/sse',
    '/api/consultations',
    '/api/patients'
  ]
  
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // For now, allow all routes to prevent middleware module error
  // Authentication will be handled by individual components
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}