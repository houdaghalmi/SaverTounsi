import { Home, Folder, BarChart, Star, MessageCircle, Settings } from "lucide-react"; // Updated icons

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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home, // Kept Home
  },
  {
    title: "categorie manager",
    url: "/categories",
    icon: Folder, // Changed to Folder
  },
  {
    title: "reports",
    url: "/reports",
    icon: BarChart, // Changed to BarChart
  },
  {
    title: "bon-plans",
    url: "/bon-plans",
    icon: Star, // Changed to Star
  },
  {
    title: "feedback",
    url: "/feedback",
    icon: MessageCircle, // Changed to MessageCircle
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>saverTounsi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}