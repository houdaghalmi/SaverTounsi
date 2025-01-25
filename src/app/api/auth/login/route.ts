import prisma from "@/lib/prisma"
import { compare } from 'bcrypt'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return new NextResponse('Invalid credentials', { status: 400 })
    }
    const isValid = password === user.password

    if (!isValid) {
      return new NextResponse('Invalid credentials', { status: 400 })
    }

    return new NextResponse(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      isOnboarded: user.isOnboarded
    }), { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}


