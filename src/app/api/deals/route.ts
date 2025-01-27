import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const deals = await prisma.bonPlan.findMany({});
    return NextResponse.json(deals)
}