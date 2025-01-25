// src/components/transactions/TransactionList.tsx
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{transaction.category}</p>
            <p className="text-sm text-gray-600">{transaction.description}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(transaction.date), "dd/MM/yyyy")}
            </p>
          </div>
          <p
            className={`font-semibold ${
              transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type === "INCOME" ? "+" : "-"} TND {transaction.amount}
          </p>
        </div>
      ))}
    </div>
  );
}