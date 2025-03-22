import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  milestones: {
    title: string;
    target: number;
    current: number;
    unit: string;
    isCompleted: boolean;
  }[];
}

export const ProgressTracker = ({ milestones }: ProgressTrackerProps) => {
  return (
    <Card className="border-gray-100 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1a2a6c]/10">
            <Trophy className="w-5 h-5 text-[#1a2a6c]" />
          </div>
          <span className="bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
            Challenge Progress
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {milestones.map((milestone, index) => {
          const current = isNaN(milestone.current) ? 0 : milestone.current;
          const target = isNaN(milestone.target) ? 0 : milestone.target;
          const progress = (current / target) * 100 || 0;
          const isCompleted = progress >= 100;

          return (
            <div key={index} className="relative space-y-3 p-3 rounded-lg transition-colors hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {milestone.title}
                  </span>
                </div>
                <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-[#1a2a6c]/10 text-[#1a2a6c]">
                  {current.toLocaleString()}/{target.toLocaleString()} {milestone.unit}
                </span>
              </div>
              
              <div className="relative h-2 rounded-full bg-[#1a2a6c]/10 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#1a2a6c] transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        
        {milestones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No active challenges</p>
            <p className="text-sm text-gray-400">Join a challenge to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};