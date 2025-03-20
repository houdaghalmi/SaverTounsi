export interface Category {
  id: string;
  name: string;
  spent: number;
  budget: number;
  group: {
    id: string;
    name: string;
  };
}

export interface MonthlyReport {
  spent: number;
  saved: number;
  categories: Category[];
  savingsData: {
    categoryName: string;
    saved: number;
  }[];
}

export interface YearlyReport {
  spent: number;
  saved: number;
  categories: Category[];
  savingsData: {
    categoryName: string;
    saved: number;
  }[];
}

export interface Challenge {
  id: string;
  title: string;        // Changed from name to title
  description: string;
  goal: number;
  duration: number;
  reward?: string;
  createdAt: string;
  progress: number;
  startDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  startDate: string;
  completed: boolean;
  completedAt?: string;
  challenge: Challenge;
}

export interface ProgressPoint {
  day: string;
  amount: number;
  percentage: number;
}

export interface GroupedData {
  groupName: string;
  amount: number;
}

export interface UserChallengeProgress {
  id: string;
  userChallengeId: string;
  amount: number;
  date: string;
}