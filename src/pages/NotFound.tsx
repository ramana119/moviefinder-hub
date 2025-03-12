
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
