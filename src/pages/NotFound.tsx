
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-gray-700 mb-3">Page Not Found</p>
          <p className="text-gray-500 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">You were trying to access:</p>
            <div className="flex items-center justify-center p-2 bg-gray-100 rounded">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <code className="text-sm break-all">{location.pathname}</code>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
              <Link to="/">
                <Home className="w-4 h-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Looking for movies? <Link to="/" className="text-primary hover:underline">Browse our collection</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
