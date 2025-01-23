"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyReportProps {
  savedMonthly: number;
  spentMonthly: number;
  savedYearly: number;
  spentYearly: number;
  categories: { name: string; amount: number }[];
}

export const MonthlyReport = ({
  savedMonthly,
  spentMonthly,
  savedYearly,
  spentYearly,
  categories,
}: MonthlyReportProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Économies mensuelles */}
        <div className="space-y-2">
          <p className="text-lg font-semibold">
            You saved {savedMonthly} DT in January.
          </p>
        </div>

        {/* Dépenses par catégorie */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Spending by Category</h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.name} className="flex justify-between">
                <span>{category.name}</span>
                <span>{category.amount} DT</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Résumé annuel */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Yearly Summary</h3>
          <div className="flex justify-between">
            <span>Total Saved</span>
            <span>{savedYearly} DT</span>
          </div>
          <div className="flex justify-between">
            <span>Total Spent</span>
            <span>{spentYearly} DT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};