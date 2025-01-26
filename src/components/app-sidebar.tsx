import { Home, Folder, BarChart, Star, CreditCard, Trophy, MessageCircle } from "lucide-react"; // Updated icons

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
    url: "/overview",
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
  {
    title: "transaction",
    url: "/transactions",
    icon: CreditCard, // Changed to CreditCard
  },
  {
    title: "challenge",
    url: "/challenges",
    icon: Trophy, // Changed to Trophy
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
                    <a href={item.url} className="flex items-center p-2 hover:bg-gray-100 rounded">
                      <item.icon className="w-5 h-5 mr-2" /> {/* Added icon styling */}
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