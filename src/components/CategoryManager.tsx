"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  groupId: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
}

interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  type: 'income' | 'expense';
}

const CategoryManager = () => {
  const router = useRouter();
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [soldLeft, setSoldLeft] = useState<number>(0);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showEditCategoryBudgetModal, setShowEditCategoryBudgetModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [categoryBudgetAmount, setCategoryBudgetAmount] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryGroups();
    fetchTransactions();
  }, []);

  const fetchCategoryGroups = async () => {
    try {
      const response = await fetch("/api/category-groups");
      if (!response.ok) {
        throw new Error(`Failed to fetch category groups: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: expected an array");
      }
      setCategoryGroups(data);
    } catch (error) {
      console.error("Error fetching category groups:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: expected an array");
      }
      setTransactions(data);

      // Calculate total budget based on transaction types
      let calculatedBudget = 0;
      data.forEach((transaction: Transaction) => {
        if (transaction.type === 'income') {
          calculatedBudget += transaction.amount;
        } else if (transaction.type === 'expense') {
          calculatedBudget -= transaction.amount;
        }
      });
      setTotalBudget(calculatedBudget);
      setSoldLeft(calculatedBudget);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      let currentSoldLeft = totalBudget;
      transactions.forEach((transaction: Transaction) => {
        if (transaction.type === 'expense') {
          currentSoldLeft -= transaction.amount;
        }
      });
      setSoldLeft(currentSoldLeft);

      // Update category spent amounts
      if (categoryGroups.length > 0) {
        const updatedCategoryGroups = categoryGroups.map((group) => ({
          ...group,
          categories: group.categories.map((category) => {
            const categoryTransactions = transactions.filter(
              (transaction) => transaction.categoryId === category.id && transaction.type === 'expense'
            );
            const spent = categoryTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
            return { ...category, spent };
          }),
        }));
        setCategoryGroups(updatedCategoryGroups);
      }
    }
  }, [transactions, totalBudget, categoryGroups]);

  const addCategoryGroup = async () => {
    try {
      const isValid = await fetch(`/api/category-groups/findByName/${newGroupName}`, {
        method: "GET",
      }).then((d) => d.json()).then((d) => d.valid);
      
      if (!isValid) {
        return;
      }
      
      const response = await fetch("/api/category-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGroupName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add category group: ${response.statusText}`);
      }
      
      const newGroup = await response.json();
      setCategoryGroups([...categoryGroups, newGroup]);
      setNewGroupName("");
      setShowNewGroupModal(false);
    } catch (error) {
      console.error("Error adding category group:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const addCategory = async () => {
    if (newCategoryName.trim() && selectedGroupId) {
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCategoryName,
            budget: totalBudget * 0.2,
            groupId: selectedGroupId,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to add category: ${response.statusText}`);
        }
        
        const newCategory = await response.json();
        setCategoryGroups(
          categoryGroups.map((group) => {
            if (group.id === selectedGroupId) {
              return {
                ...group,
                categories: [...(group?.categories || []), newCategory],
              };
            }
            return group;
          })
        );
        setNewCategoryName("");
        setShowNewCategoryModal(false);
        setSelectedGroupId(null);
      } catch (error) {
        console.error("Error adding category:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    }
  };

  const updateCategoryBudget = async () => {
    if (!editingCategory) return;

    const amount = parseFloat(categoryBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      try {
        const response = await fetch("/api/categories", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingCategory.id,
            budget: amount,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update category budget: ${response.statusText}`);
        }
        
        const updatedCategory = await response.json();
        setCategoryGroups(
          categoryGroups.map((group) => ({
            ...group,
            categories: group.categories.map((cat) => {
              if (cat.id === updatedCategory.id) {
                return updatedCategory;
              }
              return cat;
            }),
          }))
        );
        setShowEditCategoryBudgetModal(false);
        setEditingCategory(null);
        setCategoryBudgetAmount("");
      } catch (error) {
        console.error("Error updating category budget:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    }
  };

  const updateBudget = () => {
    const amount = parseFloat(newBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      setTotalBudget(amount);
      setNewBudgetAmount("");
      setShowEditBudgetModal(false);
    }
  };

  const handleAddCategoryClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowNewCategoryModal(true);
  };

  const handleEditCategoryBudget = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setCategoryBudgetAmount(category.budget.toString());
    setShowEditCategoryBudgetModal(true);
  };

  const removeCategoryGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/category-groups/${groupId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category group");
      }
      setCategoryGroups(categoryGroups.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error("Error deleting category group:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      setCategoryGroups(
        categoryGroups.map((group) => ({
          ...group,
          categories: group.categories.filter((cat) => cat.id !== categoryId),
        }))
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const getProgressColor = (category: Category) => {
    const percentage = ((category.budget - category.spent) / category.budget) * 100;
    return percentage <= 40 ? "bg-red-500" : "bg-green-500";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Budget Manager</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setShowEditBudgetModal(true)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Budget
        </button>
      </div>
      
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-lg font-semibold">Total Budget</div>
            <div className="text-2xl text-blue-600">{totalBudget.toFixed(2)} DT</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-lg font-semibold">Sold Left</div>
            <div className={`text-2xl ${soldLeft >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {soldLeft.toFixed(2)} DT
            </div>
          </div>
        </div>
        <button
          className="mt-4 flex items-center text-blue-500"
          onClick={() => setShowNewGroupModal(true)}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Category Group
        </button>
      </div>

      <div className="space-y-6">
        {categoryGroups && categoryGroups.length > 0 ? (
          categoryGroups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{group.name}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center text-blue-500"
                    onClick={() => handleAddCategoryClick(group.id)}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Category
                  </button>
                  <button
                    className="flex items-center text-red-500"
                    onClick={() => removeCategoryGroup(group.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove Group
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.categories && group.categories.length > 0 ? (
                  group.categories.map((category) => (
                    <div
                      key={category.id}
                      className="border rounded-lg p-4 cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{category.name}</div>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-24 rounded ${getProgressColor(category)}`} />
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => handleEditCategoryBudget(category, e)}
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCategory(category.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {(((category.budget - category.spent) / category.budget) * 100).toFixed(1)}% remaining
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No categories found.</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No category groups found.</div>
        )}
      </div>

    
      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">New Category Group</h3>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setShowNewGroupModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={(e) => newGroupName.trim() && addCategoryGroup()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Category Modal */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">New Category</h3>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => {
                  setShowNewCategoryModal(false);
                  setSelectedGroupId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={addCategory}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {showEditBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Total Budget</h3>
            <input
              type="number"
              className="w-full border rounded p-2 mb-4"
              placeholder="New budget amount"
              value={newBudgetAmount}
              onChange={(e) => setNewBudgetAmount(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setShowEditBudgetModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={updateBudget}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Budget Modal */}
      {showEditCategoryBudgetModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Category Budget</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Category: {editingCategory.name}
              </label>
              <label className="block text-sm text-gray-500">
                Current Budget: {editingCategory.budget} DT
              </label>
            </div>
            <input
              type="number"
              className="w-full border rounded p-2 mb-4"
              placeholder="New budget amount"
              value={categoryBudgetAmount}
              onChange={(e) => setCategoryBudgetAmount(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => {
                  setShowEditCategoryBudgetModal(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={updateCategoryBudget}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">{selectedCategory.name}</h3>
            <div className="mb-4">
              <div className="w-32 h-32 mx-auto relative">
                {/* Progress Circle */}
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  {/* Background Circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee" // Light gray background
                    strokeWidth="3"
                  />
                  {/* Progress Circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 <= 40 ? "#EF4444" : "#22C55E"} // Red if <= 40%, else green
                    strokeWidth="3"
                    strokeDasharray={`${((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100}, 100`} // Progress calculation
                  />
                </svg>
                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold">
                    {(((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* Solde Left and Total Budget */}
              <div className="text-center mt-2">
                <div className="text-sm text-gray-600">
                  Solde Left: {(selectedCategory.budget - selectedCategory.spent).toFixed(2)} DT
                </div>
                <div className="text-sm text-gray-600">
                  Total Budget: {selectedCategory.budget} DT
                </div>
              </div>
              {/* Motivational/Warning Message */}
              {((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 >= 50 ? (
                <span className="block text-center text-green-500 mt-2">
                  🌟 Great job! You're keeping your budget under control.
                </span>
              ) : ((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 <= 30 ? (
                <span className="block text-center text-yellow-500 mt-2">
                  ⚠️ Take care! Your available budget is almost finished.
                </span>
              ) : null}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setSelectedCategory(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => router.push("/transactions")} // Redirect to Transactions Page
              >
                Go to Transactions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;