// src/components/challenges/progress-tracker.tsx
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Challenge Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {milestones.map((milestone, index) => {
          const progress = (milestone.current / milestone.target) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{milestone.title}</span>
                <span>
                  {milestone.current}/{milestone.target} {milestone.unit}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};