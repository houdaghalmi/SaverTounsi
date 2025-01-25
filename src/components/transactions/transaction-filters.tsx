// src/components/transactions/TransactionFilters.tsx
import { Dispatch, SetStateAction } from "react";

interface TransactionFiltersProps {
  filter: "all" | "INCOME" | "EXPENSE";
  setFilter: Dispatch<SetStateAction<"all" | "INCOME" | "EXPENSE">>;
}

export default function TransactionFilters({
  filter,
  setFilter,
}: TransactionFiltersProps) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setFilter("all")}
        className={`px-4 py-2 rounded-lg ${
          filter === "all"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setFilter("INCOME")}
        className={`px-4 py-2 rounded-lg ${
          filter === "INCOME"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Income
      </button>
      <button
        onClick={() => setFilter("EXPENSE")}
        className={`px-4 py-2 rounded-lg ${
          filter === "EXPENSE"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Expenses
      </button>
    </div>
  );
}