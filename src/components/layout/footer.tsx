export const Footer = () => {
    return (
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} SaverTounsi. All rights reserved.
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };