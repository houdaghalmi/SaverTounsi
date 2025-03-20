import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface SpendingChartProps {
  data: any;
  viewMode: "detailed" | "grouped";
  groupedData: any[];
}

export function SpendingChart({ data, viewMode, groupedData }: SpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={viewMode === "grouped" ? groupedData : data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}