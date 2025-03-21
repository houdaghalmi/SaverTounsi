import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyReport } from "@/types/reports";

interface Category {
  name: string;
  id: string;
  saved?: number;  // Add saved property as optional
  spent?: number;  // Add spent property as optional
}

interface GroupData {
  groupName: string;
  amount: number;
  categories?: Category[];
}

interface SavingsCardProps {
  data: MonthlyReport;
  viewMode: "detailed" | "grouped";
  setViewMode: (mode: "detailed" | "grouped") => void;
  groupedData: GroupData[];
}

export function SavingsCard({ data, viewMode, setViewMode, groupedData }: SavingsCardProps) {
  // Get all categories from Challenges group
  const challengesGroup = groupedData.find(group => group.groupName === "Challenges");
  const challengeCategoryNames = challengesGroup?.categories?.map((cat: Category) => cat.name) || [];

  // Transform savings data to make all challenge categories positive
  const transformedSavingsData = data.savingsData.map(saving => ({
    ...saving,
    saved: challengeCategoryNames? Math.abs(saving.saved) : saving.saved
  }));

  // Transform grouped data to make Challenges group positive
  const transformedGroupedData = groupedData.map(group => 
    group.groupName === "Challenges" 
      ? { 
          ...group, 
          amount: Math.abs(group.amount),
          categories: group.categories?.map(cat => ({
            ...cat,
            saved: Math.abs(cat.saved || 0),
            spent: Math.abs(cat.spent || 0)
          }))
        }
      : group
  );

  // Calculate total saved using transformed values
  const totalSaved = transformedSavingsData.reduce((sum, saving) => sum + saving.saved, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#1a2a6c]">Monthly Savings</CardTitle>
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
        <p className="text-lg font-semibold">Total Saved: {totalSaved} DT</p>
        <div className="space-y-2 mt-4">
          {viewMode === "detailed" ? (
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
                {transformedGroupedData.map((group) => (
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