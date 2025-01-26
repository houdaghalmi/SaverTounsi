// app/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionFilters from "@/components/transactions/transaction-filters";

interface Category {
  id: string;
  name: string;
  group: {
    id: string;
    name: string;
  };
}

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleAddTransaction = async (data) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
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
          <TransactionForm onSubmit={handleAddTransaction} categories={categories} />
        </DialogContent>
      </Dialog>
    </div>
  );
}