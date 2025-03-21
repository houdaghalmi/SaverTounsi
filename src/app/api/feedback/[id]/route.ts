import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

interface RouteParams {
  id: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const feedbackId = (await params).id;
    
    // First check if the feedback belongs to the user
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: feedbackId,
      },
    });

    if (!feedback || feedback.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete the feedback
    await prisma.feedback.delete({
      where: {
        id: feedbackId,
      },
    });

    return NextResponse.json({ message: "Feedback deleted" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}