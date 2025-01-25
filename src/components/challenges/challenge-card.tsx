// src/components/challenges/challenge-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    target: number; // Target amount (e.g., 100 DT)
    current: number; // Current amount saved (e.g., 60 DT)
    progress: number; // Progress percentage
    participants: number;
    deadline: string;
    status: string;
  };
  onUpdateProgress: (id: string, newCurrent: number) => void;
}

export const ChallengeCard = ({
  challenge: initialChallenge,
  onUpdateProgress,
}: ChallengeCardProps) => {
  const [challenge, setChallenge] = useState(initialChallenge);
  const [amount, setAmount] = useState("");

  const handleUpgradeProgress = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newCurrent = Math.min(challenge.current + amountValue, challenge.target);
    const newProgress = (newCurrent / challenge.target) * 100;

    setChallenge({ ...challenge, current: newCurrent, progress: newProgress });
    onUpdateProgress(challenge.id, newCurrent); // Notify parent component
    setAmount(""); // Reset input
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          {challenge.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{challenge.description}</p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(challenge.progress)}/100%</span> {/* Display percentage as X/100% */}
          </div>
          <Progress value={challenge.progress} />
        </div>

        {/* Participants and Deadline */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participants} participants</span>
          </div>
          <span>Ends {challenge.deadline}</span>
        </div>

        {/* Status */}
        <div className="text-sm text-gray-600">
          Status:{" "}
          <span
            className={`font-medium ${
              challenge.status === "active" ? "text-green-600" : "text-gray-600"
            }`}
          >
            {challenge.status}
          </span>
        </div>

        {/* Amount Input and Upgrade Progress Button */}
        <div className="mt-4 space-y-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={handleUpgradeProgress}
            disabled={challenge.progress >= 100} // Disable if progress is 100%
            className="w-full"
          >
            Add Amount
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};