import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust this import based on your project structure

export async function GET() {
  try {
    console.log("Fetching all challenges from the database...");
    
    // Fetch all challenges without filtering by 'status'
    const challenges = await prisma.challenge.findMany();
    
    if (challenges.length === 0) {
      console.log("No challenges found.");
    }

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);

    // Return an error response with a status code of 500
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}
