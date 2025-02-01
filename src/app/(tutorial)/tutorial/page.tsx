'use client'; // Mark this as a Client Component

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Tutorial() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff]">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tutorial</h1>
        <p className="text-gray-600 mb-8">Learn how to use saverTounsi effectively.</p>

        {/* Tutorial Steps */}
        <div className="space-y-6 text-left max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 1: Sign In</h2>
            <p className="text-gray-600 mb-4">
              Create an account or sign in to access the Category Manager. Click the "Sign In" button to get started.
            </p>
            {/* Video for Step 1 */}
            <video controls className="w-full rounded-lg">
              <source src="/videos/inscrit.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 2: Set Your categories</h2>
            <p className="text-gray-600 mb-4">
              Go to the "Categorie Manager" section and set your budget. You can also create group to organize your expenses.
            </p>
            {/* Video for Step 2 */}
            <video controls className="w-full rounded-lg">
              <source src="/videos/categories.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 3: Track Expenses</h2>
            <p className="text-gray-600 mb-4">
              Add your expenses in the "Transactions" section. The app will automatically calculate your remaining budget.
            </p>
            {/* Video for Step 3 */}
            <video controls className="w-full rounded-lg">
              <source src="/videos/transaction.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Step 4 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 4: View Reports</h2>
            <p className="text-gray-600 mb-4">
              Check the "Reports" section to see detailed insights into your spending habits and budget performance.
            </p>
            {/* Video for Step 4 */}
            <video controls className="w-full rounded-lg">
              <source src="/videos/report.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Step 5: Bon Plan */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 5: Explore Bon Plan</h2>
            <p className="text-gray-600 mb-4">
              Discover great deals and offers in the "Bon Plan" section. You can search for deals by category such as Food & Drink, Shopping, and Entertainment.
            </p>
            {/* Video for Step 5 */}
            <video controls className="w-full rounded-lg">
              <source src="/videos/bonplan.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Step 6: Challenge */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 6: Participate in Challenges</h2>
            <p className="text-gray-600 mb-4">
              Join challenges in the "Challenge" section to save money and earn rewards. Track your progress and complete challenges to achieve your savings goals.
            </p>
            {/* Video for Step 6 */}
            <video controls className="w-full rounded-lg">
              <source src="/videos/challenge.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Back to Overview Button */}
        <div className="mt-8">
          <Link href="/overview">
            <Button variant="outline">Back to Overview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}