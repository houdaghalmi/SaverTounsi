import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string | Date; // Ensure the date is a string or Date object
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
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {transactions.map((transaction) => {
        // Validate the date before formatting
        const transactionDate = new Date(transaction.date);
        const isValidDate = !isNaN(transactionDate.getTime());

        return (
          <div
            key={transaction.id}
            className="p-5 bg-white rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {transaction.category?.name || "Uncategorized"}
              </p>
              <p className="text-sm text-gray-600">
                {transaction.description}
              </p>
              <p className="text-sm text-gray-500">
                {isValidDate
                  ? format(transactionDate, "dd/MM/yyyy") // Format the date if valid
                  : "Invalid date"}
              </p>
            </div>
            <p
              className={`font-semibold ${
                transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.type === "INCOME" ? "+" : "-"} {transaction.amount} TND
            </p>
          </div>
        );
      })}
    </div>
  );
}