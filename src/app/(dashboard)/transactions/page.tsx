// src/app/dashboard/transactions/page.tsx
"use client";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionFilters from "@/components/transactions/transaction-filters";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "EXPENSE",
      category: "Food & Groceries",
      amount: 200,
      date: new Date("2023-10-01"),
      description: "Weekly groceries",
    },
    {
      id: 2,
      type: "INCOME",
      category: "Salary",
      amount: 1500,
      date: new Date("2023-10-01"),
      description: "Monthly salary",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");

  // Handle form submission
  const handleAddTransaction = (data) => {
    const newTransaction = {
      id: transactions.length + 1, // Generate a unique ID
      ...data,
      amount: parseFloat(data.amount), // Convert amount to a number
    };
    setTransactions([...transactions, newTransaction]); // Update transactions state
    setIsModalOpen(false); // Close the modal
  };

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Filters */}
      <TransactionFilters filter={filter} setFilter={setFilter} />

      {/* Transaction List */}
      <TransactionList transactions={filteredTransactions} />

      {/* Add Transaction Button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Add Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onSubmit={handleAddTransaction} />
        </DialogContent>
      </Dialog>
    </div>
  );
}