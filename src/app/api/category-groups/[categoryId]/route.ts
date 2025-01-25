// app/api/category-groups/[groupId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    // Delete the category group and its associated categories
    await prisma.categoryGroup.delete({
      where: { id: params.groupId },
    });
    return NextResponse.json({ message: "Category group deleted" });
  } catch (error) {
    console.error("Error deleting category group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}