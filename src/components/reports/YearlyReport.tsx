"use client";

import { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { YearlyReport as YearlyReportType } from "@/types/reports";

interface GroupedData {
  groupName: string;
  amount: number;
}

interface YearlyReportProps {
  data: YearlyReportType;
  spendingViewMode: "detailed" | "grouped";
  savingViewMode: "detailed" | "grouped";
  setSpendingViewMode: (mode: "detailed" | "grouped") => void;
  setSavingViewMode: (mode: "detailed" | "grouped") => void;
  groupedCategories: GroupedData[];
  groupedSavings: GroupedData[];
}

interface MonthlyData {
  month: string;
  spent: number;
  saved: number;
}

export const YearlyReport: FC<YearlyReportProps> = ({
  data,
  spendingViewMode,
  savingViewMode,
  setSpendingViewMode,
  setSavingViewMode,
  groupedCategories,
  groupedSavings,
}) => {
  // Filter out Challenges from spending data
  const filteredCategories = data.categories.filter(
    category => !category.group?.name?.includes("Challenges")
  );
  
  const filteredGroupedCategories = groupedCategories.filter(
    group => group.groupName !== "Challenges"
  );

  // Transform savings data to make challenges positive
  const transformedSavingsData = data.savingsData.map(saving => ({
    ...saving,
    saved: saving.categoryName ? Math.abs(saving.saved) : saving.saved
  }));

  // Transform grouped savings to make challenges positive
  const transformedGroupedSavings = groupedSavings.map(group => ({
    ...group,
    amount: group.groupName === "Challenges" ? Math.abs(group.amount) : group.amount
  }));

  // Calculate totals
  const totalSpent = filteredCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalSaved = transformedSavingsData.reduce((sum, saving) => sum + saving.saved, 0);

  const getMonthlyChartData = (): MonthlyData[] => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Use the actual monthly data with one decimal place
    return months.map(month => ({
      month,
      spent: Number(totalSpent.toFixed(1)),
      saved: Number(totalSaved.toFixed(1))
    }));
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-semibold mb-4">Yearly Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#1a2a6c]">Yearly Spending</CardTitle>
            <div className="space-x-2">
              <Button
                variant={spendingViewMode === "detailed" ? "default" : "outline"}
                size="sm"
                onClick={() => setSpendingViewMode("detailed")}
                className={spendingViewMode === "detailed" ? "bg-[#1a2a6c] hover:bg-[#1a2a6c]/90" : "text-[#1a2a6c] border-[#1a2a6c] hover:bg-[#1a2a6c]/10"}
              >
                Detailed
              </Button>
              <Button
                variant={spendingViewMode === "grouped" ? "default" : "outline"}
                size="sm"
                onClick={() => setSpendingViewMode("grouped")}
                className={spendingViewMode === "grouped" ? "bg-[#1a2a6c] hover:bg-[#1a2a6c]/90" : "text-[#1a2a6c] border-[#1a2a6c] hover:bg-[#1a2a6c]/10"}
              >
                Grouped
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Total Spent: {totalSpent} DT</p>
            <div className="space-y-2 mt-4">
              {spendingViewMode === "detailed" ? (
                <>
                  <h3 className="text-md font-medium">Spending by Category</h3>
                  <ul className="space-y-1">
                    {filteredCategories.map((category) => (
                      <li key={category.id} className="flex justify-between text-[#1a2a6c]">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.spent} DT</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-md font-medium">Spending by Group</h3>
                  <ul className="space-y-1">
                    {filteredGroupedCategories.map((group) => (
                      <li key={group.groupName} className="flex justify-between text-[#1a2a6c]">
                        <span>{group.groupName}</span>
                        <span className="font-medium">{group.amount} DT</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#1a2a6c]">Yearly Savings</CardTitle>
            <div className="space-x-2">
              <Button
                variant={savingViewMode === "detailed" ? "default" : "outline"}
                size="sm"
                onClick={() => setSavingViewMode("detailed")}
                className={savingViewMode === "detailed" ? "bg-[#1a2a6c] hover:bg-[#1a2a6c]/90" : "text-[#1a2a6c] border-[#1a2a6c] hover:bg-[#1a2a6c]/10"}
              >
                Detailed
              </Button>
              <Button
                variant={savingViewMode === "grouped" ? "default" : "outline"}
                size="sm"
                onClick={() => setSavingViewMode("grouped")}
                className={savingViewMode === "grouped" ? "bg-[#1a2a6c] hover:bg-[#1a2a6c]/90" : "text-[#1a2a6c] border-[#1a2a6c] hover:bg-[#1a2a6c]/10"}
              >
                Grouped
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Total Saved: {totalSaved} DT</p>
            <div className="space-y-2 mt-4">
              {savingViewMode === "detailed" ? (
                <>
                  <h3 className="text-md font-medium">Savings by Category</h3>
                  <ul className="space-y-1">
                    {transformedSavingsData.map((saving) => (
                      <li key={saving.categoryName} className="flex justify-between text-[#1a2a6c]">
                        <span>{saving.categoryName}</span>
                        <span className="font-medium">{saving.saved} DT</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-md font-medium">Savings by Group</h3>
                  <ul className="space-y-1">
                    {transformedGroupedSavings.map((group) => (
                      <li key={group.groupName} className="flex justify-between text-[#1a2a6c]">
                        <span>{group.groupName}</span>
                        <span className="font-medium">{group.amount} DT</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly {spendingViewMode === "grouped" ? "Group" : "Category"} Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={spendingViewMode === "grouped" ? filteredGroupedCategories : filteredCategories}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={spendingViewMode === "grouped" ? "groupName" : "name"}
                    textAnchor="end"
                    tick={{ fill: '#1a2a6c' }}
                    height={70}
                  />
                  <YAxis
                  tick={{ fill: '#1a2a6c' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey={spendingViewMode === "grouped" ? "amount" : "spent"}
                    fill="#f17300"
                    name="Amount Spent"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Savings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly {savingViewMode === "grouped" ? "Group" : "Category"} Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={savingViewMode === "grouped" ? transformedGroupedSavings : transformedSavingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={savingViewMode === "grouped" ? "groupName" : "categoryName"}
                    tick={{ fill: '#1a2a6c' }}
                    textAnchor="end"
                    height={70}
                    angle={-45}

                  />
                  <YAxis                 
                  tick={{ fill: '#1a2a6c' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey={savingViewMode === "grouped" ? "amount" : "saved"}
                    fill="#99d98c"
                    name="Amount Saved"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getMonthlyChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#1a2a6c' }}
                    textAnchor="middle"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: '#1a2a6c' }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(1)}
                  />
                  <Legend />
                  <Bar
                    dataKey="spent"
                    fill="#f17300"
                    name="Amount Spent"
                  />
                  <Bar
                    dataKey="saved"
                    fill="#99d98c"
                    name="Amount Saved"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};