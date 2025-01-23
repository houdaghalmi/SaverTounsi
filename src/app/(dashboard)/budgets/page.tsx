import { Button } from "@/components/ui/button";
import { BudgetCard } from "@/components/budget/budget-card";
import { Plus } from "lucide-react";

export default function BudgetsPage() {
  const budgets = []; // Fetch from API

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
}