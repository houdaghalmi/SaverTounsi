import { format } from "date-fns";
import { CalendarDays, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string | Date; 
  description: string | null;
  category: {
    id: string;
    name: string;
  } | null;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-6">
        {transactions.map((transaction) => {
          const transactionDate = new Date(transaction.date);
          const isValidDate = !isNaN(transactionDate.getTime());

          return (
            <div
              key={transaction.id}
              className="group p-8 bg-white rounded-xl shadow-sm border border-gray-100 
                hover:shadow-md transition-all duration-200 space-y-6 w-full"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-[#1a2a6c] text-lg">
                    {transaction.category?.name || "Uncategorized"}
                  </p>
                  {transaction.description && (
                    <p className="text-base text-gray-600 line-clamp-2">
                      {transaction.description}
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-3 ml-6 ${
                  transaction.type === "INCOME" 
                    ? "text-emerald-600" 
                    : "text-red-600"
                }`}>
                  <span className="font-medium whitespace-nowrap text-lg">
                    {transaction.type === "INCOME" ? "+" : "-"} {transaction.amount} TND
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-500 pt-3 border-t border-gray-100">
                <CalendarDays className="w-5 h-5 flex-shrink-0" />
                <time className="text-base">
                  {isValidDate
                    ? format(transactionDate, "MMMM dd, yyyy")
                    : "Invalid date"}
                </time>
              </div>
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="w-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-600 font-medium">No transactions found</p>
          <p className="text-sm text-gray-500 mt-1">Add your first transaction to get started</p>
        </div>
      )}
    </div>
  );
}