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
      <div className="flex items-center justify-between w-full mb-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex-1 flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${
                  index + 1 === currentStep
                    ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white shadow-lg scale-110"
                    : index + 1 < currentStep
                    ? "bg-[#1a2a6c] text-white"
                    : "bg-gray-100 text-gray-400"
                }
              `}
            >
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
            
            {index < totalSteps - 1 && (
              <div className="flex-1 h-[2px] mx-2">
                <div
                  className={`
                    h-full transition-all duration-500
                    ${
                      index + 1 < currentStep
                        ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f]"
                        : "bg-gray-200"
                    }
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Label */}
      <div className="text-center">
        <span className="text-sm font-medium bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}