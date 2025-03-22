"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Add this import
import {
  PieChart,
  Wallet,
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
  Settings,
  PlayCircle
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Main menu items.
const items = [
  { title: "Overview", url: "/overview", icon: PieChart },
  { title: "Categorie manager", url: "/categories", icon: Wallet },
  { title: "Reports", url: "/reports", icon: BarChart },
  { title: "Bon-plans", url: "/bon-plans", icon: Star },
  { title: "Transaction", url: "/transactions", icon: CreditCard },
  { title: "Challenge", url: "/challenges", icon: Trophy },
  { title: "Settings", url: "/settings", icon: Settings },

];

// Submenu items for Help
const helpSubmenuItems = [
  { title: "Feedback", url: "/feedback", icon: MessageCircle },
  { title: "Tutorial", url: "/tutorial", icon: PlayCircle },

];

// Logout item.
const logoutItem = { title: "Log Out", url: "/logout", icon: LogOut };

export function AppSidebar() {
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar 
      className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
      collapsible="icon"
    >
      <SidebarContent>
        
        <SidebarHeader>
          <div className={` py-2 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
            <Image 
              src="/images/logo/logo2.png" 
              alt="SaverTounsi Logo"
              width={60}
              height={60}
            />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                SaverTounsi
              </span>
           
          </div> 
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 transition-colors   rounded-lg hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
                      title={item.title} // Always show tooltip regardless of collapsed state
                    >
                      <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} text-gray-500`} />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {!isCollapsed && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <HelpCircle className="w-5 h-5 mr-2" />
                          <span>Support</span>
                        </div>
                        {isHelpMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Help submenu items */}
                  {isHelpMenuOpen && (
                    <div className="pl-6 mt-1">
                      {helpSubmenuItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link 
                              href={subItem.url} 
                              className="flex items-center p-2 hover:bg-gray-100 rounded"
                            >
                              <subItem.icon className="w-5 h-5 mr-2" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    href={logoutItem.url} 
                    className="flex items-center p-2 hover:bg-gray-100 rounded"
                    title={isCollapsed ? "Log Out" : ""}
                  >
                    <logoutItem.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && <span>{logoutItem.title}</span>}
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
