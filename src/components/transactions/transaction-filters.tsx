import { Dispatch, SetStateAction } from "react";
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  filter: "all" | "INCOME" | "EXPENSE";
  setFilter: Dispatch<SetStateAction<"all" | "INCOME" | "EXPENSE">>;
}

export default function TransactionFilters({
  filter,
  setFilter,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1">
      <button
        onClick={() => setFilter("all")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
          "border hover:bg-gray-50",
          filter === "all"
            ? "border-gray-900/10 bg-gray-900/5 text-gray-900"
            : "border-gray-200 text-gray-600 hover:border-gray-300"
        )}
      >
        <Wallet className="w-4 h-4" />
        <span>All</span>
      </button>
      
      <button
        onClick={() => setFilter("INCOME")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
          "border hover:bg-gray-50",
          filter === "INCOME"
            ? "border-gray-900/10 bg-gray-900/5 text-gray-900"
            : "border-gray-200 text-gray-600 hover:border-gray-300"
        )}
      >
        <ArrowUpCircle className={cn(
          "w-4 h-4",
          filter === "INCOME" ? "text-emerald-500" : "text-gray-400"
        )} />
        <span>Income</span>
      </button>
      
      <button
        onClick={() => setFilter("EXPENSE")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
          "border hover:bg-gray-50",
          filter === "EXPENSE"
            ? "border-gray-900/10 bg-gray-900/5 text-gray-900"
            : "border-gray-200 text-gray-600 hover:border-gray-300"
        )}
      >
        <ArrowDownCircle className={cn(
          "w-4 h-4",
          filter === "EXPENSE" ? "text-red-500" : "text-gray-400"
        )} />
        <span>Expenses</span>
      </button>
    </div>
  );
}