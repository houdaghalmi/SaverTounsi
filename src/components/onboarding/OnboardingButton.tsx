// src/app/onboarding/components/OnboardingButton.tsx
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface OnboardingButtonProps {
  onClick: () => void;
  label: ReactNode;  // Changed from string to ReactNode
  disabled?: boolean;
  className?: string;
}

export default function OnboardingButton({
  onClick,
  label,
  disabled = false,
  className = "",
}: OnboardingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg text-white font-medium ${className}`}
    >
      {label}
    </button>
  );
}