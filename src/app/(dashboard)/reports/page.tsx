"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts";
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
  title: string;
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

  // Previous JSX remains the same until the challenges tab
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
          {/* Monthly Report */}
          <TabsContent value="monthly" className='flex flex-col w-full'>
            <h2 className="text-xl font-semibold mb-4">Monthly Report</h2>
            <div className="flex w-full justify-start">
              <div className="w-full ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Spending Card */}
                  <Card >
                    <CardHeader>
                      <CardTitle className="text-[#1a2a6c]">
                        {spendingViewMode === "detailed" 
                          ? "Monthly Spending by Category"
                          : "Monthly Spending by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Spent: {monthlyData.spent} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSpendingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              spendingViewMode === "detailed"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSpendingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              spendingViewMode === "grouped"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Grouped
                          </button>
                        </div>
                        <h3 className="text-md font-medium">
                          {spendingViewMode === "detailed" ? "Spending by Category" : "Spending by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {spendingViewMode === "detailed"
                            ? monthlyData.categories.map((category) => (
                                <li key={category.id} className="flex justify-between text-[#1a2a6c]">
                                  <span>{category.name}</span>
                                  <span className="font-medium text-[#b21f1f]">{category.spent} DT</span>
                                </li>
                              ))
                            : monthlyGroupedCategories.map((group) => (
                                <li key={group.groupName} className="flex justify-between text-[#1a2a6c]">
                                  <span>{group.groupName}</span>
                                  <span className="font-medium text-[#b21f1f]">{group.amount} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Savings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a2a6c]">
                        {savingViewMode === "detailed" 
                          ? "Monthly Savings by Category"
                          : "Monthly Savings by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Saved: {monthlyData.saved} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSavingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              savingViewMode === "detailed"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSavingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              savingViewMode === "grouped"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Grouped
                          </button>
                        </div>
                        <h3 className="text-md font-medium">
                          {savingViewMode === "detailed" ? "Savings by Category" : "Savings by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {savingViewMode === "detailed"
                            ? monthlyData.savingsData.map((savings) => (
                                <li key={savings.categoryName} className="flex justify-between text-[#1a2a6c]">
                                  <span>{savings.categoryName}</span>
                                  <span className="font-medium text-[#b21f1f]">{savings.saved} DT</span>
                                </li>
                              ))
                            : monthlyGroupedSavings.map((group) => (
                                <li key={group.groupName} className="flex justify-between text-[#1a2a6c]">
                                  <span>{group.groupName}</span>
                                  <span className="font-medium text-[#b21f1f]">{group.amount} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Charts */}
                <div className="mt-6">
                  {/* Monthly Spending Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {spendingViewMode === "detailed" 
                          ? "Monthly Spending by Category"
                          : "Monthly Spending by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={spendingViewMode === "detailed" 
                              ? monthlyData.categories
                              : monthlyGroupedCategories}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey={spendingViewMode === "detailed" ? "name" : "groupName"}
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey={spendingViewMode === "detailed" ? "spent" : "amount"}
                              fill="#8884d8" 
                              name="Spent" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Savings Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>
                        {savingViewMode === "detailed" 
                          ? "Monthly Savings by Category"
                          : "Monthly Savings by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={savingViewMode === "detailed" 
                              ? monthlyData.savingsData
                              : monthlyGroupedSavings}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey={savingViewMode === "detailed" ? "categoryName" : "groupName"}
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey={savingViewMode === "detailed" ? "saved" : "amount"}
                              fill="#82ca9d" 
                              name="Saved Amount" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Yearly Report */}
          <TabsContent value="yearly">
            <h2 className="text-xl font-semibold mb-4">Yearly Report</h2>
            <div className="flex justify-end">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yearly Spending Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a2a6c]">
                        {spendingViewMode === "detailed" 
                          ? "Yearly Spending by Category"
                          : "Yearly Spending by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Spent: {yearlyData.spent} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSpendingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              spendingViewMode === "detailed"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSpendingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              spendingViewMode === "grouped"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Grouped
                          </button>
                        </div>
                        <h3 className="text-md font-medium">
                          {spendingViewMode === "detailed" ? "Spending by Category" : "Spending by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {spendingViewMode === "detailed"
                            ? yearlyData.categories.map((category) => (
                                <li key={category.id} className="flex justify-between text-[#1a2a6c]">
                                  <span>{category.name}</span>
                                  <span className="font-medium text-[#b21f1f]">{category.spent * 12} DT</span>
                                </li>
                              ))
                            : yearlyGroupedCategories.map((group) => (
                                <li key={group.groupName} className="flex justify-between text-[#1a2a6c]">
                                  <span>{group.groupName}</span>
                                  <span className="font-medium text-[#b21f1f]">{group.amount * 12} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yearly Savings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a2a6c]">
                        {savingViewMode === "detailed" 
                          ? "Yearly Savings by Category"
                          : "Yearly Savings by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Saved: {yearlyData.saved} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSavingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              savingViewMode === "detailed"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSavingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              savingViewMode === "grouped"
                                ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                                : "bg-[#1a2a6c]/10 text-[#1a2a6c] hover:bg-[#1a2a6c]/20"
                            }`}
                          >
                            Grouped
                          </button>
                        </div>
                        <h3 className="text-md font-medium">
                          {savingViewMode === "detailed" ? "Savings by Category" : "Savings by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {savingViewMode === "detailed"
                            ? yearlyData.savingsData.map((savings) => (
                                <li key={savings.categoryName} className="flex justify-between text-[#1a2a6c]">
                                  <span>{savings.categoryName}</span>
                                  <span className="font-medium text-[#b21f1f]">{savings.saved * 12} DT</span>
                                </li>
                              ))
                            : yearlyGroupedSavings.map((group) => (
                                <li key={group.groupName} className="flex justify-between text-[#1a2a6c]">
                                  <span>{group.groupName}</span>
                                  <span className="font-medium text-[#b21f1f]">{group.amount * 12} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Yearly Charts */}
                <div className="mt-6">
                  {/* Yearly Category/Group Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {spendingViewMode === "detailed" 
                          ? "Yearly Spending by Category"
                          : "Yearly Spending by Group"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={spendingViewMode === "detailed" 
                              ? yearlyData.categories
                              : yearlyGroupedCategories}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey={spendingViewMode === "detailed" ? "name" : "groupName"}
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey={spendingViewMode === "detailed" ? "spent" : "amount"}
                              fill="#8884d8" 
                              name="Spent" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yearly Trend Charts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Yearly Spending & Savings Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={yearlyData.monthlySpending.map((item, index) => ({
                              month: item.month,
                              spending: item.amount,
                              savings: yearlyData.monthlySavings[index].amount
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="month"
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="spending"
                              fill="#8884d8" 
                              name="Monthly Spending"
                            />
                            <Bar 
                              dataKey="savings"
                              fill="#82ca9d"
                              name="Monthly Savings"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Updated Challenge Report */}
          <TabsContent value="challenges">
            <h2 className="text-xl font-semibold mb-4">Challenge Progress</h2>
            <div className="flex justify-end">
              <div className="w-full  space-y-6">
                {userChallenges.map((userChallenge) => (
                  <Card key={userChallenge.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold">
                        {userChallenge.challenge.title}
                      </CardTitle>
                      <div className="text-lg font-semibold text-primary">
                        {calculateProgressPercentage(userChallenge)}%
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {userChallenge.challenge.description}
                        </p>

                        {userChallenge.completed && userChallenge.completedAt && (
                          <p className="text-sm text-green-600 font-medium">
                            Completed on: {new Date(userChallenge.completedAt).toLocaleDateString()}
                          </p>
                        )}

                        <div className="h-64 mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={progressHistory[userChallenge.id] || []}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis 
                                domain={[0, userChallenge.challenge.goal]}
                                label={{ value: 'Amount (DT)', angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#82ca9d"
                                strokeWidth={2}
                                name="Progress"
                                dot={{ r: 6 }}
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
