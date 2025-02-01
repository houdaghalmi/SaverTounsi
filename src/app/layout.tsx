"use server";
import { SpeedInsights } from "@vercel/speed-insights/next"
import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "../styles/globals.css"
import Footer from '@/components/layout/footer';
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
      <link rel="icon"  href="./images/logo/logo.png" />
      <title>saverTounsi</title>
      </head>
      <body>            
          <main>
            {children}
          </main>
          
          <Toaster />
          <Footer />
          <SpeedInsights/>
      </body>
    </html>
  )
}