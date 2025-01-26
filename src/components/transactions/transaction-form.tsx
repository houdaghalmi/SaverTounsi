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
  budgetId: z.string().optional(),
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
      budgetId: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Field */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                onValueChange={(value: "INCOME" | "EXPENSE") => {
                  field.onChange(value);
                  setTransactionType(value);
                  form.setValue("categoryId", ""); // Reset category when type changes
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>
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
              <FormLabel>Amount (TND)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.group.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field (Optional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add notes about this transaction"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Transaction"}
        </Button>
      </form>
    </Form>
  );
}