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
    const { message } = await req.json();

    // Validate required fields
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        message,
        userId: session.user.id,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId: session.user.id, // Add this where clause to filter by user ID
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            name: true,
            image:true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match our frontend interface
    const transformedFeedbacks = feedbacks.map(feedback => ({
      id: feedback.id,
      message: feedback.message,
      createdAt: feedback.createdAt.toISOString(),
      userId: feedback.userId,
      userName: feedback.user.name 
    }));

    return NextResponse.json(transformedFeedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}