export interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  date: Date;
  description?: string;
  budgetId?: string;
}