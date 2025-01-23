import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Menu, Search } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <img
              src="/images/logo/logo.svg"
              alt="SaverTounsi"
              className="h-8 w-auto"
            />
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            
            <img
              src={user?.image || "/api/placeholder/32/32"}
              alt={user?.name}
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
