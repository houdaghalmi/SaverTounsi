// pages/api/updateUserChallengeProgress.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userChallengeId, progress } = req.body;

    try {
      const updatedUserChallenge = await prisma.userChallenge.update({
        where: { id: userChallengeId },
        data: { progress },
      });

      res.status(200).json(updatedUserChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}