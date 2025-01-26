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
import { useState } from "react";

export default function ReportsPage() {
  const [spendingViewMode, setSpendingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [savingViewMode, setSavingViewMode] = useState<"detailed" | "grouped">("detailed");

  // Monthly Data
  const monthlyData = {
    saved: 40, // Monthly savings
    spent: 50, // Monthly spending
    categories: [
      { name: "Food", amount: 30, group: "Essentials" },
      { name: "Transport", amount: 10, group: "Essentials" },
      { name: "Health", amount: 0, group: "Essentials" },
      { name: "Entertainment", amount: 5, group: "Lifestyle" },
      { name: "Shopping", amount: 5, group: "Lifestyle" },
    ],
    savingsDetails: [
      { source: "Discounts", amount: 20 },
      { source: "Bon Plans", amount: 15 },
      { source: "Cashback", amount: 5 },
    ],
  };

  // Yearly Data
  const yearlyData = {
    saved: 480, // Yearly savings
    spent: 600, // Yearly spending
    categories: [
      { name: "Food", amount: 360, group: "Essentials" },
      { name: "Transport", amount: 120, group: "Essentials" },
      { name: "Health", amount: 0, group: "Essentials" },
      { name: "Entertainment", amount: 60, group: "Lifestyle" },
      { name: "Shopping", amount: 60, group: "Lifestyle" },
    ],
    savingsDetails: [
      { source: "Discounts", amount: 240 },
      { source: "Bon Plans", amount: 180 },
      { source: "Cashback", amount: 60 },
    ],
    monthlySpending: [
      { month: "Jan", amount: 50 },
      { month: "Feb", amount: 60 },
      { month: "Mar", amount: 55 },
      { month: "Apr", amount: 65 },
      { month: "May", amount: 70 },
      { month: "Jun", amount: 75 },
      { month: "Jul", amount: 80 },
      { month: "Aug", amount: 85 },
      { month: "Sep", amount: 90 },
      { month: "Oct", amount: 95 },
      { month: "Nov", amount: 100 },
      { month: "Dec", amount: 105 },
    ],
    monthlySavings: [
      { month: "Jan", amount: 40 },
      { month: "Feb", amount: 45 },
      { month: "Mar", amount: 50 },
      { month: "Apr", amount: 55 },
      { month: "May", amount: 60 },
      { month: "Jun", amount: 65 },
      { month: "Jul", amount: 70 },
      { month: "Aug", amount: 75 },
      { month: "Sep", amount: 80 },
      { month: "Oct", amount: 85 },
      { month: "Nov", amount: 90 },
      { month: "Dec", amount: 95 },
    ],
  };

  // Challenge Data
  const challenges = [
    {
      id: "1",
      title: "Collect 100 DT",
      description: "Save 100 DT to complete this challenge.",
      target: 100,
      current: 60,
      progress: 60, // Progress percentage
      status: "active",
      progressData: [
        { day: "Day 1", amount: 10 },
        { day: "Day 2", amount: 20 },
        { day: "Day 3", amount: 30 },
        { day: "Day 4", amount: 40 },
        { day: "Day 5", amount: 50 },
        { day: "Day 6", amount: 60 },
      ],
    },
    {
      id: "2",
      title: "Collect 50 DT",
      description: "Save 50 DT to complete this challenge.",
      target: 50,
      current: 50,
      progress: 100, // Progress percentage
      status: "completed",
      progressData: [
        { day: "Day 1", amount: 5 },
        { day: "Day 2", amount: 10 },
        { day: "Day 3", amount: 20 },
        { day: "Day 4", amount: 30 },
        { day: "Day 5", amount: 40 },
        { day: "Day 6", amount: 50 },
      ],
    },
    {
      id: "3",
      title: "Collect 500 DT",
      description: "Save 500 DT to complete this challenge.",
      target: 500,
      current: 0,
      progress: 0, // Progress percentage
      status: "upcoming",
      progressData: [],
    },
  ];

  // Format challenge data for the chart
  const challengeChartData = challenges.map((challenge) => ({
    name: challenge.title,
    progress: challenge.progress,
    fill: challenge.status === "active" ? "#82ca9d" : challenge.status === "completed" ? "#8884d8" : "#ccc",
  }));

  // Group spending categories by group
  const groupSpendingCategories = (categories: { name: string; amount: number; group: string }[]) => {
    return categories.reduce((acc, category) => {
      if (!acc[category.group]) {
        acc[category.group] = 0;
      }
      acc[category.group] += category.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  // Group savings details by source (if needed)
  const groupSavings = (savings: { source: string; amount: number }[]) => {
    return savings.reduce((acc, saving) => {
      if (!acc[saving.source]) {
        acc[saving.source] = 0;
      }
      acc[saving.source] += saving.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  const monthlyGroupedCategories = groupSpendingCategories(monthlyData.categories);
  const yearlyGroupedCategories = groupSpendingCategories(yearlyData.categories);

  const monthlyGroupedSavings = groupSavings(monthlyData.savingsDetails);
  const yearlyGroupedSavings = groupSavings(yearlyData.savingsDetails);

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
                                <li key={category.name} className="flex justify-between">
                                  <span>{category.name}</span>
                                  <span>{category.amount} DT</span>
                                </li>
                              ))
                            : Object.entries(monthlyGroupedCategories).map(([group, amount]) => (
                                <li key={group} className="flex justify-between">
                                  <span>{group}</span>
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
                          {savingViewMode === "detailed" ? "Savings by Source" : "Savings by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {savingViewMode === "detailed"
                            ? monthlyData.savingsDetails.map((saving) => (
                                <li key={saving.source} className="flex justify-between">
                                  <span>{saving.source}</span>
                                  <span>{saving.amount} DT</span>
                                </li>
                              ))
                            : Object.entries(monthlyGroupedSavings).map(([source, amount]) => (
                                <li key={source} className="flex justify-between">
                                  <span>{source}</span>
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
                            <Bar dataKey="amount" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Savings Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Monthly Savings by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData.savingsDetails}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="source" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#82ca9d" />
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
                                <li key={category.name} className="flex justify-between">
                                  <span>{category.name}</span>
                                  <span>{category.amount} DT</span>
                                </li>
                              ))
                            : Object.entries(yearlyGroupedCategories).map(([group, amount]) => (
                                <li key={group} className="flex justify-between">
                                  <span>{group}</span>
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
                      <p className="text-lg font-semibold ">
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
                          {savingViewMode === "detailed" ? "Savings by Source" : "Savings by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {savingViewMode === "detailed"
                            ? yearlyData.savingsDetails.map((saving) => (
                                <li key={saving.source} className="flex justify-between">
                                  <span>{saving.source}</span>
                                  <span>{saving.amount} DT</span>
                                </li>
                              ))
                            : Object.entries(yearlyGroupedSavings).map(([source, amount]) => (
                                <li key={source} className="flex justify-between">
                                  <span>{source}</span>
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
          <TabsContent value="challenges" >
            <h2 className="text-xl font-semibold mb-4 ">Challenge Progress</h2>
            <div className="flex justify-end ">
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
                      <div className="h-64 mt-4">
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