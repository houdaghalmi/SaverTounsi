import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface OnboardingButtonProps {
  onClick: () => void;
  label: ReactNode;  
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