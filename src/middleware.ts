import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    console.log(path, path.startsWith('/signin'))
    // Allow public routes
    if (path.startsWith('/signin') || 
        path.startsWith('/signup') || 
        path === '/') {
      return NextResponse.next()
    }
    // Redirect logic
    if (path.startsWith('/categories') || 
        path.startsWith('/budgets') || 
        path.startsWith('/transactions') ||
        path.startsWith('/bon-plans') ||
        path.startsWith('/challenges')) {
      if (!token) {
        return NextResponse.redirect(new URL('/signin', req.url))
      }

      if (token && !token.isOnboarded) {
        return NextResponse.redirect(new URL('/onboarding', req.url))
      }
    }

    
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}