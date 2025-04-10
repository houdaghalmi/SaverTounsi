"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MonthlyReport as MonthlyReportType } from "@/types/reports";
import { SpendingCard } from "./cards/SpendingCard";
import { SavingsCard } from "./cards/SavingsCard";
import { SpendingChart } from "./charts/SpendingChart";
import { SavingsChart } from "./charts/SavingsChart"; 

interface MonthlyReportProps {
  data: MonthlyReportType;
  spendingViewMode: "detailed" | "grouped";
  savingViewMode: "detailed" | "grouped";
  setSpendingViewMode: (mode: "detailed" | "grouped") => void;
  setSavingViewMode: (mode: "detailed" | "grouped") => void;
  groupedCategories: any[];
  groupedSavings: any[];
}

export function MonthlyReport({
  data,
  spendingViewMode,
  savingViewMode,
  setSpendingViewMode,
  setSavingViewMode,
  groupedCategories,
  groupedSavings,
}: MonthlyReportProps) {
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-semibold mb-4">Monthly Report</h2>
      <div className="flex w-full justify-start">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpendingCard 
              data={data}
              viewMode={spendingViewMode}
              setViewMode={setSpendingViewMode}
              groupedData={groupedCategories}
            />
            <SavingsCard 
              data={data}
              viewMode={savingViewMode}
              setViewMode={setSavingViewMode}
              groupedData={groupedSavings}
            />
          </div>
          <div className="mt-6">
            <SpendingChart 
              data={data}
              viewMode={spendingViewMode}
              groupedData={groupedCategories}
            />
            <SavingsChart 
              data={data}
              viewMode={savingViewMode}
              groupedData={groupedSavings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}