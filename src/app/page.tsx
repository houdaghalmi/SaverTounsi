"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 mx-auto text-center relative z-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            Welcome to SaverTounsi
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto">
            Take control of your finances with smart budgeting tools, exclusive deals, and engaging challenges.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#fdbb2d]/90 hover:scale-105 transition-all">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-black border-white hover:text-white hover:bg-black/10">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#1a2a6c]">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your finances effectively
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-[#fdbb2d]/10 to-transparent backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-[#1a2a6c] group-hover:text-[#b21f1f] transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardDescription className="text-[#1a2a6c]/80 text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Improved Design */}
      <section className="w-full py-24 bg-[#fdbb2d]/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#1a2a6c]">What Users Say</h2>
            <p className="text-xl text-muted-foreground">Real experiences from our community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      {"★".repeat(5)}
                    </div>
                    <p className="text-[#1a2a6c] mb-4">{testimonial.content}</p>
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="font-semibold text-[#1a2a6c]">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="w-full py-24 bg-gradient-to-br from-[#1a2a6c] to-[#b21f1f] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-background/10 backdrop-blur-md border-none">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Upgrade to Premium</h2>
                  <p className="text-xl text-gray-200">Unlock all features and take full control</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Premium Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckIcon className="mr-2" /> Scan receipts instantly
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="mr-2" /> Service Payments integration
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="mr-2" /> Collaborative Budgeting
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold">40dt<span className="text-xl">/month</span></p>
                      <p className="text-sm text-gray-300">or 10dt/week</p>
                    </div>
                    <Button size="lg" className="w-full bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#fdbb2d]/90">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const CheckIcon = ({ className = "" }) => (
  <svg
    className={`w-5 h-5 text-[#fdbb2d] ${className}`}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const features = [
  {
    title: "Budget Manager",
    image: "/images/features/manager.png",
    description: "Easily create and manage budgets to track your spending."
  },
  {
    title: "Reports",
    image: "/images/features/report.png",
    description: "Generate detailed reports to analyze your financial health."
  },
  {
    title: "Bon Plans",
    image: "/images/features/bon plan.png",
    description: "Discover exclusive deals and discounts to save money."
  },
  {
    title: "Challenges",
    image: "/images/features/challenge.png",
    description: "Participate in challenges to improve your financial habits."
  }
];

const testimonials = [
  {
    content: "SaverTounsi has completely transformed how I manage my finances. The interface is intuitive and the features are exactly what I need.",
    name: "Sarah M.",
    date: "January 2024"
  },
  {
    content: "The challenges feature keeps me motivated to save, and the bon plans have helped me find great deals I wouldn't have known about otherwise.",
    name: "Ahmed K.",
    date: "February 2024"
  },
  {
    content: "As a student, this app has been invaluable in helping me budget my expenses and find ways to save money. Highly recommended!",
    name: "Leila B.",
    date: "March 2024"
  }
];