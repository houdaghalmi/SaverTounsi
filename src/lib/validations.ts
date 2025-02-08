// src/lib/validations.ts
import * as z from "zod"

export const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
})

export const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
})

export const transactionSchema = z.object({
  amount: z.number().positive({
    message: "Amount must be greater than 0",
  }),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
  description: z.string().optional(),
  date: z.date(),
})

export const budgetSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  amount: z.number().positive({
    message: "Amount must be greater than 0",
  }),
  startDate: z.date(),
  endDate: z.date(),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
  type: z.enum(["MONTHLY", "WEEKLY", "CUSTOM"]),
})

export const bonPlanSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  price: z.number().positive({
    message: "Price must be greater than 0",
  }),
  store: z.string().min(2, {
    message: "Store name must be at least 2 characters long",
  }),
  location: z.string().optional(),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
  startDate: z.date(),
  endDate: z.date(),
})


export const transactionValidation = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  date: z.date(),
  description: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionValidation>;