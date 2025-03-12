
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import AuthDialog from "@/components/auth/AuthDialog";
import LocationSelector from "@/components/ui/LocationSelector";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useUser();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(localStorage.getItem("selectedLocation") || "Mumbai");
  
  useEffect(() => {
    // Event listener for opening auth dialog from other components
    const handleOpenAuthDialog = () => setIsAuthDialogOpen(true);
    window.addEventListener('openAuthDialog', handleOpenAuthDialog);
    
    return () => {
      window.removeEventListener('openAuthDialog', handleOpenAuthDialog);
    };
  }, []);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
  };
  
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white mr-8">
              CineMagic
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-white hover:text-purple-200 transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-white hover:text-purple-200 transition-colors">
                My Bookings
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white">
                    <div className="flex h-full w-full items-center justify-center rounded-full">
                      {user?.name?.charAt(0) || <User size={16} />}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <div className="p-2 text-sm font-medium border-b">
                    {user?.name || "User"}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setIsAuthDialogOpen(true)} className="bg-white text-purple-700 hover:bg-purple-100">
                  Login / Register
                </Button>
                <AuthDialog 
                  isOpen={isAuthDialogOpen}
                  onClose={() => setIsAuthDialogOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
