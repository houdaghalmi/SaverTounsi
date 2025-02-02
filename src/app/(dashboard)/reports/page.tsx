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

export default function ReportsPage() {
  const [spendingViewMode, setSpendingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [savingViewMode, setSavingViewMode] = useState<"detailed" | "grouped">("detailed");
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [challenges, setChallenges] = useState([]);

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

        const categoriesData = await categoriesResponse.json();
        const groupCategoriesData = await groupCategoriesResponse.json();
        const challengesData = await challengesResponse.json();

        const monthlyData = {
          spent: categoriesData.reduce((acc, category) => acc + category.amount, 0),
          saved: 0, // Calculate saved amount based on your logic
          categories: categoriesData,
          groupCategories: groupCategoriesData,
          savingsDetails: [], // Fetch savings details based on your logic
        };

        const yearlyData = {
          spent: categoriesData.reduce((acc, category) => acc + category.amount, 0),
          saved: 0, // Calculate saved amount based on your logic
          categories: categoriesData,
          groupCategories: groupCategoriesData,
          savingsDetails: [], // Fetch savings details based on your logic
          monthlySpending: [], // Fetch monthly spending based on your logic
          monthlySavings: [], // Fetch monthly savings based on your logic
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
  const groupSpendingCategories = (categories) => {
    return categories.reduce((acc, category) => {
      if (!acc[category.group]) {
        acc[category.group] = 0;
      }
      acc[category.group] += category.amount;
      return acc;
    }, {});
  };

  // Group savings details by source (if needed)
  const groupSavings = (savings) => {
    return savings.reduce((acc, saving) => {
      if (!acc[saving.source]) {
        acc[saving.source] = 0;
      }
      acc[saving.source] += saving.amount;
      return acc;
    }, {});
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
                                <li key={category.id} className="flex justify-between">
                                  <span>{category.name}</span>
                                </li>
                              ))
                            : monthlyData.groupCategories.map((group) => (
                                <li key={group.id} className="flex justify-between">
                                  <span>{group.name}</span>
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
                            ? monthlyData.categories.map((category) => (
                                <li key={category.id} className="flex justify-between">
                                  <span>{category.name}</span>
                                </li>
                              ))
                            : monthlyData.groupCategories.map((group) => (
                                <li key={group.id} className="flex justify-between">
                                  <span>{group.name}</span>
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
                                <li key={category.id} className="flex justify-between">
                                  <span>{category.name}</span>
                                </li>
                              ))
                            : yearlyData.groupCategories.map((group) => (
                                <li key={group.id} className="flex justify-between">
                                  <span>{group.name}</span>
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
                          {savingViewMode === "detailed" ? "Savings by Category" : "Savings by Group"}
                        </h3>
                        <ul className="space-y-1">
                          {savingViewMode === "detailed"
                            ? yearlyData.categories.map((category) => (
                                <li key={category.id} className="flex justify-between">
                                  <span>{category.name}</span>
                                </li>
                              ))
                            : yearlyData.groupCategories.map((group) => (
                                <li key={group.id} className="flex justify-between">
                                  <span>{group.name}</span>
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