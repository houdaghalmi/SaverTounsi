// app/about/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; // Import the Link component

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff]">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white text-center">
        <h1 className="text-5xl font-bold mb-4">About SaverTounsi</h1>
        <p className="text-xl mb-8">Simplifying Budgeting for a Brighter Financial Future</p>
        <div className="space-x-4">
          {/* Get Started Button with Link to Signup Page */}
          <Link href="/signup">
            <Button variant="secondary" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#b21f1f] hover:text-white">
              Get Started
            </Button>
          </Link>
          {/* Learn More Button with Link to About Page */}
          <Link href="/about">
            <Button variant="outline" className="text-white border-white hover:bg-[#fdbb2d] hover:text-[#1a2a6c]">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* About Content Section */}
      <section className="w-full py-20 bg-[#ffffff]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-[#1a2a6c]">What is SaverTounsi?</h2>
            <p className="text-lg text-[#1a2a6c] mb-8">
              SaverTounsi is a budgeting tool that makes managing finances easy and accessible, especially for students and employees. By allowing users to categorize their expenses and set a budget for each category, it gives a comprehensive view of where money is being spent. The use of graphs enables users to track their progress visually, making it easier to stay on target. One of the best features is the challenge aspect, which encourages users to challenge themselves financially and promotes advancement. Overall, SaverTounsi simplifies budgeting and makes it enjoyable, while also inspiring users to take control of their financial future.
            </p>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="w-full py-20 bg-[#fdbb2d]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a6c]">Why Choose SaverTounsi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Budgeting Made Easy */}
            <Card className="bg-[#ffffff]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Budgeting Made Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#1a2a6c]">
                  Categorize expenses, set budgets, and track spending effortlessly with intuitive tools.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2: Visual Progress Tracking */}
            <Card className="bg-[#ffffff]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Visual Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#1a2a6c]">
                  Use graphs and charts to visualize your financial progress and stay on target.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3: Financial Challenges */}
            <Card className="bg-[#ffffff]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Financial Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#1a2a6c]">
                  Participate in challenges to improve your financial habits and achieve your goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 bg-[#1a2a6c] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl mb-8">Join SaverTounsi today and start your journey toward financial freedom.</p>
          {/* Sign Up Now Button with Link to Signup Page */}
          <Link href="/signup">
            <Button variant="secondary" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#b21f1f] hover:text-white">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}