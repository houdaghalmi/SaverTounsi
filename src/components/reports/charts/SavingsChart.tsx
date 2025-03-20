import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MonthlyReport } from "@/types/reports";

interface SavingsChartProps {
  data: MonthlyReport;
  viewMode: "detailed" | "grouped";
  groupedData: any[];
}

export function SavingsChart({ data, viewMode, groupedData }: SavingsChartProps) {
  const chartData = viewMode === "grouped"
    ? groupedData.map(group => ({
        name: group.groupName,
        saved: group.amount
      }))
    : data.savingsData.map(saving => ({
        name: saving.categoryName,
        saved: saving.saved
      }));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Monthly Savings {viewMode === "grouped" ? "by Group" : "by Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="saved"
                fill="#82ca9d"
                name="Saved Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}