import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function GET(
    req: Request,
    opts: { params: { name: string } }
) {
    try {
        const params = await opts.params;
        const session = await getSession();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        } 
        const categoryGroup = await prisma.categoryGroup.findFirst({
            select: {
                name: true
            },
            where: { 
                name: params.name,
                AND: {
                    userId : session.user.id,
                }
            },
        });
       
        return NextResponse.json({ valid: !categoryGroup?.name});
    } catch (error) {
        console.error("Error deleting category group:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}