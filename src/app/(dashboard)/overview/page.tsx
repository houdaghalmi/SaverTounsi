import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; // Import the Link component
import { DashboardData } from '@/types/dashboard'

export default async function OverviewPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  })
  
  const data: DashboardData = await res.json()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff] container mx-auto 0 pb-8">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Overview</h1>
        <p className="text-xl mb-8">Get a snapshot of your financial health.</p>
        <div className="space-x-4">
          <Link href="/logout">
            <Button variant="secondary" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#b21f1f] hover:text-white">
              log out
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
            {/* Total Budget */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#1a2a6c]">
                  {data.totalBudget} DT
                </p>
                <CardDescription className="text-[#1a2a6c]">
                  Your total monthly budget across all categories.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#1a2a6c]">{data.totalExpenses} DT</p>
                <CardDescription className="text-[#1a2a6c]">
                  Your total expenses for the current month.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Remaining Budget */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Remaining Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#1a2a6c]">{data.remainingBudget} DT</p>
                <CardDescription className="text-[#1a2a6c]">
                  The amount left in your budget for the month.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="w-full py-20 bg-[#fdbb2d]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a6c]">Progress Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Budget Progress */}
            <Card className="bg-[#ffffff]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Budget Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 mb-4">
                  <Image
                    src="/images/features/progress.png"
                    alt="Budget Progress"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardDescription className="text-[#1a2a6c]">
                  Track your budget usage and stay on target.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Savings Progress */}
            <Card className="bg-[#ffffff]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Savings Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 mb-4">
                  <Image
                    src="/images/features/monthsavingreport.png"
                    alt="Savings Progress"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardDescription className="text-[#1a2a6c]">
                  Monitor your savings goals and achievements.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}