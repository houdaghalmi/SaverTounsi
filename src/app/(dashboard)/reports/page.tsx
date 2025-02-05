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

// Updated interfaces to match schema
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

export default function ReportsPage() {
  const [spendingViewMode, setSpendingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [savingViewMode, setSavingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [monthlyData, setMonthlyData] = useState<MonthlyReport | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyReport | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, challengesResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/challenges"),
        ]);

        if (!categoriesResponse.ok || !challengesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData: Category[] = await categoriesResponse.json();
        const challengesData: Challenge[] = await challengesResponse.json();

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

  // Group savings by category group
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

  const monthlyGroupedCategories = groupSpendingCategories(monthlyData.categories);
  const yearlyGroupedCategories = groupSpendingCategories(yearlyData.categories);

  const monthlyGroupedSavings = groupSavings(monthlyData.categories);
  const yearlyGroupedSavings = groupSavings(yearlyData.categories);

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
                            : monthlyGroupedCategories.map((group) => (
                                <li key={group.groupName} className="flex justify-between">
                                  <span>{group.groupName}</span>
                                  <span>{group.amount} DT</span>
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
                            : monthlyGroupedSavings.map((group) => (
                                <li key={group.groupName} className="flex justify-between">
                                  <span>{group.groupName}</span>
                                  <span>{group.amount} DT</span>
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
                            : yearlyGroupedCategories.map((group) => (
                                <li key={group.groupName} className="flex justify-between">
                                  <span>{group.groupName}</span>
                                  <span>{group.amount} DT</span>
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
                            : yearlyGroupedSavings.map((group) => (
                                <li key={group.groupName} className="flex justify-between">
                                  <span>{group.groupName}</span>
                                  <span>{group.amount} DT</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Yearly Spending Trend */}
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
                              <XAxis 
                                dataKey="month"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                              />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#8884d8"
                                strokeWidth={2}
                                name="Monthly Spending"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Yearly Savings Trend */}
                    <Card>
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
                              <XAxis 
                                dataKey="month"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                              />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#82ca9d"
                                strokeWidth={2}
                                name="Monthly Savings"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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