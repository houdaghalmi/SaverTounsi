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
  onUpdateProgress: (id: string, newAmount: number) => void;
  onJoinChallenge: (id: string,title:string) => void;
}

export const ChallengeCard = ({
  challenge,
  onUpdateProgress,
  onJoinChallenge,
}: ChallengeCardProps) => {
  const [amount, setAmount] = useState("");

  const handleUpgradeProgress = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    onUpdateProgress(challenge.id, amountValue);
    setAmount("");
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

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {Math.min(Math.round(challenge.progress), 100)}/100%
            </span>
          </div>
          <Progress value={Math.min(Math.round(challenge.progress), 100)} />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participants} participants</span>
          </div>
          <span>{challenge.duration} days</span>
        </div>

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

        {challenge.status === "upcoming" && (
          <Button
            onClick={() => onJoinChallenge(challenge.id,challenge.title)}
            className="w-full mt-4"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Join Challenge
          </Button>
        )}

        {challenge.status === "active" && (
          <div className="mt-4 space-y-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount in DT"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleUpgradeProgress}
              disabled={challenge.progress >= 100}
              className="w-full"
            >
              Add Amount
            </Button>
          </div>
        )}

        {challenge.reward && (
          <div className="text-sm text-gray-600">
            Reward: <span className="font-medium">{challenge.reward}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};