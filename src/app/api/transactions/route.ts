import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user?.id,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", (err as Error).stack);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, date, categoryId, description, type } = await req.json();

    if (!amount || !date || !type || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // First check if the category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          amount: +amount,
          date,
          type,
          description,
          category: { connect: { id: categoryId } },
          user: { connect: { id: session.user?.id } }
        },
      });

      // Update category based on transaction type
      if (categoryId) {
        if (type === "INCOME") {
          await tx.category.update({
            where: { id: categoryId },
            data: { budget: { increment: +amount } }
          });
        } else if (type === "EXPENSE") {
          await tx.category.update({
            where: { id: categoryId },
            data: { spent: { increment: +amount } }
          });
        }
      }

      return transaction;
    });

    // Fetch the complete transaction with category details
    const fullTransaction = await prisma.transaction.findUnique({
      where: { id: result.id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(fullTransaction);
  } catch (error) {
    console.error("Error creating transaction:", (error as Error).stack);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}