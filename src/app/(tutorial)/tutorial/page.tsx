import { Metadata } from "next"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar, ChartBar, Flag, Wallet2, Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: "Tutorial | SaverTounsi"
}

export default function Tutorial() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent mb-2">
          How to Use SaverTounsi
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Follow these simple steps to make the most of your financial journey
        </p>

        {/* Tutorial Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Step 1: Sign In</h2>
            <p className="text-gray-600 mb-4">
              Create an account or sign in to access the Category Manager. Click the "Sign In" button to get started.
            </p>
            <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <video controls className="w-full rounded-lg h-80 object-cover">
                <source src="/videos/inscrit.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Step 2: Set Your Categories</h2>
            <p className="text-gray-600 mb-4">
              Go to the "Categorie Manager" section and set your budget. You can also create group to organize your expenses.
            </p>
            <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <video controls className="w-full rounded-lg h-80 object-cover">
                <source src="/videos/categories.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Step 3: Track Expenses</h2>
            <p className="text-gray-600 mb-4">
              Add your expenses in the "Transactions" section. The app will automatically calculate your remaining budget.
            </p>
            <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <video controls className="w-full rounded-lg h-80 object-cover">
                <source src="/videos/transaction.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Step 4: View Reports</h2>
            <p className="text-gray-600 mb-4">
              Check the "Reports" section to see detailed insights into your spending habits and budget performance.
            </p>
            <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <video controls className="w-full rounded-lg h-80 object-cover">
                <source src="/videos/report.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Step 5: Bon Plan */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Step 5: Explore Bon Plan</h2>
            <p className="text-gray-600 mb-4">
              Discover great deals and offers in the "Bon Plan" section. You can search for deals by category such as Food & Drink, Shopping, and Entertainment.
            </p>
            <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <video controls className="w-full rounded-lg h-80 object-cover">
                <source src="/videos/bonplan.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Step 6: Challenge */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Step 6: Participate in Challenges</h2>
            <p className="text-gray-600 mb-4">
              Join challenges in the "Challenge" section to save money and earn rewards. Track your progress and complete challenges to achieve your savings goals.
            </p>
            <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <video controls className="w-full rounded-lg h-80 object-cover">
                <source src="/videos/challenge.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Back to Overview Button */}
        <div className="mt-12 mb-8">
          <Link href="/overview">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-gray-50 border-gray-200 text-[#1a2a6c] hover:text-[#1a2a6c] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}