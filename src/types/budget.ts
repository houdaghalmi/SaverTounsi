export interface Budget {
    id: string;
    userId: string;
    name: string;
    amount: number;
    spent: number;
    startDate: Date;
    endDate: Date;
    category: BudgetCategory;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface BudgetCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
  }
  
  export interface BudgetGoal {
    id: string;
    budgetId: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    status: 'ongoing' | 'completed' | 'failed';
  }