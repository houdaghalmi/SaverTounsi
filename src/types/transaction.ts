// src/types/transaction.ts
export interface Transaction {
  id: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  date: Date;
  description: string;
}