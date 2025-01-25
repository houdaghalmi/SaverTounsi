// app/api/categories/[categoryId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.categoryId },
    });
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}