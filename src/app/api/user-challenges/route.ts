import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { groupEnd } from "console";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        challenge: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json(userChallenges);
  } catch (error) {
    console.error("Error fetching user challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch user challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { challengeId,challengeTitle } = await request.json();
    
    // Check if user has already joined this challenge
    const existingChallenge = await prisma.userChallenge.findFirst({
      where: {
        userId: session.user.id,
        challengeId: challengeId,
      },
    });
    
    if (existingChallenge) {
      return NextResponse.json(
        { error: "Already joined this challenge" },
        { status: 400 }
      );
    }
    
    //check if already have challenges system group category
    
      let g = await prisma.categoryGroup.findFirst({
        select: {
          id: true,
        },
        where: {
          userId: session.user.id,
          isSystemGroup: true,
          name: "Challenges"
        }
      })
   

    let groupChallengeId = g && g.id;

    if (!groupChallengeId) {
      const group= await prisma.categoryGroup.create({
        data: {
          userId: session.user.id,
          name: "Challenges",
          isSystemGroup: true,
        }
      })
      groupChallengeId=group.id
    }

    //create new category
    const category=await prisma.category.create({
      data:{
        name:challengeTitle,
        groupId:groupChallengeId,

      }
    })

    // Create new user challenge
    const userChallenge = await prisma.userChallenge.create({
      data: {
        userId: session.user.id,
        challengeId: challengeId,
        progress: 0,
        startDate: new Date(),
        categoryId:category.id
      },
      include: {
        challenge: true,
      },
    });

    return NextResponse.json(userChallenge);
  } catch (error) {
    console.error("Error joining challenge:", error,);
    return NextResponse.json(
      { error: "Failed to join challenge" },
      { status: 500 }
    );
  }
}