"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyReport } from "@/components/reports/MonthlyReport";
import { YearlyReport } from "@/components/reports/YearlyReport";
import { ChallengeReport } from "@/components/reports/ChallengeReport";
import { useState, useEffect } from "react";

// Previous interfaces remain the same
interface CategoryGroup {
  id: string;
  name: string;
  userId: string;
}

interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  groupId: string;
  group: CategoryGroup;
}

interface SavingsData {
  categoryName: string;
  groupName: string;
  saved: number;
  budget: number;
  spent: number;
}

interface MonthlyData {
  month: string;
  amount: number;
}

// Updated Challenge interfaces
interface Challenge {
  id: string;
  title: string;        // Changed from name to title
  description: string;
  goal: number;
  duration: number;
  reward?: string;
  createdAt: string;
  progress: number;
  startDate: string;
  completed: boolean;
  completedAt?: string;
}

interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  startDate: string;
  completed: boolean;
  completedAt?: string;
  challenge: Challenge;
}

interface UserChallengeProgress {
  id: string;
  date: string;
  amount: number;
  userChallengeId: string;
}

interface MonthlyReport {
  spent: number;
  saved: number;
  categories: Category[];
  savingsData: SavingsData[];
}

interface YearlyReport extends MonthlyReport {
  monthlySpending: MonthlyData[];
  monthlySavings: MonthlyData[];
}

interface GroupedData {
  groupName: string;
  amount: number;
}

