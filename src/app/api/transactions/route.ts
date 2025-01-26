// app/api/categories/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, budget, groupId } = await req.json();

    // Validate required fields
    if (!name || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        budget: budget || 0, // Default to 0 if budget is not provided
        groupId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}