
import { useState } from "react";
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
  const [selectedLocation, setSelectedLocation] = useState<string>(localStorage.getItem("selectedLocation") || "New York");

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary mr-8">
              CineMagic
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-primary transition-colors">
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
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
                      {user?.name?.charAt(0) || <User size={16} />}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
                <Button variant="outline" onClick={() => setIsAuthDialogOpen(true)}>
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
