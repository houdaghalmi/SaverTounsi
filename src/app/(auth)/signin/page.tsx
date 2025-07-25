import { Metadata } from "next"
import Link from "next/link"
import { Home } from "lucide-react" // Add this import
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign In | SaverTounsi", 
  description: "Sign in to your account"
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] py-20">
      {/* Add Home Link */}
      <div className="absolute top-4 left-4">
        <Link 
          href="/"
          className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <Home className="w-5 h-5 text-white" />
        </Link>
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a2a6c] mb-2">
              Welcome Back
            </h1>
            <p className="text-base text-gray-600">
              Enter your credentials to sign in to your account
            </p>
          </div>

          {/* Auth Form */}
          <div className="mb-8">
            <AuthForm mode="signin" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link 
              href="/signup"
              className="text-[#b21f1f] hover:text-[#fdbb2d] transition-colors font-medium"
            >
              Don&apos;t have an account? <span className="underline">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
