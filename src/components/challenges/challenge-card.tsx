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
    goal: number;
    current: number;
    progress: number;
    participants: number;
    duration: number;
    reward?: string;
    status: string;
  };
  onUpdateProgress: (id: string, newCurrent: number) => void;
  onJoinChallenge: (id: string) => void;
}

export const ChallengeCard = ({
  challenge: initialChallenge,
  onUpdateProgress,
  onJoinChallenge,
}: ChallengeCardProps) => {
  const [challenge, setChallenge] = useState(initialChallenge);
  const [amount, setAmount] = useState("");

  // Ensure current and goal are valid numbers
  const current = isNaN(challenge.current) ? 0 : challenge.current;
  const goal = isNaN(challenge.goal) ? 0 : challenge.goal;
  const progress = (current / goal) * 100 || 0; // Default to 0 if NaN

  const handleUpgradeProgress = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const newCurrent = Math.min(current + amountValue, goal);
    const newProgress = (newCurrent / goal) * 100;
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
            <span>
              {Math.round(progress)}/100% {/* Always show progress as 0/100% */}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Participants and Duration */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participants} participants</span>
          </div>
          <span>{challenge.duration} days</span>
        </div>

        {/* Status */}
        <div className="text-sm text-gray-600">
          Status:{" "}
          <span
            className={`font-medium ${
              challenge.status === "active"
                ? "text-green-600"
                : challenge.status === "completed"
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            {challenge.status}
          </span>
        </div>

        {/* Join Challenge Button (for upcoming challenges) */}
        {challenge.status === "upcoming" && (
          <Button
            onClick={() => onJoinChallenge(challenge.id)}
            className="w-full mt-4"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Join Challenge
          </Button>
        )}

        {/* Amount Input and Add Progress Button (for active challenges) */}
        {challenge.status === "active" && (
          <div className="mt-4 space-y-2">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleUpgradeProgress}
              disabled={progress >= 100}
              className="w-full"
            >
              Add Amount
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};