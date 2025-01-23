// src/components/budget/budget-chart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/currency"

interface BudgetChartProps {
  amount: number
  spent: number
}

export function BudgetChart({ amount, spent }: BudgetChartProps) {
  const remaining = Math.max(amount - spent, 0)
  const isOverBudget = spent > amount
  const overBudget = isOverBudget ? spent - amount : 0

  const data = isOverBudget
    ? [
        { name: "Spent (Over)", value: amount },
        { name: "Over Budget", value: overBudget },
      ]
    : [
        { name: "Spent", value: spent },
        { name: "Remaining", value: remaining },
      ]

  const COLORS = isOverBudget
    ? ['#ef4444', '#b91c1c']  // Red shades for over budget
    : ['#22c55e', '#86efac']  // Green shades for under budget

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </p>
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(isOverBudget ? overBudget : remaining)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}