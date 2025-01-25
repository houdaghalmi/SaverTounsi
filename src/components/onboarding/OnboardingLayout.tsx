// src/app/onboarding/components/OnboardingLayout.tsx
import { ReactNode } from "react";
import OnboardingProgress from "./OnboardingProgress";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}