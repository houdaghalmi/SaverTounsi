import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MonthlyReport } from "@/types/reports";

interface Category {
  name: string;
  id: string;
  saved?: number;
  spent?: number;
}

interface GroupData {
  groupName: string;
  amount: number;
  categories?: Category[];
}

interface SavingsChartProps {
  data: MonthlyReport;
  viewMode: "detailed" | "grouped";
  groupedData: GroupData[];
}

export function SavingsChart({ data, viewMode, groupedData }: SavingsChartProps) {
  // Get all categories from Challenges group
  const challengesGroup = groupedData.find(group => group.groupName === "Challenges");
  const challengeCategoryNames = challengesGroup?.categories?.map((cat: Category) => cat.name) || [];

  const transformedSavingsData = data.savingsData.map(saving => ({
    name: saving.categoryName,
    saved: challengeCategoryNames? Math.abs(saving.saved) : saving.saved
  }));

  const transformedGroupedData = groupedData.map(group => ({
    name: group.groupName,
    saved: group.groupName === "Challenges" 
      ? Math.abs(group.amount) 
      : group.amount
  }));

  // Use transformed data for chart
  const chartData = viewMode === "grouped" 
    ? transformedGroupedData 
    : transformedSavingsData;

  return (
    <Card className="mt-8 ">
      <CardHeader>
        <CardTitle>Monthly Savings {viewMode === "grouped" ? "by Group" : "by Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                textAnchor="end"
                tick={{ fill: '#1a2a6c' }}
                height={70}
                angle={-45}

              />
              <YAxis 
                tick={{ fill: '#1a2a6c' }}
               />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="saved"
                fill="#99d98c"
                name="Saved Amount"
               
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}