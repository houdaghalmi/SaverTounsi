import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

// Function 1: GET - Fetch category groups (view)
export async function GET() {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const categoryGroups = await prisma.categoryGroup.findMany({
      where: { userId: session.user?.id },
      include: { categories: true },
    });
    return NextResponse.json(categoryGroups);
  } catch (error) {
    console.error("Error fetching category groups:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Function 2: POST - Add a new category group (create)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name } = await req.json();

  try {
    console.log(session)
    const categoryGroup = await prisma.categoryGroup.create({
      data: {
        name,
        userId: session.user.id,
      },
    });
    return NextResponse.json(categoryGroup);
  } catch (error) {
    console.error("Error creating category group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
