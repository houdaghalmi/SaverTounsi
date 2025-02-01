"use client";
import React from "react";
export default function HelpPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Help</h1>
      <div className="space-y-4">
        {/* Feedback Section */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Feedback</h2>
          <p className="text-gray-600">
            Share your feedback with us to help improve our services.
          </p>
          <a
            href="/feedback"
            className="mt-2 inline-block text-blue-500 hover:underline"
          >
            Go to Feedback →
          </a>
        </div>

        {/* Support Section */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Support</h2>
          <p className="text-gray-600">
            Contact our support team for assistance with any issues.
          </p>
          <a
            href="/support"
            className="mt-2 inline-block text-blue-500 hover:underline"
          >
            Go to Support →
          </a>
        </div>
      </div>
    </div>
  );
}