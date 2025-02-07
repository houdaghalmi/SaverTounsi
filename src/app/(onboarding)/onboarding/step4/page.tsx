// src/app/onboarding/step4/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingButton from "@/components/onboarding/OnboardingButton";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function Step4() {
  const router = useRouter();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const choices = [
    "I'm in",
    "I'm not sure right now, but I'll think about it",
    "I'm interested, but I'd need more details first",
  ];

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
  };

  const handleFinish = async () => {
    if (selectedChoice) {
      console.log("Selected:", selectedChoice);
      await fetch('/api/onboarding', {
        method:"POST"
      }).then(d=>router.push("/overview")); // Redirect to the dashboard after onboarding
    } else {
      alert("Please select an option.");
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={4}>
      <h2 className="text-2xl font-bold text-center mb-4">Would you like to participate in challenges?</h2>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        {choices.map((choice) => (
          <div
            key={choice}
            onClick={() => handleChoiceClick(choice)}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedChoice === choice
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-center">{choice}</p>
          </div>
        ))}
      </div>
      <OnboardingButton
        onClick={handleFinish}
        label="Finish"
        disabled={!selectedChoice}
        className="mt-8"
      />
    </OnboardingLayout>
  );
}