import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyReport } from "@/types/reports";

interface SpendingCardProps {
  data: MonthlyReport;
  viewMode: "detailed" | "grouped";
  setViewMode: (mode: "detailed" | "grouped") => void;
  groupedData: any[];
}

export function SpendingCard({ data, viewMode, setViewMode, groupedData }: SpendingCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#1a2a6c]">Monthly Spending</CardTitle>
        <div className="space-x-2">
          <Button
            variant={viewMode === "detailed" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("detailed")}
            className={viewMode === "detailed" ? "bg-[#1a2a6c] hover:bg-[#1a2a6c]/90" : "text-[#1a2a6c] border-[#1a2a6c] hover:bg-[#1a2a6c]/10"}
          >
            Detailed
          </Button>
          <Button
            variant={viewMode === "grouped" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grouped")}
            className={viewMode === "grouped" ? "bg-[#1a2a6c] hover:bg-[#1a2a6c]/90" : "text-[#1a2a6c] border-[#1a2a6c] hover:bg-[#1a2a6c]/10"}
          >
            Grouped
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">Total Spent: {data.spent} DT</p>
        <div className="space-y-2 mt-4">
          {viewMode === "detailed" ? (
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