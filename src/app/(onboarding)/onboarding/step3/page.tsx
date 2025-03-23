// src/app/onboarding/step3/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import OnboardingButton from "@/components/onboarding/OnboardingButton";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Wallet, Car, Heart, HelpCircle } from "lucide-react";

export default function Step3() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const choices = [
    { id: "Reserve", label: "Reserve", icon: Wallet },
    { id: "New Car", label: "New Car", icon: Car },
    { id: "Wedding", label: "Wedding", icon: Heart },
    { id: "I don't relate to any of these", label: "Other", icon: HelpCircle },
  ];

  const handleChoiceClick = (choice: string) => {
    setSelectedChoices(prev => 
      prev.includes(choice)
        ? prev.filter(item => item !== choice)
        : [...prev, choice]
    );
  };

  const handleContinue = () => {
    if (selectedChoices.length > 0) {
      console.log("Selected:", selectedChoices);
      router.push("/onboarding/step4");
    } else {
      toast({
        title: "Selection Required",
        description: "Please select at least one option to continue.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={4}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
            Are you saving for any of these?
          </h2>
          <p className="text-gray-600">Select your savings goals</p>
        </div>

        <div className="flex flex-col space-y-4 w-full max-w-md">
          {choices.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              onClick={() => handleChoiceClick(id)}
              className={`
                group flex items-center gap-4 p-4 rounded-lg cursor-pointer
                border-2 transition-all duration-200
                ${selectedChoices.includes(id)
                  ? "border-[#1a2a6c] bg-[#1a2a6c]/5"
                  : "border-gray-200 hover:border-[#1a2a6c]/30 hover:bg-gray-50"
                }
              `}
            >
              <div className={`
                p-2 rounded-lg transition-colors
                ${selectedChoices.includes(id)
                  ? "bg-[#1a2a6c] text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-[#1a2a6c]/10"
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <p className={`
                font-medium transition-colors
                ${selectedChoices.includes(id)
                  ? "text-[#1a2a6c]"
                  : "text-gray-700"
                }
              `}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center w-full">
          <OnboardingButton
            onClick={handleContinue}
            label="Continue"
            disabled={selectedChoices.length === 0}
            className="mt-8 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] 
                      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
                      w-full max-w-md"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
}