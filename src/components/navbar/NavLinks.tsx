
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLinks: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex items-center space-x-6">
      <Link 
        to="/" 
        className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
      >
        Home
      </Link>
      <Link 
        to="/destinations" 
        className={`text-sm font-medium transition-colors ${isActive('/destinations') ? 'text-primary' : 'hover:text-primary'}`}
      >
        Destinations
      </Link>
      <Link 
        to="/trip-planner" 
        className={`text-sm font-medium transition-colors ${isActive('/trip-planner') ? 'text-primary' : 'hover:text-primary'}`}
      >
        Plan Trip
      </Link>
      <Link 
        to="/about" 
        className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary' : 'hover:text-primary'}`}
      >
        About
      </Link>
      <Link 
        to="/premium-features" 
        className={`text-sm font-medium transition-colors ${isActive('/premium-features') ? 'text-primary' : 'hover:text-primary'}`}
      >
        Premium
      </Link>
    </nav>
  );
};

export default NavLinks;
