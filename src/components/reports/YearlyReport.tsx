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

export const YearlyReport: FC<YearlyReportProps> = ({
  data,
  spendingViewMode,
  savingViewMode,
  setSpendingViewMode,
  setSavingViewMode,
  groupedCategories,
  groupedSavings,
}) => {
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
            <p className="text-lg font-semibold">Total Spent: {data.spent} DT</p>
            <div className="space-y-2 mt-4">
              {spendingViewMode === "detailed" ? (
                <>
                  <h3 className="text-md font-medium">Spending by Category</h3>
                  <ul className="space-y-1">
                    {data.categories.map((category) => (
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
                    {groupedCategories.map((group) => (
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
            <p className="text-lg font-semibold">Total Saved: {data.saved} DT</p>
            <div className="space-y-2 mt-4">
              {savingViewMode === "detailed" ? (
                <>
                  <h3 className="text-md font-medium">Savings by Category</h3>
                  <ul className="space-y-1">
                    {data.savingsData.map((saving) => (
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
                    {groupedSavings.map((group) => (
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
                  data={spendingViewMode === "grouped" ? groupedCategories : data.categories}
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
                  data={savingViewMode === "grouped" ? groupedSavings : data.savingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={savingViewMode === "grouped" ? "groupName" : "categoryName"}
                    tick={{ fill: '#1a2a6c' }}
                    textAnchor="end"
                    height={70}
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
      </div>
    </div>
  );
};