"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Confetti } from "@/components/confetti";
import { ChallengeCompletionModal } from "@/components/challenge-completion-modal";
import { formatCurrency } from "@/lib/utils";
import { Challenge } from "@prisma/client";



interface UserChallenge {
  id: string;
  progress: number;
  startDate: string;
  completedAt: string | null;
  challenge: Challenge;
  categoryId: string;
}

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionData, setCompletionData] = useState<{
    userChallenge: UserChallenge;
    recommendedChallenge: Challenge;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const response = await fetch(`/api/user-challenges/${(await params).id}`);
        if (response.ok) {
          const data = await response.json();
          setUserChallenge(data);
          
          // Fetch related transactions
          if (data.categoryId) {
            const transactionsResponse = await fetch(`/api/transactions?categoryId=${data.categoryId}`);
            if (transactionsResponse.ok) {
              const transactionsData = await transactionsResponse.json();
              setTransactions(transactionsData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching challenge data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeData();
  }, [params]);

  const handleChallengeComplete = async () => {
    try {
      const response = await fetch(`/api/user-challenges/${userChallenge?.id}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        const data = await response.json();
        setShowConfetti(true);
        setCompletionData(data);
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const calculateProgress = () => {
    if (!userChallenge) return 0;
    const totalSpent = transactions.reduce((sum: number, tx: any) => 
      sum + (tx.type === 'EXPENSE' ? tx.amount : 0), 0);
    return Math.min((totalSpent / userChallenge.challenge.goal) * 100, 100);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!userChallenge) {
    return <div className="flex items-center justify-center min-h-screen">Challenge not found</div>;
  }

  const progress = calculateProgress();
  const isCompleted = userChallenge.completedAt || progress >= 100;

  return (
    <div className="container max-w-4xl py-8">
      {showConfetti && <Confetti />}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{userChallenge.challenge.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{userChallenge.challenge.description}</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Goal</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(userChallenge.challenge.goal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-lg font-semibold">
                  {new Date(userChallenge.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!isCompleted && progress >= 100 && (
              <Button 
                className="w-full"
                onClick={handleChallengeComplete}
              >
                Complete Challenge
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{tx.description || 'No description'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-semibold ${
                  tx.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-500">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {completionData && (
        <ChallengeCompletionModal
          isOpen={!!completionData}
          onClose={() => setCompletionData(null)}
          completedChallenge={completionData.userChallenge}
          recommendedChallenge={completionData.recommendedChallenge}
        />
      )}
    </div>
  );
}
