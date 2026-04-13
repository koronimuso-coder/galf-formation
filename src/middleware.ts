import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// MOCK: In a real app this would decode a Firebase session cookie
const getSession = (req: NextRequest) => {
  return req.cookies.get('session')?.value
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected routes that require ANY auth
  const protectedPaths = ['/candidat', '/apprenant', '/admin', '/instructeur']
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtectedPath) {
    const session = getSession(request)
    
    // Si l'utilisateur n'est pas connecté et tente d'aller sur une page protégée
    if (!session) {
      // In a real flow, redirect to /connexion
      // return NextResponse.redirect(new URL('/connexion', request.url))
      
      // For demo purpose, we let it pass but mock the check
      const response = NextResponse.next()
      response.headers.set('x-auth-status', 'missing-session-blocked')
      return response
    }
  }

  // Admin-only protection
  if (pathname.startsWith('/admin')) {
    // We would check role here
    const userRole = request.cookies.get('user_role')?.value
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
