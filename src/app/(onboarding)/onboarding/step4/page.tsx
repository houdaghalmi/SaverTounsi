// src/app/onboarding/step4/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import OnboardingButton from "@/components/onboarding/OnboardingButton";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Trophy, Clock, HelpCircle } from "lucide-react";

export default function Step4() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const choices = [
    { id: "I'm in", label: "I'm in", icon: Trophy, description: "Let's start saving and winning together!" },
    { id: "I'm not sure", label: "I'm not sure right now", icon: Clock, description: "Take your time to think about it" },
    { id: "Need info", label: "I need more details", icon: HelpCircle, description: "Learn more about our challenges" },
  ];

  const handleChoiceClick = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };

  const handleFinish = async () => {
    if (selectedChoice) {
      try {
        await fetch('/api/onboarding', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengePreference: selectedChoice })
        });
        router.push("/overview");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save your preferences. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Selection Required",
        description: "Please select an option to continue.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={4}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
            Ready for Savings Challenges?
          </h2>
          <p className="text-gray-600">
            Join challenges to reach your savings goals faster
          </p>
        </div>

        <div className="flex flex-col space-y-4 w-full max-w-md">
          {choices.map(({ id, label, icon: Icon, description }) => (
            <div
              key={id}
              onClick={() => handleChoiceClick(id)}
              className={`
                group flex items-center gap-4 p-4 rounded-lg cursor-pointer
                border-2 transition-all duration-200
                ${selectedChoice === id
                  ? "border-[#1a2a6c] bg-[#1a2a6c]/5"
                  : "border-gray-200 hover:border-[#1a2a6c]/30 hover:bg-gray-50"
                }
              `}
            >
              <div className={`
                p-2 rounded-lg transition-colors
                ${selectedChoice === id
                  ? "bg-[#1a2a6c] text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-[#1a2a6c]/10"
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <p className={`
                  font-medium transition-colors
                  ${selectedChoice === id
                    ? "text-[#1a2a6c]"
                    : "text-gray-700"
                  }
                `}>
                  {label}
                </p>
                <span className="text-sm text-gray-500">{description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center w-full">
          <OnboardingButton
            onClick={handleFinish}
            label="Get Started"
            disabled={!selectedChoice}
            className="mt-8 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] 
                      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
                      w-full max-w-md"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
}