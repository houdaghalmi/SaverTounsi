// app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; // Import the Link component

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff]">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to SaverTounsi</h1>
        <p className="text-xl mb-8">Manage better, live better.</p>
        <div className="space-x-4">
          {/* Sign Up Button with Link to Signup Page */}
          <Link href="/signup">
            <Button variant="secondary" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#b21f1f] hover:text-white">
              Sign Up
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

      {/* Features Section */}
      <section className="w-full py-20 bg-[#ffffff]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a6c]">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Budget Manager */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Budget Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 mb-4">
                  <Image
                    src="/images/features/manager.png"
                    alt="Budget Manager"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardDescription className="text-[#1a2a6c]">
                  Easily create and manage budgets to track your spending.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Reports */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 mb-4">
                  <Image
                    src="/images/features/report.png"
                    alt="Reports"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardDescription className="text-[#1a2a6c]">
                  Generate detailed reports to analyze your financial health.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Bon Plans */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Bon Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 mb-4">
                  <Image
                    src="/images/features/bon plan.png"
                    alt="Bon Plans"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardDescription className="text-[#1a2a6c]">
                  Discover exclusive deals and discounts to save money.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Challenges */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 mb-4">
                  <Image
                    src="/images/features/challenge.png"
                    alt="Challenges"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <CardDescription className="text-[#1a2a6c]">
                  Participate in challenges to improve your financial habits.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 bg-[#ffffff]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a6c]">See What Others Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">user</CardTitle>
                <CardDescription className="text-[#1a2a6c]">january,2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a2a6c]">
                  SaverTounsi is a user-friendly budgeting tool that helps students and employees track their expenses effectively. The financial insights provided are clear and practical.
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">user</CardTitle>
                <CardDescription className="text-[#1a2a6c]">january,2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a2a6c]">
                  Great platform with useful features like budgeting, expense tracking, and motivating challenges. It could benefit from more customization options.
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-[#fdbb2d]">
              <CardHeader>
                <CardTitle className="text-[#1a2a6c]">user </CardTitle>
                <CardDescription className="text-[#1a2a6c]">january,2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a2a6c]">
                  The visual reports and categorized spending make it easy to understand financial habits. Adding smart notifications could enhance the experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 bg-[#1a2a6c] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Unlock Premium Features</h2>
          <div className="flex justify-center">
            {/* Premium Plan Card */}
            <Card className="bg-[#ffffff] border border-[#fdbb2d] shadow-sm w-full max-w-md">
              <CardHeader className="p-4">
                <CardTitle className="text-[#1a2a6c] text-xl">Premium Plan</CardTitle>
                <CardDescription className="text-[#1a2a6c]">10dt/day</CardDescription>
                <CardDescription className="text-[#1a2a6c]">40dt/month</CardDescription>

              </CardHeader>
              <CardContent className="p-4">
                <ul className="text-[#1a2a6c] space-y-2">
                  <li>Scan receipts</li>
                  <li>Service Payments</li>
                  <li>Collaborative Budgeting</li>
                </ul>
                <Button variant="secondary" className="bg-[#1a2a6c] text-[#ffffff] hover:bg-[#b21f1f] mt-4 w-full">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}