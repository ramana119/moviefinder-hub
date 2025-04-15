
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NavLogo: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <Link to="/" className="flex items-center space-x-2">
      <MapPin className="h-6 w-6 text-primary" />
      <span className="font-semibold">CrowdLess</span>
      {currentUser?.isPremium && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Premium Active</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Link>
  );
};

export default NavLogo;
