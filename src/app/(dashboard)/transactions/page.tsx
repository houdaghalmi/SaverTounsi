import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TransactionFilters />
          </div>
          
          <div className="lg:col-span-3">
            <TabsContent value="all">
              <TransactionList type="all" />
            </TabsContent>
            <TabsContent value="income">
              <TransactionList type="income" />
            </TabsContent>
            <TabsContent value="expenses">
              <TransactionList type="expenses" />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

