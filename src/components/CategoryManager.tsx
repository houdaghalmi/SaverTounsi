"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2 } from "lucide-react"; // Import Trash2 icon
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

export default function CategoryManager() {
  const router = useRouter();
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'category' | 'group';
    id: string;
    name: string;
  } | null>(null);

  // Fetch category groups on component mount
  useEffect(() => {
    fetchCategoryGroups();
  }, []);

  // Fetch all category groups from the API
  const fetchCategoryGroups = async () => {
    try {
      const response = await fetch("/api/category-groups");
      if (!response.ok) {
        throw new Error(`Failed to fetch category groups: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("API Response:", data); // Log the API response
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

  // Add a new category group
  const addCategoryGroup = async () => {
    try {
      const isValid = await fetch(`/api/category-groups/findByName/${newGroupName}`,{
        method:"GET",
      }).then(d=> d.json()).then(d=>d.valid);
      console.log(isValid)
      if(!isValid){
        return ;
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
      console.log("New category group:", newGroup); // Log the new group
      setCategoryGroups([...categoryGroups, newGroup]);
      setNewGroupName("");
      setShowNewGroupModal(false);
    } catch (error) {
      console.error("Error adding category group:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  // Add a new category to a group
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
            budget: 0,
            groupId: selectedGroupId,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to add category: ${response.statusText}`);
        }
        const newCategory = await response.json();
        console.log("New category:", newCategory); // Log the new category
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

  // Update the total budget
  const updateBudget = () => {
    const amount = parseFloat(newBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      setTotalBudget(amount);
      setNewBudgetAmount("");
      setShowEditBudgetModal(false);
    }
  };

  // Handle clicking the "Add Category" button for a specific group
  const handleAddCategoryClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowNewCategoryModal(true);
  };

  // Remove a category group
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

  // Remove a category
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

  // Get the progress bar color based on the remaining budget
  const getProgressColor = (category: Category) => {
    const percentage = ((category.budget - category.spent) / category.budget) * 100;
    return percentage <= 40 ? "bg-red-500" : "bg-green-500";
  };

  const handleRemoveCategoryGroup = (group: CategoryGroup) => {
    setDeleteConfirmation({
      type: 'group',
      id: group.id,
      name: group.name
    });
  };

  const handleRemoveCategory = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setDeleteConfirmation({
      type: 'category',
      id: category.id,
      name: category.name
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#1a2a6c] text-xl font-semibold animate-pulse">
            Loading...
          </div>
          </div>
        </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f]/20 to-[#fdbb2d]/20 flex items-center justify-center">
        <div className="bg-[#b21f1f]/10 text-[#b21f1f] p-4 rounded-lg">Error: {error}</div>
      </div>
    );
  }

  // Render the component
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-lg p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
            Category Manager
          </h1>
          <button
            className="bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md hover:shadow-xl"
            onClick={() => setShowEditBudgetModal(true)}
          >
            <Edit2 className="w-5 h-5" />
            Edit Budget
          </button>
        </div>

        {/* Budget Info Section */}
        <div className="mb-10 bg-gradient-to-r from-[#1a2a6c]/5 to-[#b21f1f]/5 p-6 rounded-xl">
          <div className="text-2xl font-semibold text-[#1a2a6c]">
            Total Budget: <span className="text-[#b21f1f]">{totalBudget} DT</span>
          </div>
          <button
            className="mt-4 flex items-center text-[#1a2a6c] hover:text-[#b21f1f] transition-all gap-2 group"
            onClick={() => setShowNewGroupModal(true)}
          >
            <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Add Category Group</span>
          </button>
        </div>

        {/* Category Groups Grid */}
        <div className="grid gap-8">
          {categoryGroups && categoryGroups.length > 0 ? (
            categoryGroups.map((group) => (
              <div 
                key={group.id} 
                className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-[#b21f1f] transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a2a6c]">{group.name}</h2>
                  <div className="flex items-center gap-4">
                    {group.name.toLowerCase() !== "challenges" && (
                      <>
                        <button
                          className="flex items-center gap-2 text-[#1a2a6c] hover:text-[#b21f1f] transition-all group"
                          onClick={() => handleAddCategoryClick(group.id)}
                        >
                          <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Add Category</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-[#b21f1f] hover:text-[#b21f1f]/70 transition-all group"
                          onClick={() => handleRemoveCategoryGroup(group)}
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Remove Group</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {group.categories && group.categories.length > 0 ? (
                    group.categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-semibold text-[#1a2a6c]">{category.name}</div>
                          <div className="flex items-center gap-3">
                            <div className={`h-2.5 w-28 rounded-full ${getProgressColor(category)}`} />
                            {group.name.toLowerCase() !== "challenges" && (
                              <button
                                className="p-2 hover:bg-red-50 rounded-full group-hover:opacity-100 opacity-0 transition-all"
                                onClick={(e) => handleRemoveCategory(e, category)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {(((category.budget - category.spent) / category.budget) * 100).toFixed(1)}% remaining
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      No categories found in this group.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No category groups found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-[#1a2a6c]/20">
            <h3 className="text-lg font-semibold mb-4 text-[#1a2a6c]">Add Category Group</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#1a2a6c]/20 focus:border-[#b21f1f] focus:ring-1 focus:ring-[#b21f1f] outline-none mb-4"
              placeholder="Enter group name"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-[#1a2a6c] hover:bg-[#1a2a6c]/5 rounded transition-colors"
                onClick={() => setShowNewGroupModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white rounded hover:opacity-90 transition-opacity"
                onClick={e => newGroupName.trim() && addCategoryGroup()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Category Modal */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black/20  flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-[#1a2a6c]/20">
            <h3 className="text-lg font-semibold mb-4 text-[#1a2a6c]">Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#1a2a6c]/20 focus:border-[#b21f1f] focus:ring-1 focus:ring-[#b21f1f] outline-none mb-4"
              placeholder="Category name"
            />
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-[#1a2a6c] hover:bg-[#1a2a6c]/5 rounded transition-colors"
                onClick={() => {
                  setShowNewCategoryModal(false);
                  setSelectedGroupId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white rounded hover:opacity-90 transition-opacity"
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-[#1a2a6c]/20">
            <h3 className="text-lg font-semibold mb-4 text-[#1a2a6c]">Edit Total Budget</h3>
            <input
              type="number"
              className="w-full border border-[#1a2a6c]/20 rounded p-2 mb-4 focus:border-[#b21f1f] focus:ring-1 focus:ring-[#b21f1f] outline-none"
              placeholder="New budget amount"
              value={newBudgetAmount}
              onChange={(e) => setNewBudgetAmount(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-[#1a2a6c] hover:bg-[#1a2a6c]/5 rounded transition-colors"
                onClick={() => setShowEditBudgetModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white rounded hover:opacity-90 transition-opacity"
                onClick={updateBudget}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-[380px] shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent mb-6">
              {selectedCategory.name}
            </h3>
            <div className="mb-6">
              {/* Progress Circle - Smaller Size */}
              <div className="w-40 h-40 mx-auto relative mb-6">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Keep all existing circles */}
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-100" strokeWidth="0.5"/>
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-current text-gray-100" strokeWidth="2"/>
                  <circle
                    cx="18" cy="18" r="15.915"
                    fill="none"
                    stroke={((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 <= 40 
                      ? "#b21f1f" 
                      : "#1a2a6c"}
                    strokeWidth="2"
                    strokeDasharray={`${((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100}, 100`}
                    className="transition-all duration-500"
                    strokeLinecap="round"
                  />
                  {((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 > 40 && (
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="none"
                      stroke="#28a745"
                      strokeWidth="2"
                      strokeDasharray={`${((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100}, 100`}
                      className="transition-all duration-500"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                {/* Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${
                    ((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 >= 40
                      ? "from-[#1a2a6c] to-[#28a745]"
                      : "from-[#1a2a6c] to-[#b21f1f]"
                  } bg-clip-text text-transparent`}>
                    {(((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm text-gray-500 mt-1">Remaining</span>
                </div>
              </div>

              {/* Budget Information Cards - More Compact */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50/50 rounded-xl p-4 text-center">
                  <span className="text-sm text-gray-500 block mb-1">Available</span>
                  <span className="text-lg font-semibold text-[#1a2a6c]">
                    {(selectedCategory.budget - selectedCategory.spent).toFixed(2)} DT
                  </span>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4 text-center">
                  <span className="text-sm text-gray-500 block mb-1">Total Budget</span>
                  <span className="text-lg font-semibold text-[#1a2a6c]">
                    {selectedCategory.budget.toFixed(2)} DT
                  </span>
                </div>
              </div>

              {/* Status Message - Preserved */}
              {((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 >= 50 ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-4 text-center text-sm font-medium">
                  🌟 Great job! You're keeping your budget under control.
                </div>
              ) : ((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 <= 30 ? (
                <div className="bg-red-50 text-[#b21f1f] rounded-xl p-4 text-center text-sm font-medium">
                  ⚠️ Take care! Your available budget is almost finished.
                </div>
              ) : null}
            </div>

            {/* Action Buttons - More Compact */}
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                onClick={() => setSelectedCategory(null)}
              >
                Close
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white rounded-xl font-medium 
                          hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => router.push("/transactions")}
              >
                View Transactions
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-[#1a2a6c]/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-[#b21f1f]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a2a6c] mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this {deleteConfirmation.type}:
              </p>
              <p className="font-medium text-[#1a2a6c]">
                {deleteConfirmation.name}
              </p>
           
            </div>
            <div className="flex justify-center space-x-3">
              <button
                className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-gradient-to-r from-[#b21f1f] to-[#1a2a6c] text-white rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (deleteConfirmation.type === 'group') {
                    removeCategoryGroup(deleteConfirmation.id);
                  } else {
                    removeCategory(deleteConfirmation.id);
                  }
                  setDeleteConfirmation(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}