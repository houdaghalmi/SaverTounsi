// src/app/onboarding/components/OnboardingButton.tsx
import { Button } from "@/components/ui/button";

interface OnboardingButtonProps {
  onClick: () => void;
  label: string;
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
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-blue-600 text-white hover:bg-blue-700 ${className}`}
    >
      {label}
    </Button>
  );
}