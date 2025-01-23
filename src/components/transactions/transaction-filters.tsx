// src/components/transactions/transaction-filters.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface TransactionFilters {
  type?: "INCOME" | "EXPENSE" | "ALL"
  category?: string
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
}

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionFilters) => void
  categories: Array<{ value: string; label: string }>
}

export function TransactionFilters({
  onFilterChange,
  categories,
}: TransactionFiltersProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    type: "ALL",
    category: undefined,
    startDate: undefined,
    endDate: undefined,
    minAmount: undefined,
    maxAmount: undefined,
  })

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      type: "ALL",
      category: undefined,
      startDate: undefined,
      endDate: undefined,
      minAmount: undefined,
      maxAmount: undefined,
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          onValueChange={(value) => 
            handleFilterChange("type", value === "ALL" ? undefined : value)
          }
          value={filters.type || "ALL"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => 
            handleFilterChange("category", value === "ALL" ? undefined : value)}value={filters.category || "ALL"}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>