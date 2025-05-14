import { Link, useLocation } from "react-router";
import { useState } from "react";
import Logo from "./Logo";
import CartIcon from "./CartIcon";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Bio", path: "/bio" },
    { name: "Store", path: "/store" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Check if the current path is active
  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="md" variant="full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors hover:text-blue-400 ${
                  location.pathname === link.path ? "text-blue-500" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Authentication Links */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-white hover:text-blue-400"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span>Account</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <Link to="/account" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                      My Account
                    </Link>
                    <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                      Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:text-blue-400">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
                  Register
                </Link>
              </div>
            )}
            <CartIcon />
          </nav>

          {/* Mobile Menu Button and Cart Icon */}
          <div className="md:hidden flex items-center space-x-4">
            <CartIcon />
            <button
              className="text-white"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors hover:text-blue-400 ${
                    location.pathname === link.path ? "text-blue-500" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Auth Links */}
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/account" 
                    className="transition-colors hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    to="/account/orders" 
                    className="transition-colors hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="transition-colors hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left transition-colors hover:text-blue-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="transition-colors hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="transition-colors hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="md" variant="full" />
              </div>
              <p className="text-gray-400">
                Premium quality products for your creative needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-blue-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
                {!isLoggedIn && (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@creative.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Creative St, Design City</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get updates on new products and special offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-md flex-grow"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Creative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 