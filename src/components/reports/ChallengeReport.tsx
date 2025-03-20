"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Challenge, UserChallenge, ProgressPoint } from "@/types/reports";
import { ChallengeCard } from "./cards/ChallengeCard";

interface ChallengeReportProps {
  userChallenges: UserChallenge[];
  progressHistory: Record<string, ProgressPoint[]>;
}

export function ChallengeReport({ userChallenges, progressHistory }: ChallengeReportProps) {
  return (
    <div className="flex justify-end">
      <div className="w-full space-y-6">
        {userChallenges.map((userChallenge) => (
          <ChallengeCard 
            key={userChallenge.id}
            userChallenge={userChallenge}
            progressHistory={progressHistory[userChallenge.id]}
          />
        ))}
      </div>
    </div>
  );
}