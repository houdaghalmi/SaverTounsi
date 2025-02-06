import { getSession } from "@/lib/auth-utils";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const progress = await prisma.userChallengeProgress.findMany({
      where: {
        userChallenge: {
          userId: session.userId
        }
      },
      include: {
        userChallenge: {
          include: {
            challenge: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[USER_CHALLENGE_PROGRESS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { userChallengeId, amount } = body;

    // Verify user owns the challenge
    const userChallenge = await prisma.userChallenge.findFirst({
      where: {
        id: userChallengeId,
        userId: session.userId
      }
    });

    if (!userChallenge) {
      return new NextResponse("Challenge not found", { status: 404 });
    }

    const progress = await prisma.userChallengeProgress.create({
      data: {
        userChallengeId,
        amount,
        date: new Date()
      },
      include: {
        userChallenge: {
          include: {
            challenge: true
          }
        }
      }
    });

    await prisma.userChallenge.update({
      where: {
        id: userChallengeId
      },
      data: {
        progress: amount
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[USER_CHALLENGE_PROGRESS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}