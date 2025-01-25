// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Your database client

export async function GET() {
  try {
    const transactions = await db.transaction.findMany();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}