// app/api/feedback/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.user.update({
        data: {
            isOnboarded: true
        },
        where: {
            id: session.user.id
        }
    })
    return NextResponse.json(true);
  } catch (error) {
    console.error("Error submitting onboarding data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}