import { Transaction } from "@prisma/client"


export interface DashboardData {
  totalBudget: number
  totalIncome: number
  totalExpenses: number
  categoryBreakdown: {
    [key: string]: number
  }
  recentTransactions: Transaction[]
  remainingBudget: number
}