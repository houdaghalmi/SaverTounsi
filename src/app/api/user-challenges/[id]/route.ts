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
    const userChallenge = await prisma.userChallenge.findUnique({
      include: {
        challenge: true
      },
      where: {
        id: id,
      },
    });

    const updatedChallenge = await prisma.userChallenge.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        progress: progress,
        completedAt: progress >= (userChallenge?.challenge.goal || 0) ? new Date() : null,
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userChallenge = await prisma.userChallenge.findUnique({
      where: {
        id: params.id,
      },
      include: {
        challenge: true,
      },
    });

    if (!userChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (userChallenge.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(userChallenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}