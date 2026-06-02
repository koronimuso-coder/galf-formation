import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const getSession = (req: NextRequest) => {
  return req.cookies.get('session')?.value
}

const getUserRole = (req: NextRequest) => {
  return req.cookies.get('user_role')?.value
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected routes that require ANY auth
  const protectedPaths = ['/candidat', '/apprenant', '/admin', '/instructeur']
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtectedPath) {
    const session = getSession(request)
    
    // Redirect unauthenticated users to login
    if (!session) {
      const loginUrl = new URL('/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin-only protection
  if (pathname.startsWith('/admin')) {
    const userRole = getUserRole(request)
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/connexion', request.url))
    }
  }

  // Instructeur-only protection
  if (pathname.startsWith('/instructeur')) {
    const userRole = getUserRole(request)
    if (userRole !== 'INSTRUCTEUR' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/connexion', request.url))
    }
  }

  const response = NextResponse.next()

  // Add security headers at middleware level
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
