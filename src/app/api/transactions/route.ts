import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true
      },
      where: {
        userId: session.user.id
      }
    })
    return NextResponse.json(transactions)
  } catch (err) {
    console.error("Error creating transaction:", error.stack);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}


export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      amount,
      date,
      categoryId,
      description,
      type 
    } = await req.json();

    // Validate required fields
    if (!amount  || !date || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the category
    const transaction = await prisma.transaction.create({
      data: {
        amount: +amount,
        date,
        type,
        description,
        category: {connect: {
          id: categoryId
        }},
        user: {
          connect: {
            id: session.user.id
          }
        }
      },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error.stack);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}