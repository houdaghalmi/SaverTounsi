import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { progress } = await request.json();
    const id = (await params).id;

    const userChallenge = await prisma.userChallenge.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        progress: progress,
      },
    });

    return NextResponse.json(userChallenge);
  } catch (error) {
    console.error("Error updating challenge progress:", error);
    return NextResponse.json(
      { error: "Failed to update challenge progress" },
      { status: 500 }
    );
  }
}