
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    // Log detailed information about the not found route
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Authentication status:",
      isAuthenticated ? "Authenticated" : "Not Authenticated",
      "User profile status:",
      currentUser?.profileComplete ? "Complete" : "Incomplete"
    );
    
    // Redirect users to complete profile if authenticated but profile not complete
    if (isAuthenticated && currentUser && !currentUser.profileComplete) {
      console.log("Redirecting to profile completion page from 404");
      navigate("/complete-profile", { replace: true });
    }
  }, [location.pathname, isAuthenticated, currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Button 
          className="mt-4 bg-primary hover:bg-primary/90" 
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
        {isAuthenticated && currentUser && !currentUser.profileComplete && (
          <Button 
            className="mt-4 ml-2" 
            variant="outline"
            onClick={() => navigate("/complete-profile")}
          >
            Complete Your Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
