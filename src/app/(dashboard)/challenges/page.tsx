"use client";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ProgressTracker } from "@/components/challenges/progress-tracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedChallenges, setJoinedChallenges] = useState(new Set()); // Track joined challenges

  // Fetch challenges from the API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("/api/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const data = await response.json();
        setChallenges(data.map((challenge) => ({ ...challenge, current: 0 }))); // Initialize current progress
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Calculate status for a challenge
  const getChallengeStatus = (challenge) => {
    if (joinedChallenges.has(challenge.id)) {
      return challenge.current >= challenge.goal ? "completed" : "active";
    }
    return "upcoming"; // Not joined yet
  };

  const handleUpdateProgress = (id: string, newCurrent: number) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === id
          ? {
              ...challenge,
              current: newCurrent,
              progress: (newCurrent / challenge.goal) * 100,
            }
          : challenge
      )
    );
  };

  const handleJoinChallenge = (id: string) => {
    setJoinedChallenges((prev) => new Set(prev).add(id)); // Add to joined challenges
  };

  if (loading) return <div>Loading challenges...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Challenges</h1>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        milestones={challenges.map((challenge) => ({
          title: challenge.title,
          target: challenge.goal,
          current: challenge.current,
          unit: "DT",
          isCompleted: challenge.current >= challenge.goal,
        }))}
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
              .filter((c) => getChallengeStatus(c) === "active")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={{
                    ...challenge,
                    status: getChallengeStatus(challenge),
                  }}
                  onUpdateProgress={handleUpdateProgress}
                  onJoinChallenge={handleJoinChallenge}
                />
              ))}
          </div>
        </TabsContent>

        {/* Completed Challenges */}
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => getChallengeStatus(c) === "completed")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={{
                    ...challenge,
                    status: getChallengeStatus(challenge),
                  }}
                  onUpdateProgress={handleUpdateProgress}
                  onJoinChallenge={handleJoinChallenge}
                />
              ))}
          </div>
        </TabsContent>

        {/* Available Challenges */}
        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((c) => getChallengeStatus(c) === "upcoming")
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={{...challenge,
                    status: getChallengeStatus(challenge),
                  }}
                  onUpdateProgress={handleUpdateProgress}
                  onJoinChallenge={handleJoinChallenge}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}