"use client";
import { useRouter } from "next/navigation";
import OnboardingButton from "@/components/onboarding/OnboardingButton";

export default function OnboardingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/onboarding/step1");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to SaverTounsi!</h1>
      <p className="text-gray-600 text-center mb-8">
        Let’s get started by setting up your profile. It’ll only take a few minutes.
      </p>
      <OnboardingButton onClick={handleGetStarted} label="Get Started" />
    </div>
  );
}