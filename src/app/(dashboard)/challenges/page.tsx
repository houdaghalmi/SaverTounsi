// src/app/challenges/page.tsx
"use client";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ProgressTracker } from "@/components/challenges/progress-tracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useState } from "react";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([
    {
      id: "1",
      title: "Collect 100 DT",
      description: "Save 100 DT to complete this challenge.",
      target: 100,
      current: 60,
      progress: 60,
      participants: 120,
      deadline: "in 5 days",
      status: "active",
    },
    {
      id: "2",
      title: "Collect 50 DT",
      description: "Save 50 DT to complete this challenge.",
      target: 50,
      current: 50,
      progress: 100,
      participants: 200,
      deadline: "ended 2 days ago",
      status: "completed",
    },
    {
      id: "3",
      title: "Collect 500 DT",
      description: "Save 500 DT to complete this challenge.",
      target: 500,
      current: 0,
      progress: 0,
      participants: 50,
      deadline: "starts in 7 days",
      status: "upcoming",
    },
  ]);

  const handleUpdateProgress = (id: string, newCurrent: number) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === id
          ? {
              ...challenge,
              current: newCurrent,
              progress: (newCurrent / challenge.target) * 100,
              status: newCurrent >= challenge.target ? "completed" : challenge.status,
            }
          : challenge
      )
    );
  };

  const handleJoinChallenge = (id: string) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, status: "active" }
          : challenge
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Button onClick={() => handleJoinChallenge("3")}>
          <Trophy className="w-4 h-4 mr-2" />
          Join New Challenge
        </Button>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        milestones={[
          {
            title: "Collect 100 DT",
            target: 100,
            current: challenges.find((c) => c.id === "1")?.current || 0,
            unit: "DT",
            isCompleted: challenges.find((c) => c.id === "1")?.progress === 100,
          },
          {
            title: "Collect 50 DT",
            target: 50,
            current: challenges.find((c) => c.id === "2")?.current || 0,
            unit: "DT",
            isCompleted: challenges.find((c) => c.id === "2")?.progress === 100,
          },
          {
            title: "Collect 500 DT",
            target: 500,
            current: challenges.find((c) => c.id === "3")?.current || 0,
            unit: "DT",
            isCompleted: challenges.find((c) => c.id === "3")?.progress === 100,
          },
        ]}
      />

      {/* Tabs for Active, Completed, and Available Challenges */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        {/* Active Challenges */}
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => c.status === "active")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
          </div>
        </TabsContent>

        {/* Completed Challenges */}
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => c.status === "completed")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
          </div>
        </TabsContent>

        {/* Available Challenges */}
        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => c.status === "upcoming")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}