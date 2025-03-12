import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/components/auth/UserAuth";
import { useToast } from "@/hooks/use-toast";

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (userData: UserData) => void;
  signup: (userData: UserData) => void;
  logout: () => void;
  redirectToLogin: () => void;
  requireAuth: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for existing user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast({
      title: "Welcome back!",
      description: `You're now logged in as ${userData.name}`,
    });
  };

  const signup = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully",
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const redirectToLogin = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in to continue.",
      variant: "destructive",
    });
    
    // If already on the homepage, just trigger the login dialog
    // Otherwise, navigate to the homepage first
    if (window.location.pathname !== '/') {
      navigate("/");
    }
    
    // Trigger the authentication dialog from Navbar
    const event = new CustomEvent('openAuthDialog');
    window.dispatchEvent(event);
    return false;
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return false;
    }
    return true;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      redirectToLogin,
      requireAuth 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
