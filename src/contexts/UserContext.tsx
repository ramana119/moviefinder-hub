
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
  updateProfile: (userData: Partial<UserData>) => void;
  verifyEmail: () => void;
  isProfileComplete: () => boolean;
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
    // In a real app, you would store this in a database
    const newUser = {...userData, verified: false};
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully. Please verify your email.",
      variant: "default",
    });
    
    // Add the user to the "database" (localStorage in this case)
    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
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

  const isProfileComplete = () => {
    if (!user) return false;
    return !!(user.name && user.email && user.phone);
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return false;
    }
    
    // Check if profile is complete with name, email, and phone
    if (!isProfileComplete()) {
      toast({
        title: "Complete Your Profile",
        description: "Please complete your profile before proceeding.",
        variant: "destructive",
      });
      
      // Trigger the profile dialog
      const event = new CustomEvent('openAuthDialog');
      window.dispatchEvent(event);
      return false;
    }
    
    // If email verification is required for payment, check here
    if (window.location.pathname.includes('/checkout') && user && !user.verified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email before proceeding to payment.",
        variant: "destructive",
      });
      
      // Trigger the profile dialog
      const event = new CustomEvent('openAuthDialog');
      window.dispatchEvent(event);
      return false;
    }
    
    return true;
  };

  const updateProfile = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Also update in the "database"
      const usersJSON = localStorage.getItem("users");
      if (usersJSON) {
        const users = JSON.parse(usersJSON);
        const updatedUsers = users.map((u: UserData) => 
          u.email === user.email ? { ...u, ...userData } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    }
  };

  const verifyEmail = () => {
    if (user) {
      const verifiedUser = { ...user, verified: true };
      setUser(verifiedUser);
      localStorage.setItem("user", JSON.stringify(verifiedUser));
      
      // Also update in the "database"
      const usersJSON = localStorage.getItem("users");
      if (usersJSON) {
        const users = JSON.parse(usersJSON);
        const updatedUsers = users.map((u: UserData) => 
          u.email === user.email ? { ...u, verified: true } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
      
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully",
        variant: "default",
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      redirectToLogin,
      requireAuth,
      updateProfile,
      verifyEmail,
      isProfileComplete
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
