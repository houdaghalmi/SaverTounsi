"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Transaction } from "@prisma/client";


interface CategoryData {
  id: string;
  name: string;
  budget: number;
  spent: number;
  groupId: string;
  group: {
    id: string;
    name: string;
  };
}

interface DashboardData {
  categories: CategoryData[];
  transactions: Transaction[];
  totalBudget: number;
  totalExpenses: number;
  monthlySummary: {
    month: string;
    spending: number;
    saving: number;
  }[];
}

interface TransactionWithCategory extends Transaction {
  category?: {
    id: string;
    name: string;
  } | null;
}

// Loading Card Component
const LoadingCard = () => (
  <Card className="bg-[#fdbb2d]/50">
    <CardHeader>
      <Skeleton className="h-4 w-[150px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[100px] mb-2" />
      <Skeleton className="h-4 w-[200px]" />
    </CardContent>
  </Card>
);

// Financial Card with Progress
const FinancialCard = ({ title, current, total, description }: {
  title: string;
  current: number;
  total: number;
  description: string;
}) => (
  <Card className="bg-[#fdbb2d]/50 hover:bg-[#fdbb2d]/60 transition-all">
    <CardHeader>
      <CardTitle className="text-[#1a2a6c]">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-[#1a2a6c]">{current.toFixed(2)} DT</p>
      <CardDescription className="text-[#1a2a6c] mt-2">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

// Transaction List Component
const TransactionList = ({ transactions }: { transactions: TransactionWithCategory[] }) => (
  <div className="space-y-4">
    {transactions.map((transaction) => (
      <Card key={transaction.id} className="bg-white hover:shadow-md transition-all">
        <CardContent className="flex justify-between items-center p-4">
          <div>
            <p className="font-semibold">
            {transaction.category?.name || 'Uncategorized'}
            </p>
            <p className="text-sm text-muted-foreground">
            {transaction.description || 'No Description'}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <p className={`font-bold ${
            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'INCOME' ? '+' : '-'}{transaction.amount.toFixed(2)} DT
          </p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const transactionsResponse = await fetch('/api/transactions');
      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const transactions: Transaction[] = await transactionsResponse.json();

      // Calculate total income and expenses
      const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((acc, t) => acc + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => acc + t.amount, 0);

      // Calculate actual savings (income - expenses)
      const totalSavings = totalIncome - totalExpenses;

      // Calculate monthly summary
      const monthlySummary = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        
        const monthTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === date.getMonth() && 
                 tDate.getFullYear() === date.getFullYear();
        });

        const monthlyIncome = monthTransactions
          .filter(t => t.type === 'INCOME')
          .reduce((acc, t) => acc + t.amount, 0);

        const monthlyExpenses = monthTransactions
          .filter(t => t.type === 'EXPENSE')
          .reduce((acc, t) => acc + t.amount, 0);

        return {
          month,
          spending: monthlyExpenses,
          saving: monthlyIncome - monthlyExpenses // Calculate monthly savings
        };
      }).reverse();

      setData({
        transactions,
        totalBudget: totalSavings, // Update this to use actual savings
        totalExpenses,
        monthlySummary,
        categories: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-red-50">
          <CardTitle className="text-red-600 mb-2">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Financial Overview</h1>
          <p className="text-xl opacity-90">
            {new Date().toLocaleDateString('en-US', { 
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <LoadingCard />
              <LoadingCard />
            </>
          ) : data && (
            <>
              <FinancialCard
                title="Total Savings"
                current={data.totalBudget}
                total={data.totalBudget}
                description=""
              />
              <FinancialCard
                title="Total Spending"
                current={data.totalExpenses}
                total={data.totalBudget}
                description=""
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        {!isLoading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Trend */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlySummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="spending"
                      stroke="#1a2a6c"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList transactions={data.transactions.slice(0, 5)} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}