import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { MonthlyReport, GroupedData } from "@/types/reports";

interface SpendingChartProps {
  data: MonthlyReport;
  viewMode: "detailed" | "grouped";
  groupedData: GroupedData[];
}

export function SpendingChart({ data, viewMode, groupedData }: SpendingChartProps) {
  const chartData = viewMode === "grouped"
    ? groupedData.map(group => ({
        name: group.groupName,
        spent: group.amount
      }))
    : data.categories.map(category => ({
        name: category.name,
        spent: category.spent
      }));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Monthly Spending {viewMode === "grouped" ? "by Group" : "by Category"}</CardTitle>
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
                bottom: 70
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                textAnchor="end"
                height={70}
                tick={{ fill: '#1a2a6c' }}
              />
              <YAxis 
                tick={{ fill: '#1a2a6c' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #1a2a6c',
                  borderRadius: '4px'
                }}
              />
              <Legend />
              <Bar
                dataKey="spent"
                fill="#f17300"
                name="Amount Spent"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}