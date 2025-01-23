export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: ChallengeType;
    difficulty: 'easy' | 'medium' | 'hard';
    reward: {
      type: 'points' | 'badge' | 'cashback';
      value: number;
      description: string;
    };
    startDate: Date;
    endDate: Date;
    participants: number;
    milestones: ChallengeMilestone[];
    rules: string[];
    status: 'upcoming' | 'active' | 'completed';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ChallengeMilestone {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    reward?: {
      type: 'points' | 'badge';
      value: number;
    };
    isCompleted: boolean;
  }
  
  export type ChallengeType = 
    | 'savings' 
    | 'spending_reduction' 
    | 'budget_streak' 
    | 'deal_hunter' 
    | 'investing';