interface ProgressPoint {
  day: string;
  amount: number;
  percentage: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      amount: number;
      percentage: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium">Progress Details</p>
        <p className="text-sm">Amount: {data.amount} DT</p>
        <p className="text-sm">Progress: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [spendingViewMode, setSpendingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [savingViewMode, setSavingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [monthlyData, setMonthlyData] = useState<MonthlyReport | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyReport | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [userChallengeProgress, setUserChallengeProgress] = useState<UserChallengeProgress[]>([]);
  const [progressHistory, setProgressHistory] = useState<Record<string, ProgressPoint[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, challengesResponse, userChallengesResponse, progressResponse] = 
          await Promise.all([
            fetch("/api/categories"),
            fetch("/api/challenges"),
            fetch("/api/user-challenges"),
            fetch("/api/user-progress")
          ]);

        if (!categoriesResponse.ok || !challengesResponse.ok || 
            !userChallengesResponse.ok || !progressResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData: Category[] = await categoriesResponse.json();
        const challengesData: Challenge[] = await challengesResponse.json();
        const userChallengesData: UserChallenge[] = await userChallengesResponse.json();
        const progressData = await progressResponse.json();

        // Calculate progress points with real user data
        const progressPoints = userChallengesData.reduce((acc, challenge) => {
          const goalAmount = challenge.challenge.goal;
          
          // Create all points array
          const allPoints = [
            // Start point
            { 
              day: "0%", 
              amount: 0, 
              percentage: 0 
            },
            // Current progress point
            {
              day: `${Math.round((challenge.progress / goalAmount) * 100)}%`,
              amount: challenge.progress,
              percentage: Math.round((challenge.progress / goalAmount) * 100)
            },
            // Goal point
            {
              day: "100%",
              amount: goalAmount,
              percentage: 100
            },
            // Real progress points
            ...progressData
              .filter((p: UserChallengeProgress) => p.userChallengeId === challenge.id)
              .map((p: UserChallengeProgress) => ({
                day: `${Math.round((p.amount / goalAmount) * 100)}%`,
                amount: p.amount,
                percentage: Math.round((p.amount / goalAmount) * 100)
              }))
          ]
          .sort((a, b) => a.percentage - b.percentage)
          .filter((point, index, array) => 
            array.findIndex(p => p.percentage === point.percentage) === index
          );

          acc[challenge.id] = allPoints;
          return acc;
        }, {} as Record<string, ProgressPoint[]>);

        setProgressHistory(progressPoints);
        setUserChallengeProgress(progressData);
        setChallenges(challengesData);
        setUserChallenges(userChallengesData);

        const monthlyData: MonthlyReport = {
          spent: categoriesData.reduce((acc, category) => acc + category.spent, 0),
          saved: categoriesData.reduce((acc, category) => acc + (category.budget - category.spent), 0),
          categories: categoriesData,
          savingsData: categoriesData.map(category => ({
            categoryName: category.name,
            groupName: category.group.name,
            saved: category.budget - category.spent,
            budget: category.budget,
            spent: category.spent
          })),
        };

        // Get months array for current year
        const months = Array.from({length: 12}, (_, i) => {
          const date = new Date();
          date.setMonth(i);
          return date.toLocaleString('default', { month: 'short' });
        });

        // Calculate monthly spending trend
        const monthlySpending = months.map(month => ({
          month,
          amount: categoriesData.reduce((acc, category) => acc + category.spent, 0) / 12
        }));

        // Calculate monthly savings trend  
        const monthlySavings = months.map(month => ({
          month,
          amount: categoriesData.reduce((acc, category) => 
            acc + (category.budget - category.spent), 0) / 12
        }));

        const currentYear = new Date().getFullYear();

        // Get real monthly spending data
        const realMonthlySpending = Array.from({length: 12}, (_, monthIndex) => {
          const month = new Date(currentYear, monthIndex).toLocaleString('default', { month: 'short' });
          const spending = categoriesData.reduce((total, category) => {
            return total + category.spent;
          }, 0);
          
          return {
            month,
            amount: spending
          };
        });

        // Get real monthly savings data
        const realMonthlySavings = Array.from({length: 12}, (_, monthIndex) => {
          const month = new Date(currentYear, monthIndex).toLocaleString('default', { month: 'short' });
          const savings = categoriesData.reduce((total, category) => {
            return total + (category.budget - category.spent);
          }, 0);
          
          return {
            month,
            amount: savings
          };
        });

        const yearlyTotalSpent = categoriesData.reduce((acc, category) => acc + (category.spent * 12), 0);
        const yearlyTotalSaved = categoriesData.reduce((acc, category) => acc + ((category.budget - category.spent) * 12), 0);

        const yearlyData: YearlyReport = {
          ...monthlyData,
          spent: yearlyTotalSpent,
          saved: yearlyTotalSaved,
          monthlySpending: realMonthlySpending,
          monthlySavings: realMonthlySavings,
        };

        setMonthlyData(monthlyData);
        setYearlyData(yearlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Previous helper functions remain the same
  const groupSpendingCategories = (categories: Category[]): GroupedData[] => {
    const groupedData = categories.reduce((acc: Record<string, number>, category) => {
      const groupName = category.group.name;
      if (!acc[groupName]) {
        acc[groupName] = 0;
      }
      acc[groupName] += category.spent;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([groupName, amount]) => ({
      groupName,
      amount,
    }));
  };

  const groupSavings = (categories: Category[]): GroupedData[] => {
    const groupedData = categories.reduce((acc: Record<string, number>, category) => {
      const groupName = category.group.name;
      if (!acc[groupName]) {
        acc[groupName] = 0;
      }
      acc[groupName] += (category.budget - category.spent);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([groupName, amount]) => ({
      groupName,
      amount,
    }));
  };

  if (!monthlyData || !yearlyData) {
    return <div>Loading...</div>;
  }

  const monthlyGroupedCategories = groupSpendingCategories(monthlyData.categories);
  const yearlyGroupedCategories = groupSpendingCategories(yearlyData.categories);
  const monthlyGroupedSavings = groupSavings(monthlyData.categories);
  const yearlyGroupedSavings = groupSavings(yearlyData.categories);

  // Helper function to calculate days remaining
  const getDaysRemaining = (startDate: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  // Calculate progress percentage for each user challenge
  const calculateProgressPercentage = (userChallenge: UserChallenge) => {
    return Math.round((userChallenge.progress / userChallenge.challenge.goal) * 100);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="yearly">Yearly Report</TabsTrigger>
          <TabsTrigger value="challenges">Challenge Report</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="monthly">
            <MonthlyReport
              data={monthlyData}
              spendingViewMode={spendingViewMode}
              savingViewMode={savingViewMode}
              setSpendingViewMode={setSpendingViewMode}
              setSavingViewMode={setSavingViewMode}
              groupedCategories={monthlyGroupedCategories}
              groupedSavings={monthlyGroupedSavings}
            />
          </TabsContent>

          <TabsContent value="yearly">
            <YearlyReport
              data={yearlyData}
              spendingViewMode={spendingViewMode}
              savingViewMode={savingViewMode}
              setSpendingViewMode={setSpendingViewMode}
              setSavingViewMode={setSavingViewMode}
              groupedCategories={yearlyGroupedCategories}
              groupedSavings={yearlyGroupedSavings}
            />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengeReport
              userChallenges={userChallenges}
              progressHistory={progressHistory}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
