"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import { useState, useEffect } from "react";

// Updated interfaces
interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  group: string;
}

interface GroupCategory {
  id: string;
  name: string;
}

interface SavingsData {
  categoryName: string;
  saved: number;  // budget - spent
  budget: number;
  spent: number;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface Challenge {
  id: string;
  title: string;
  progress: number;
  progressData: Array<{
    day: string;
    amount: number;
  }>;
}

interface MonthlyReport {
  spent: number;
  saved: number;
  categories: Category[];
  groupCategories: GroupCategory[];
  savingsData: SavingsData[];
}

interface YearlyReport extends MonthlyReport {
  monthlySpending: MonthlyData[];
  monthlySavings: MonthlyData[];
}

export default function ReportsPage() {
  const [spendingViewMode, setSpendingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [savingViewMode, setSavingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [monthlyData, setMonthlyData] = useState<MonthlyReport | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyReport | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, groupCategoriesResponse, challengesResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/category-groups"),
          fetch("/api/challenges"),
        ]);

        if (!categoriesResponse.ok || !groupCategoriesResponse.ok || !challengesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData: Category[] = await categoriesResponse.json();
        const groupCategoriesData: GroupCategory[] = await groupCategoriesResponse.json();
        const challengesData: Challenge[] = await challengesResponse.json();

        const monthlyData: MonthlyReport = {
          spent: categoriesData.reduce((acc, category) => acc + category.spent, 0),
          saved: categoriesData.reduce((acc, category) => acc + (category.budget - category.spent), 0),
          categories: categoriesData,
          groupCategories: groupCategoriesData,
          savingsData: categoriesData.map(category => ({
            categoryName: category.name,
            saved: category.budget - category.spent,
            budget: category.budget,
            spent: category.spent
          })),
        };

        const yearlyData: YearlyReport = {
          ...monthlyData,
          monthlySpending: [],
          monthlySavings: [],
        };

        setMonthlyData(monthlyData);
        setYearlyData(yearlyData);
        setChallenges(challengesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!monthlyData || !yearlyData || challenges.length === 0) {
    return <div>Loading...</div>;
  }

  // Group spending categories by group
  const groupSpendingCategories = (categories: Category[]): Record<string, number> => {
    return categories.reduce((acc: Record<string, number>, category) => {
      if (!acc[category.group]) {
        acc[category.group] = 0;
      }
      acc[category.group] += category.spent;
      return acc;
    }, {});
  };

  // Group savings by category group
  const groupSavings = (categories: Category[]): Record<string, number> => {
    return categories.reduce((acc: Record<string, number>, category) => {
      if (!acc[category.group]) {
        acc[category.group] = 0;
      }
      acc[category.group] += (category.budget - category.spent);
      return acc;
    }, {});
  };

  const monthlyGroupedCategories = groupSpendingCategories(monthlyData.categories);
  const yearlyGroupedCategories = groupSpendingCategories(yearlyData.categories);

  const monthlyGroupedSavings = groupSavings(monthlyData.categories);
  const yearlyGroupedSavings = groupSavings(yearlyData.categories);

  const getGroupName = (groupId: string): string => {
    const group = monthlyData.groupCategories.find(group => group.id === groupId);
    return group ? group.name : "Unknown Group";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
          <TabsContent value="monthly">
            <h2 className="text-xl font-semibold mb-4">Monthly Report</h2>
            <div className="flex justify-end">
              <div className="w-full max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Spending Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Spent: {monthlyData.spent} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSpendingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md ${
                              spendingViewMode === "detailed"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSpendingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md ${
                              spendingViewMode === "grouped"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
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
                                <li key={category.id} className="flex justify-between">
                                  <span>{category.name}</span>
                                  <span>{category.spent} DT</span>
                                </li>
                              ))
                            : Object.entries(monthlyGroupedCategories).map(([group, amount]) => (
                                <li key={group} className="flex justify-between">
                                  <span>{getGroupName(group)}</span>
                                  <span>{amount} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Savings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Saved: {monthlyData.saved} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSavingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md ${
                              savingViewMode === "detailed"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSavingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md ${
                              savingViewMode === "grouped"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
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
                                <li key={savings.categoryName} className="flex justify-between">
                                  <span>{savings.categoryName}</span>
                                  <span>{savings.saved} DT</span>
                                </li>
                              ))
                            : Object.entries(monthlyGroupedSavings).map(([group, amount]) => (
                                <li key={group} className="flex justify-between">
                                  <span>{getGroupName(group)}</span>
                                  <span>{amount} DT</span>
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
                      <CardTitle>Monthly Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData.categories}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="spent" fill="#8884d8" name="Spent" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Savings Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Monthly Savings by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData.savingsData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoryName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="saved" fill="#82ca9d" name="Saved Amount" />
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
              <div className="w-full max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yearly Spending Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Yearly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Spent: {yearlyData.spent} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSpendingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md ${
                              spendingViewMode === "detailed"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSpendingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md ${
                              spendingViewMode === "grouped"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
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
                                <li key={category.id} className="flex justify-between">
                                  <span>{category.name}</span>
                                  <span>{category.spent} DT</span>
                                </li>
                              ))
                            : Object.entries(yearlyGroupedCategories).map(([group, amount]) => (
                                <li key={group} className="flex justify-between">
                                  <span>{getGroupName(group)}</span>
                                  <span>{amount} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yearly Savings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Yearly Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Total Saved: {yearlyData.saved} DT
                      </p>
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSavingViewMode("detailed")}
                            className={`px-4 py-2 rounded-md ${
                              savingViewMode === "detailed"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setSavingViewMode("grouped")}
                            className={`px-4 py-2 rounded-md ${
                              savingViewMode === "grouped"
                                ? "bg-primary text-white"
                                : "bg-gray-100"
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
                                <li key={savings.categoryName} className="flex justify-between">
                                  <span>{savings.categoryName}</span>
                                  <span>{savings.saved} DT</span>
                                </li>
                              ))
                            : Object.entries(yearlyGroupedSavings).map(([group, amount]) => (
                                <li key={group} className="flex justify-between">
                                  <span>{getGroupName(group)}</span>
                                  <span>{amount} DT</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Yearly Charts */}
                <div className="mt-6">
                  {/* Yearly Spending Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Yearly Spending Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={yearlyData.monthlySpending}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              stroke="#8884d8"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yearly Savings Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Yearly Savings Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={yearlyData.monthlySavings}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              stroke="#82ca9d"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Challenge Report */}
          <TabsContent value="challenges">
            <h2 className="text-xl font-semibold mb-4">Challenge Progress</h2>
            <div className="flex justify-end">
              <div className="w-full max-w-3xl space-y-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <CardTitle>{challenge.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        Progress: {challenge.progress}%
                      </p>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={challenge.progressData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              stroke="#82ca9d"
                              strokeWidth={2}
                              name="Amount Saved"
                            />
                          </LineChart>
                        </ResponsiveContainer>
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