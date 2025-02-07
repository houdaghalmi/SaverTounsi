"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { DashboardData } from '@/types/dashboard';
import { useCallback, useEffect, useState } from "react";

interface FinancialCardProps {
  title: string;
  amount: number;
  description: string;
}

interface ProgressCardProps {
  title: string;
  imagePath: string;
  description: string;
}

const FinancialCard = ({ title, amount, description }: FinancialCardProps) => (
  <Card className="bg-[#fdbb2d]">
    <CardHeader>
      <CardTitle className="text-[#1a2a6c]">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-[#1a2a6c]">{amount} DT</p>
      <CardDescription className="text-[#1a2a6c]">{description}</CardDescription>
    </CardContent>
  </Card>
);

const ProgressCard = ({ title, imagePath, description }: ProgressCardProps) => (
  <Card className="bg-[#ffffff]">
    <CardHeader>
      <CardTitle className="text-[#1a2a6c]">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative h-40 mb-4">
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <CardDescription className="text-[#1a2a6c]">{description}</CardDescription>
    </CardContent>
  </Card>
);

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData>({
    totalBudget: 0,
    totalExpenses: 0,
    remainingBudget: 0,
    totalIncome: 0,
    categoryBreakdown: [],
    recentTransactions: []
  } as any);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setData(data);
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
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const financialCards = [
    {
      title: "Total Budget",
      amount: data.totalBudget,
      description: "Your total monthly budget across all categories."
    },
    {
      title: "Total Expenses",
      amount: data.totalExpenses,
      description: "Your total expenses for the current month."
    },
    {
      title: "Remaining Budget",
      amount: data.remainingBudget,
      description: "The amount left in your budget for the month."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff] container mx-auto pb-8">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Overview</h1>
        <p className="text-xl mb-8">Get a snapshot of your financial health.</p>
        <div className="space-x-4">
          <Link href="/logout">
            <Button variant="secondary" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#b21f1f] hover:text-white">
              Log out
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="text-black border-white hover:bg-[#fdbb2d] hover:text-[#1a2a6c]">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Financial Summary Section */}
      <section className="w-full py-20 bg-[#ffffff]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a6c]">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center">Loading...</div>
            ) : (
              financialCards.map((card, index) => (
                <FinancialCard key={index} {...card} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="w-full py-20 bg-[#fdbb2d]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a6c]">Progress Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProgressCard
              title="Budget Progress"
              imagePath="/images/features/progress.png"
              description="Track your budget usage and stay on target."
            />
            <ProgressCard
              title="Savings Progress"
              imagePath="/images/features/monthsavingreport.png"
              description="Monitor your savings goals and achievements."
            />
          </div>
        </div>
      </section>
    </div>
  );
}