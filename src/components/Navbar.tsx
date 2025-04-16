
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import NavLinks from './navbar/NavLinks';
import NavLogo from './navbar/NavLogo';
import NavUserMenu from './navbar/NavUserMenu';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <NavLogo />
              <span className="ml-2 text-xl font-bold tracking-tight">Zenway Travels</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {currentUser ? (
              <NavUserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none ml-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-2">
              <div className="py-2">
                <NavLinks />
              </div>
              <div className="pt-2 border-t">
                {currentUser ? (
                  <div className="py-2">
                    <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      My Profile
                    </Link>
                    <Link to="/my-bookings" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      My Bookings
                    </Link>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 py-2">
                    <Button className="w-full" asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
