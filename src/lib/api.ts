import { Category, Transaction } from "@prisma/client";
import { TransactionInput } from "./validations";

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to fetch data');
  }

  return res.json();
}

export const api = {
  transactions: {
    list: () => fetcher<Transaction[]>('/api/transactions'),
    create: (data: TransactionInput) => 
      fetcher<Transaction>('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  categories: {
    list: () => fetcher<Category[]>('/api/categories'),
  }
};
