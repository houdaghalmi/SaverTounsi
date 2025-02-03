import { Metadata } from "next"
import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign Up | SaverTounsi",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a2a6c] mb-2">
              Create an account
            </h1>
            <p className="text-base text-gray-600">
              Enter your email below to create your account
            </p>
          </div>

          {/* Auth Form */}
          <div className="mb-8">
            <AuthForm mode="signup" />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link 
              href="/signin" 
              className="text-[#b21f1f] hover:text-[#fdbb2d] transition-colors font-medium"
            >
              Already have an account? <span className="underline">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}