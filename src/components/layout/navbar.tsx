import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Home, Wallet, Star, Search, Settings } from "lucide-react"; // Import icons

export default function Navbar() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleNavigation = (page: string) => {
    toast({
      title: 'Navigation',
      description: `You are now viewing the ${page} page.`,
      variant: 'default',
    });
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand name */}
          <Link
            href="/"
            onClick={() => handleNavigation('Home')}
            className="text-lg font-bold text-gray-800"
          >
            saveTounsi 2020
          </Link>

          {/* Navigation links with icons */}
          <div className="flex space-x-6">
            <Link
              href="/"
              onClick={() => handleNavigation('Home')}
              className={`text-sm flex items-center ${
                pathname === '/' ? 'text-gray-900 font-semibold' : 'text-gray-600'
              } hover:text-gray-900`}
            >
              <Home className="w-4 h-4 mr-1" /> {/* Added Home icon */}
              Home
            </Link>
            <Link
              href="/inbox"
              onClick={() => handleNavigation('Inbox')}
              className={`text-sm flex items-center ${
                pathname === '/inbox' ? 'text-gray-900 font-semibold' : 'text-gray-600'
              } hover:text-gray-900`}
            >
              <Wallet className="w-4 h-4 mr-1" /> {/* Added Wallet icon */}
              budget
            </Link>
            <Link
              href="/categories"
              onClick={() => handleNavigation('Calendar')}
              className={`text-sm flex items-center ${
                pathname === '/calendar' ? 'text-gray-900 font-semibold' : 'text-gray-600'
              } hover:text-gray-900`}
            >
              <Star className="w-4 h-4 mr-1" /> {/* Added Star icon */}
              bon plan
            </Link>
            <Link
              href="/bon-plans"
              onClick={() => handleNavigation('Search')}
              className={`text-sm flex items-center ${
                pathname === '/search' ? 'text-gray-900 font-semibold' : 'text-gray-600'
              } hover:text-gray-900`}
            >
              <Search className="w-4 h-4 mr-1" /> {/* Added Search icon */}
              Search
            </Link>
            <Link
              href="/settings"
              onClick={() => handleNavigation('Settings')}
              className={`text-sm flex items-center ${
                pathname === '/settings' ? 'text-gray-900 font-semibold' : 'text-gray-600'
              } hover:text-gray-900`}
            >
              <Settings className="w-4 h-4 mr-1" /> {/* Added Settings icon */}
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}