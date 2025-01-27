import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { connect } from "http2";

// GET: Fetch reviews for a specific BonPlan
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bonPlanId = searchParams.get("bonPlanId");

  console.log("Fetching reviews for bonPlanId:", bonPlanId);

  if (!bonPlanId) {
    return NextResponse.json(
      { error: "bonPlanId is required" },
      { status: 400 }
    );
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { bonPlanId },
      orderBy: { createdAt: "desc" },
    });
    console.log("Fetched reviews:", reviews);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: Submit a new review
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await request.json();
  const { rating, comment, userName, bonPlanId } = body;

  console.log("Submitting review:", { rating, comment, userName, bonPlanId });

  if (!rating || !comment || !bonPlanId) {
    return NextResponse.json(
      { error: "Rating, comment, and bonPlanId are required" },
      { status: 400 }
    );
  }

  try {
    console.log(session.user)
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        userName: userName || "Anonymous",
        bonPlan:{
          connect:{
            id:bonPlanId,
          }
        },
        user:{
          connect:{
            id:session.user?.id
          }
        }
      },
    });
    console.log("Created review:", newReview);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Failed to submit review:", (error as Error).stack);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}