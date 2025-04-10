import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const isAuthPage = path.startsWith('/signin') || path.startsWith('/signup')
    const isPublicPage = path === '/'

    // Allow access to public routes without authentication
    if (isPublicPage) {
      return NextResponse.next()
    }

    // Handle auth pages
    if (isAuthPage) {
      if (token) {
        return NextResponse.redirect(new URL('/overview', req.url))
      }
      return NextResponse.next()
    }

    // Protected routes require authentication
    if (!token && !isPublicPage) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to home page without token
        if (req.nextUrl.pathname === '/') {
          return true
        }
        return !!token
      }
    },
    pages: {
      signIn: '/signin',
      newUser: '/signup'
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /signup
     */
    '/((?!api|_next/static|_next/image|favicon.ico|signup).*)'
  ]
}