import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyReport } from "@/types/reports";

interface SavingsCardProps {
  data: MonthlyReport;
  viewMode: "detailed" | "grouped";
  setViewMode: (mode: "detailed" | "grouped") => void;
  groupedData: any[];
}

export function SavingsCard({ data, viewMode, setViewMode, groupedData }: SavingsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#1a2a6c]">Monthly Savings</CardTitle>
        <div className="space-x-2">
          <Button
            variant={viewMode === "detailed" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("detailed")}
          >
            Detailed
          </Button>
          <Button
            variant={viewMode === "grouped" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grouped")}
          >
            Grouped
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">Total Saved: {data.saved} DT</p>
        <div className="space-y-2 mt-4">
          {viewMode === "detailed" ? (
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
                {groupedData.map((group) => (
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
  );
}