"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Challenge } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  completedChallenge: any;
  recommendedChallenge: Challenge | null;
}

export function ChallengeCompletionModal({
  isOpen,
  onClose,
  completedChallenge,
  recommendedChallenge,
}: Props) {
  const router = useRouter();

  const handleStartNewChallenge = () => {
    if (recommendedChallenge) {
      router.push(`/challenges/${recommendedChallenge.id}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>🎉 Challenge Completed!</DialogTitle>
          <DialogDescription>
            Congratulations! You've completed the {completedChallenge?.challenge?.title} challenge!
          </DialogDescription>
        </DialogHeader>
        
        {recommendedChallenge && (
          <div className="mt-4">
            <h4 className="font-semibold">Ready for your next challenge?</h4>
            <div className="mt-2 p-4 border rounded-lg">
              <h5 className="font-medium">{recommendedChallenge.title}</h5>
              <p className="text-sm text-gray-500 mt-1">{recommendedChallenge.description}</p>
              <Button 
                className="mt-4 w-full"
                onClick={handleStartNewChallenge}
              >
                Start New Challenge
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
