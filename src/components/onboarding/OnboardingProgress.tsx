// src/app/onboarding/components/OnboardingProgress.tsx
interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
  }
  
  export default function OnboardingProgress({
    currentStep,
    totalSteps,
  }: OnboardingProgressProps) {
    return (
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }