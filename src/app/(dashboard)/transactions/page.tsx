"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionFilters from "@/components/transactions/transaction-filters";
import { Transaction } from "@prisma/client";
import { motion } from "framer-motion";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      // Filter out categories with group name "Challenges"
      const filteredCategories = data.filter(
        (category: Category) => category.group?.name !== "Challenges"
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch categories from the API
  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  // Handle form submission
  const handleAddTransaction = async (data: any) => {
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
      console.log(newTransaction)
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your income and expenses
            </p>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filters Section */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <TransactionFilters filter={filter} setFilter={setFilter} />
          </div>

          {/* Transaction List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-transparent"
          >
            <TransactionList transactions={filteredTransactions as any} />
          </motion.div>
        </div>

        {/* Modal remains unchanged */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
                Add Transaction
              </DialogTitle>
            </DialogHeader>
            <TransactionForm 
              onSubmit={handleAddTransaction} 
              categories={categories} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}