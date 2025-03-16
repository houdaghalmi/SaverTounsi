"use client";
import React, { useState } from "react";
import  Link  from "next/link";
import {
  Home,
  Folder,
  BarChart,
  Star,
  CreditCard,
  Trophy,
  MessageCircle,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Main menu items.
const items = [
  { title: "Overview", url: "/overview", icon: Home },
  { title: "Categorie manager", url: "/categories", icon: Folder },
  { title: "Reports", url: "/reports", icon: BarChart },
  { title: "Bon-plans", url: "/bon-plans", icon: Star },
  { title: "Transaction", url: "/transactions", icon: CreditCard },
  { title: "Challenge", url: "/challenges", icon: Trophy },
];

// Submenu items for Help
const helpSubmenuItems = [
  { title: "Feedback", url: "/feedback", icon: MessageCircle },
  { title: "Tutorial", url: "/tutorial", icon: HelpCircle },
];

// Logout item.
const logoutItem = { title: "Log Out", url: "/logout", icon: LogOut };

export function AppSidebar() {
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarContent>
        {/* Main menu group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            saverTounsi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
                    >
                      <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout group at the bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Help section at the very bottom */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div>
                    <div className="flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2" />
                      <span>Support</span>
                    </div>
                    {isHelpMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Submenu for Help */}
              {isHelpMenuOpen && (
                <ul className="pl-6 mt-1">
                  {helpSubmenuItems.map((subItem) => (
                    <li key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <Link href={subItem.url} className="flex items-center p-2 hover:bg-gray-100 rounded">
                          <subItem.icon className="w-5 h-5 mr-2" />
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </li>
                  ))}
                </ul>
              )}

              {/* Log out button below Help */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={logoutItem.url} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <logoutItem.icon className="w-5 h-5 mr-2" />
                    <span>{logoutItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
