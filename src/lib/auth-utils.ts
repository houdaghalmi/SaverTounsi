import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./auth"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return user
}

// Protect API routes
export async function requireAuthApi() {
  const session = await getSession()

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  return session.user
}

// Helper to check if user has access to a resource
export async function checkUserAccess(resourceUserId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  return user.id === resourceUserId
}