"use client"

import * as React from "react" // Import de React pour utiliser ses fonctionnalités (hooks, composants)
import { useRouter } from "next/navigation" // Hook de Next.js pour gérer la navigation entre les pages
import { zodResolver } from "@hookform/resolvers/zod" // Intégration de la validation Zod avec React Hook Form
import { useForm } from "react-hook-form" // Gestion des formulaires avec validation et état
import * as z from "zod" // Bibliothèque pour définir et valider le format de données
import { signIn } from "next-auth/react" // Fonction pour l'authentification avec NextAuth
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { User } from "@prisma/client"

import { Icons } from "../ui/icons"

const formSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter() //pour rediriger l'utilisateur après l'authentification.
  const [isLoading, setIsLoading] = React.useState<boolean>(false) //l'état de chargement
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add schema validation only for required fields based on mode
    try {
      if (mode === "signup") {
        formSchema.parse(formData);
      } else {
        // For signin, only validate email and password
        z.object({
          email: z.string().email({
            message: "Please enter a valid email address.",
          }),
          password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
          }),
        }).parse(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          })
        });
        return;
      }
    }
    
    setIsLoading(true)
    
    try {
      if (mode === "signin") {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Check if user is onboarded
        const response = await fetch("/api/user")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        router.push(userData.isOnboarded ? "/overview" : "/onboarding")
      } else {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!res.ok) {
            throw new Error(await res.text())
          }

          router.push("/signin")
        } catch (error) {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Something went wrong",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required={mode === "signup"}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-[#1a2a6c] hover:bg-[#b21f1f]">
        {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </Button>
    </form>
  )
}

