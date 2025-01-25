"use server";

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
        <title>saverTounsi</title>
      </head>
      <body>            
          <main>
            {children}
          </main>
          
          <Toaster />
          <Footer />

      </body>
    </html>
  )
}