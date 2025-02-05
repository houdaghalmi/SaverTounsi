import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    } 

    const { progress, completed, completedAt } = await request.json();

    // Verify user owns this challenge
    const userChallenge = await prisma.userChallenge.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!userChallenge) {
      return NextResponse.json(
        { error: "Challenge not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update progress
    const updatedChallenge = await prisma.userChallenge.update({
      where: {
        id: params.id,
      },
      data: {
        progress,
        completed,
        completedAt,
      },
      include: {
        challenge: true,
      },
    });

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error("Error updating challenge progress:", error);
    return NextResponse.json(
      { error: "Failed to update challenge progress" },
      { status: 500 }
    );
  }
}