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
  { title: "Home", url: "/overview", icon: Home },
  { title: "categorie manager", url: "/categories", icon: Folder },
  { title: "reports", url: "/reports", icon: BarChart },
  { title: "bon-plans", url: "/bon-plans", icon: Star },
  { title: "transaction", url: "/transactions", icon: CreditCard },
  { title: "challenge", url: "/challenges", icon: Trophy },
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
          <SidebarGroupLabel>saverTounsi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center p-2 hover:bg-gray-100 rounded">
                      <item.icon className="w-5 h-5 mr-2" />
                      <span>{item.title}</span>
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
