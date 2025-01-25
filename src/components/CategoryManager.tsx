"use client";

import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter

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

const CategoryManager = () => {
  const router = useRouter(); // Initialize useRouter
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showEditCategoryBudgetModal, setShowEditCategoryBudgetModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [categoryBudgetAmount, setCategoryBudgetAmount] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const addCategoryGroup = () => {
    if (newGroupName.trim()) {
      setCategoryGroups([
        ...categoryGroups,
        {
          id: Date.now().toString(),
          name: newGroupName,
          categories: []
        }
      ]);
      setNewGroupName('');
      setShowNewGroupModal(false);
    }
  };

  const addCategory = () => {
    if (newCategoryName.trim() && selectedGroupId) {
      setCategoryGroups(categoryGroups.map(group => {
        if (group.id === selectedGroupId) {
          return {
            ...group,
            categories: [
              ...group.categories,
              {
                id: Date.now().toString(),
                name: newCategoryName,
                budget: totalBudget * 0.2, // Default to 20% of total budget
                spent: 0,
                groupId: selectedGroupId
              }
            ]
          };
        }
        return group;
      }));
      setNewCategoryName('');
      setShowNewCategoryModal(false);
      setSelectedGroupId(null);
    }
  };

  const handleAddCategoryClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowNewCategoryModal(true);
  };

  const updateBudget = () => {
    const amount = parseFloat(newBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      setTotalBudget(amount);
      setNewBudgetAmount('');
      setShowEditBudgetModal(false);
    }
  };

  const handleEditCategoryBudget = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setCategoryBudgetAmount(category.budget.toString());
    setShowEditCategoryBudgetModal(true);
  };

  const updateCategoryBudget = () => {
    if (!editingCategory) return;
    
    const amount = parseFloat(categoryBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      setCategoryGroups(categoryGroups.map(group => ({
        ...group,
        categories: group.categories.map(cat => {
          if (cat.id === editingCategory.id) {
            return {
              ...cat,
              budget: amount
            };
          }
          return cat;
        })
      })));
      setShowEditCategoryBudgetModal(false);
      setEditingCategory(null);
      setCategoryBudgetAmount('');
    }
  };

  const getProgressColor = (category: Category) => {
    const percentage = ((category.budget - category.spent) / category.budget) * 100;
    return percentage <= 40 ? 'bg-red-500' : 'bg-green-500';
  };

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
        <div className="text-xl">Total Budget: {totalBudget} DT</div>
        <button 
          className="mt-4 flex items-center text-blue-500"
          onClick={() => setShowNewGroupModal(true)}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Category Group
        </button>
      </div>

      {/* Category Groups */}
      <div className="space-y-6">
        {categoryGroups.map(group => (
          <div key={group.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <button 
                className="flex items-center text-blue-500"
                onClick={() => handleAddCategoryClick(group.id)}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.categories.map(category => (
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
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {((category.budget - category.spent) / category.budget * 100).toFixed(1)}% remaining
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
                onClick={addCategoryGroup}
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
                    stroke={((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100 <= 40 ? '#EF4444' : '#22C55E'} // Red if <= 40%, else green
                    strokeWidth="3"
                    strokeDasharray={`${((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget) * 100}, 100`} // Progress calculation
                  />
                </svg>
                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold">
                    {((selectedCategory.budget - selectedCategory.spent) / selectedCategory.budget * 100).toFixed(1)}%
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
                onClick={() => router.push('/transactions')} // Redirect to Transactions Page
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