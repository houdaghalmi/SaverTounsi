"use client";
import { useRouter } from "next/navigation";
import OnboardingButton from "@/components/onboarding/OnboardingButton";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

interface OnboardingButtonProps {
  onClick: () => void;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function OnboardingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/onboarding/step1");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo or Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <Image
            src="/images/logo/logo2.png"
            alt="SaverTounsi Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
            Welcome to SaverTounsi!
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Let's get started by setting up your profile. It'll only take a few minutes.
          </p>
        </div>

        {/* Get Started Button with Animation */}
        <div className="mt-12 relative group">
          <OnboardingButton 
            onClick={handleGetStarted} 
            label={
              <span className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            }
            className="w-full bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] hover:shadow-lg 
                     hover:-translate-y-0.5 transition-all duration-200"
          />
          <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] 
                        blur-xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity" />
        </div>

        {/* Optional: Progress Indicator */}
        <div className="pt-8 flex justify-center gap-1">
          <div className="w-8 h-1 rounded-full bg-[#1a2a6c]" />
          <div className="w-8 h-1 rounded-full bg-gray-200" />
          <div className="w-8 h-1 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}