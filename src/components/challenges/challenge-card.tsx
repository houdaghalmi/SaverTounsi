"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Challenge } from "@prisma/client";
import { motion } from "framer-motion";

interface ExtendedChallenge extends Challenge {
  progress: number;
  current: number;
  participants: number;
  status: 'active' | 'completed' | 'available';
}

interface ChallengeCardProps {
  challenge: ExtendedChallenge;
  onUpdateProgress: (id: string, newAmount: number) => void;
  onJoinChallenge: (id: string, title: string) => void;
}

export function ChallengeCard({
  challenge,
  onUpdateProgress,
  onJoinChallenge,
}: ChallengeCardProps) {
  const [amount, setAmount] = useState("");

  const handleUpdateProgress = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    onUpdateProgress(challenge.id, amountValue);
    setAmount("");
  };

  return (
    <Card className="group w-full hover:shadow-md transition-all duration-200 border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#1a2a6c]/10">
              <Trophy className="w-5 h-5 text-[#1a2a6c]" />
            </div>
            <span className="text-lg font-semibold text-[#1a2a6c]">{challenge.title}</span>
          </div>
          <div className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            challenge.status === "active" && "bg-green-100 text-green-700",
            challenge.status === "completed" && "bg-blue-100 text-blue-700",
            challenge.status === "available" && "bg-orange-100 text-orange-700"
          )}>
            {challenge.status}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

        {/* Progress Section - Only show for active and completed challenges */}
        {challenge.status !== "available" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="font-semibold px-2 py-0.5 rounded-full bg-[#1a2a6c]/10 text-[#1a2a6c]">
                {Math.round(challenge.progress)}%
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-[#1a2a6c]/10 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#1a2a6c] transition-all duration-300"
                style={{ width: `${Math.min(challenge.progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Users className="w-4 h-4 text-[#1a2a6c]" />
            <span>{challenge.participants} participants</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Target className="w-4 h-4 text-[#1a2a6c]" />
            <span>{challenge.duration} days</span>
          </div>
        </div>

        {/* Action Buttons */}
        {challenge.status === "available" && (
          <Button
            onClick={() => onJoinChallenge(challenge.id, challenge.title)}
            className="w-full bg-[#1a2a6c] text-white hover:bg-[#1a2a6c]/90 transition-opacity"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Join Challenge
          </Button>
        )}

        {challenge.status === "active" && (
          <div className="space-y-2">
            <Input
              type="number"
              step="0.5"
              min="0"
              placeholder="Enter amount in DT"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-gray-200 focus:border-[#1a2a6c] focus:ring-2 focus:ring-[#1a2a6c]/20"
            />
            <Button
              onClick={handleUpdateProgress}
              disabled={challenge.progress >= 100}
              className="w-full bg-[#1a2a6c] text-white hover:bg-[#1a2a6c]/90 transition-opacity disabled:opacity-50"
            >
              Add Progress
            </Button>
          </div>
        )}

        {/* Reward Badge */}
        {challenge.reward && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1a2a6c]/10 text-[#1a2a6c]">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{challenge.reward}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}