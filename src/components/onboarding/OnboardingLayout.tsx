import { ReactNode } from "react";
import OnboardingProgress from "./OnboardingProgress";
import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-50 p-4">
   
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl 
                    shadow-lg border border-gray-100/50 p-6">
        {children}
      </div>

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#1a2a6c_1px,transparent_1px)] 
                    opacity-5 [background-size:16px_16px]" />
    </div>
  );
}