import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const isAuthPage = path.startsWith('/signin') || path.startsWith('/signup')

    // Prevent authenticated users from accessing auth pages
    if (isAuthPage) {
      if (token) {
        // Redirect authenticated users to overview
        return NextResponse.redirect(new URL('/overview', req.url))
      }
      // Allow non-authenticated users to access auth pages
      return NextResponse.next()
    }

    // Allow access to public routes
    if (path === '/') {
      return NextResponse.next()
    }
    
    


    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/signin',
      newUser: '/signup'      
    }
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|signup).*)',
  ]
}