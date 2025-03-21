import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserChallenge, ProgressPoint } from "@/types/reports";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChallengeCardProps {
  userChallenge: UserChallenge;
  progressHistory: ProgressPoint[];
}

export function ChallengeCard({ 
  userChallenge, 
  progressHistory 
}: ChallengeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#1a2a6c] text-xl font-bold">
          
           {userChallenge.challenge.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{userChallenge.challenge.description}</p>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Current Progress: {userChallenge.progress} DT</span>
          </div>

          {progressHistory && progressHistory.length > 0 && (
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressHistory}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day"   tick={{ fill: '#1a2a6c' }}/>
                  <YAxis tick={{ fill: '#1a2a6c' }}/>
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#99d98c"
                    name="Progress"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}