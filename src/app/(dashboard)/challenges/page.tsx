"use client";

import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ProgressTracker } from "@/components/challenges/progress-tracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Challenge, UserChallenge } from "@prisma/client";
import { useState, useEffect } from "react";

// Add this interface near the top of the file
interface ChallengeWithDetails extends Challenge {
  current: number;
  progress: number;
  participants: number;
  status: 'active' | 'completed' | 'available';
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<(UserChallenge & {challenge: Challenge})[]>([]);
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

        // Validate the data
        if (!Array.isArray(challengesData) || !Array.isArray(userChallengesData)) {
          throw new Error("Invalid data format received");
        }

        // Ensure all required fields are present
        const validChallenges = challengesData.filter(c => c && c.id && c.title);
        const validUserChallenges = userChallengesData.filter(
          uc => uc && uc.id && uc.challengeId && uc.challenge
        );

        setChallenges(validChallenges);
        setUserChallenges(validUserChallenges);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoinChallenge = async (challengeId: string,challengeTitle:string) => {
    try {
      const response = await fetch("/api/user-challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId,challengeTitle }),
      });

      if (!response.ok) throw new Error("Failed to join challenge");

      const newUserChallenge = await response.json();
      setUserChallenges((prev) => [...prev, newUserChallenge]);
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  // Update the handleUpdateProgress function to manage both card and tracker progress
  const handleUpdateProgress = async (challengeId: string, newAmount: number) => {
    try {
      const userChallenge = userChallenges.find(
        (uc) => uc.challengeId === challengeId
      );

      if (!userChallenge) return;

      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      // Calculate new total progress
      const newProgress = userChallenge.progress + newAmount;
      const isCompleted = newProgress >= challenge.goal;

      // Optimistically update the UI
      setUserChallenges((prev) =>
        prev.map((uc) =>
          uc.id === userChallenge.id
            ? { ...uc, progress: newProgress, completedAt: isCompleted ? new Date() : null }
            : uc
        )
      );

      // Save the transaction first
      const transactionResponse = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: newAmount,
          type: 'EXPENSE',
          description: `Challenge`,
          date: new Date().toISOString(),
          categoryId: userChallenge.categoryId,
        }),
      });

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        throw new Error(`Failed to save transaction: ${errorData.error || 'Unknown error'}`);
      }

      // Save progress point
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

      // Update challenge progress
      const response = await fetch(`/api/user-challenges/${userChallenge.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: newProgress,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update challenge progress");
      }

      // Only revert if any API call fails
      if (!transactionResponse.ok || !progressResponse.ok || !response.ok) {
        setUserChallenges((prev) =>
          prev.map((uc) =>
            uc.id === userChallenge.id
              ? { ...uc, progress: userChallenge.progress, completedAt: userChallenge.completedAt }
              : uc
          )
        );
        throw new Error("Failed to update progress");
      }

    } catch (error) {
      console.error("Error updating progress:", error);
      alert(error instanceof Error ? error.message : "Failed to update progress");
    }
  };

  const filterChallenges = (status: 'active' | 'completed' | 'available') => {
    return challenges.filter((challenge) => {
      const userChallenge = userChallenges.find(
        (uc) => uc.challengeId === challenge.id
      );

      switch (status) {
        case 'active':
          return userChallenge && !userChallenge.completedAt;
        case 'completed':
          return userChallenge && userChallenge.completedAt;
        case 'available':
          return !userChallenge;
        default:
          return false;
      }
    });
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
    if (!goal || goal === 0) return 0;
    return Math.round((current / goal) * 100); // This will round to nearest whole number
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Challenges</h1>
      </div>

      <ProgressTracker
        milestones={userChallenges
          .filter(uc => !uc.completedAt && uc.challenge) // Add check for challenge existence
          .map((uc) => ({
            title: uc.challenge?.title || 'Unnamed Challenge', // Add fallback
            target: uc.challenge?.goal || 0,
            current: uc.progress || 0,
            unit: "DT",
            isCompleted: !!uc.completedAt,
          }))}
      />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({filterChallenges('active').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterChallenges('completed').length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({filterChallenges('available').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterChallenges('active').map((challenge) => {
              const userChallenge = userChallenges.find(
                (uc) => uc.challengeId === challenge.id
              );
              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={{
                    ...challenge,
                    current: userChallenge?.progress || 0,
                    progress: calculateProgressPercentage(
                      userChallenge?.progress || 0,
                      challenge.goal
                    ), // This will now return whole numbers
                    participants: userChallenges.filter(
                      (uc) => uc.challengeId === challenge.id
                    ).length,
                    status: 'active',
                  }}
                  onUpdateProgress={handleUpdateProgress}
                  onJoinChallenge={handleJoinChallenge}
                />
              );
            })}
            {filterChallenges('active').length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-8">
                No active challenges. Join a challenge to get started!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterChallenges('completed').map((challenge) => {
              const userChallenge = userChallenges.find(
                (uc) => uc.challengeId === challenge.id
              );
              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={{
                    ...challenge,
                    current: userChallenge?.progress || 0,
                    progress: 100,
                    participants: userChallenges.filter(
                      (uc) => uc.challengeId === challenge.id
                    ).length,
                    status: 'completed',
                  }}
                  onUpdateProgress={handleUpdateProgress}
                  onJoinChallenge={handleJoinChallenge}
                />
              );
            })}
            {filterChallenges('completed').length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-8">
                No completed challenges yet. Keep going!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterChallenges('available').map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={{
                  ...challenge,
                  current: 0,
                  progress: 0,
                  participants: userChallenges.filter(
                    (uc) => uc.challengeId === challenge.id
                  ).length,
                  status: 'available',
                }}
                onUpdateProgress={handleUpdateProgress}
                onJoinChallenge={handleJoinChallenge}
              />
            ))}
            {filterChallenges('available').length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-8">
                No available challenges at the moment. Check back later!
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}