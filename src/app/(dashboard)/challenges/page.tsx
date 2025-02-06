"use client";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ProgressTracker } from "@/components/challenges/progress-tracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  duration: number;
  reward?: string;
  type: string;
}

interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number; // This is now the actual money amount
  startDate: Date;
  completed: boolean;
  completedAt?: Date;
  challenge: Challenge;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesRes, userChallengesRes] = await Promise.all([
          fetch("/api/challenges"),
          fetch("/api/user-challenges"),
        ]);

        if (!challengesRes.ok || !userChallengesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [challengesData, userChallengesData] = await Promise.all([
          challengesRes.json(),
          userChallengesRes.json(),
        ]);

        setChallenges(challengesData);
        setUserChallenges(userChallengesData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const response = await fetch("/api/user-challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });

      if (!response.ok) throw new Error("Failed to join challenge");

      const newUserChallenge = await response.json();
      setUserChallenges((prev) => [...prev, newUserChallenge]);
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  const handleUpdateProgress = async (challengeId: string, newAmount: number) => {
    try {
      const userChallenge = userChallenges.find(
        (uc) => uc.challengeId === challengeId
      );

      if (!userChallenge) return;

      // Calculate new total progress by adding the new amount
      const newProgress = userChallenge.progress + newAmount;
      const isCompleted = newProgress >= userChallenge.challenge.goal;

      // First save the progress point
      const progressResponse = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userChallengeId: userChallenge.id,
          amount: newAmount,
        }),
      });

      if (!progressResponse.ok) {
        throw new Error('Failed to save progress point');
      }

      // Then update the challenge progress
      const response = await fetch(`/api/user-challenges/${userChallenge.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: newProgress,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      const updatedUserChallenge = await response.json();
      setUserChallenges((prev) =>
        prev.map((uc) =>
          uc.id === updatedUserChallenge.id ? updatedUserChallenge : uc
        )
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) return <div>Loading challenges...</div>;
  if (error) return <div>Error: {error}</div>;

  const getChallengeStatus = (challenge: Challenge) => {
    const userChallenge = userChallenges.find(
      (uc) => uc.challengeId === challenge.id
    );
    if (!userChallenge) return "upcoming";
    return userChallenge.completed ? "completed" : "active";
  };

  const getCurrentProgress = (challengeId: string) => {
    const userChallenge = userChallenges.find(
      (uc) => uc.challengeId === challengeId
    );
    return userChallenge?.progress || 0;
  };

  const calculateProgressPercentage = (current: number, goal: number) => {
    return (current / goal) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Challenges</h1>
      </div>

      <ProgressTracker
        milestones={userChallenges.map((uc) => ({
          title: uc.challenge.title,
          target: uc.challenge.goal,
          current: uc.progress,
          unit: "DT",
          isCompleted: uc.completed,
        }))}
      />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => getChallengeStatus(c) === "active")
              .map((challenge) => {
                const currentProgress = getCurrentProgress(challenge.id);
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={{
                      ...challenge,
                      current: currentProgress,
                      progress: calculateProgressPercentage(currentProgress, challenge.goal),
                      participants: userChallenges.filter(
                        (uc) => uc.challengeId === challenge.id
                      ).length,
                      status: getChallengeStatus(challenge),
                    }}
                    onUpdateProgress={handleUpdateProgress}
                    onJoinChallenge={handleJoinChallenge}
                  />
                );
              })}
          </div>
        </TabsContent>

        {/* Similar updates for completed and available tabs */}
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => getChallengeStatus(c) === "completed")
              .map((challenge) => {
                const currentProgress = getCurrentProgress(challenge.id);
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={{
                      ...challenge,
                      current: currentProgress,
                      progress: calculateProgressPercentage(currentProgress, challenge.goal),
                      participants: userChallenges.filter(
                        (uc) => uc.challengeId === challenge.id
                      ).length,
                      status: getChallengeStatus(challenge),
                    }}
                    onUpdateProgress={handleUpdateProgress}
                    onJoinChallenge={handleJoinChallenge}
                  />
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => getChallengeStatus(c) === "upcoming")
              .map((challenge) => {
                const currentProgress = getCurrentProgress(challenge.id);
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={{
                      ...challenge,
                      current: currentProgress,
                      progress: calculateProgressPercentage(currentProgress, challenge.goal),
                      participants: userChallenges.filter(
                        (uc) => uc.challengeId === challenge.id
                      ).length,
                      status: getChallengeStatus(challenge),
                    }}
                    onUpdateProgress={handleUpdateProgress}
                    onJoinChallenge={handleJoinChallenge}
                  />
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}