import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, budget, groupId } = await req.json();

  try {
    const category = await prisma.category.create({
      data: {
        name,
        budget,
        groupId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id, budget } = await req.json();

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { budget },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}