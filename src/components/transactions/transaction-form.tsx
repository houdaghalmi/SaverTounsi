// components/transactions/transaction-form.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const transactionFormSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  date: z.date({
    required_error: "Date is required.",
  }),
  description: z.string().optional(),
});

interface TransactionFormProps {
  initialData?: z.infer<typeof transactionFormSchema>;
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => void;
  isLoading?: boolean;
  categories: Array<{ id: string; name: string; group: { id: string; name: string } }>;
}

export function TransactionForm({
  initialData,
  onSubmit,
  isLoading,
  categories = [],
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type || "EXPENSE"
  );

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialData || {
      type: "EXPENSE",
      amount: "",
      categoryId: "",
      date: new Date(),
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Toggle */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#1a2a6c]">Transaction Type</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    field.onChange("EXPENSE");
                    setTransactionType("EXPENSE");
                    form.setValue("categoryId", "");
                  }}
                  className={cn(
                    "w-full transition-all",
                    field.value === "EXPENSE"
                      ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                      : "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    field.onChange("INCOME");
                    setTransactionType("INCOME");
                    form.setValue("categoryId", "");
                  }}
                  className={cn(
                    "w-full transition-all",
                    field.value === "INCOME"
                      ? "bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white"
                      : "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Income
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#1a2a6c]">Amount (TND)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field}
                  className="text-lg font-medium border-gray-200 focus:border-[#1a2a6c] focus:ring-2 focus:ring-[#1a2a6c]/20" 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#1a2a6c]">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-gray-200 focus:border-[#1a2a6c] focus:ring-2 focus:ring-[#1a2a6c]/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="focus:bg-[#1a2a6c]/5"
                    >
                      {category.name} 
                      <span className="text-sm text-gray-500 ml-1">
                        ({category.group.name})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-semibold text-[#1a2a6c]">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-200 hover:bg-gray-50",
                        !field.value && "text-gray-500"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 text-[#1a2a6c]" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#1a2a6c]">Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add notes about this transaction"
                  className="resize-none border-gray-200 focus:border-[#1a2a6c] focus:ring-2 focus:ring-[#1a2a6c]/20"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white hover:opacity-90 transition-opacity py-6 text-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save Transaction"
          )}
        </Button>
      </form>
    </Form>
  );
}