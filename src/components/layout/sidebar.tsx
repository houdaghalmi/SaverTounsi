import { cn } from "@/lib/utils";
import { Wallet, Trophy, Settings, LogOut, PieChart, Star,BarChart,CreditCard } from "lucide-react"; // Updated icons
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: PieChart }, // Changed to PieChart
  { name: "Budgets", href: "/dashboard/categories", icon: Wallet }, // Kept Wallet
  { name: "Bon Plans", href: "/dashboard/bon-plans", icon: Star }, // Changed to Star
  { name: "Reports", href: "/dashboard/reports", icon: BarChart }, // Kept BarChart
  { name: "Transation", href: "/dashboard/transaction", icon: CreditCard }, // Kept CreditCard
  { name: "Challenges", href: "/dashboard/challenges", icon: Trophy }, // Kept Trophy
  { name: "Settings", href: "/dashboard/settings", icon: Settings }, // Kept Settings
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-screen">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname ? pathname.startsWith(item.href) : false;

            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start pl-6",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-600">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};