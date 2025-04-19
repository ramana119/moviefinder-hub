
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

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
    if (!isLoading && isAuthenticated && currentUser && !currentUser.profileComplete) {
      console.log("Redirecting to profile completion page from 404");
      setTimeout(() => {
        navigate("/complete-profile", { replace: true });
      }, 500);
    }
  }, [location.pathname, isAuthenticated, currentUser, navigate, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          
          {isAuthenticated && currentUser && !currentUser.profileComplete && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Profile Incomplete</AlertTitle>
              <AlertDescription>
                Please complete your profile to unlock all features.
                You'll be redirected to profile completion page.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
            
            {isAuthenticated && currentUser && !currentUser.profileComplete && (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate("/complete-profile")}
              >
                Complete Your Profile
              </Button>
            )}
            
            {isAuthenticated && (
              <Button 
                className="w-full" 
                variant="ghost"
                onClick={() => navigate("/bookings")}
              >
                View My Bookings
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
