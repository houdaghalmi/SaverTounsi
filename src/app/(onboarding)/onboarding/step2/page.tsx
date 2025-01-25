// src/app/onboarding/step2/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingButton from "@/components/onboarding/OnboardingButton";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function Step2() {
  const router = useRouter();
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]); // Array of selected choices

  const choices = ["Internet", "Supermarket", "Clothing", "Gym Memberships", "I don’t relate to any of these"];

  const handleChoiceClick = (choice: string) => {
    if (selectedChoices.includes(choice)) {
      // If the choice is already selected, remove it
      setSelectedChoices(selectedChoices.filter((item) => item !== choice));
    } else {
      // If the choice is not selected, add it
      setSelectedChoices([...selectedChoices, choice]);
    }
  };

  const handleContinue = () => {
    if (selectedChoices.length > 0) {
      console.log("Selected:", selectedChoices);
      router.push("/onboarding/step3"); // Redirect to Step 3
    } else {
      alert("Please select at least one option.");
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={4}>
      <h2 className="text-2xl font-bold text-center mb-4">What do you usually spend on?</h2>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        {choices.map((choice) => (
          <div
            key={choice}
            onClick={() => handleChoiceClick(choice)}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedChoices.includes(choice)
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-center">{choice}</p>
          </div>
        ))}
      </div>
      <OnboardingButton
        onClick={handleContinue}
        label="Continue"
        disabled={selectedChoices.length === 0}
        className="mt-8"
      />
    </OnboardingLayout>
  );
}