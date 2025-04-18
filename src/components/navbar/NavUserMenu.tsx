
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Settings, CalendarDays, Star, Map, MapPin } from 'lucide-react';

interface NavUserMenuProps {
  isMobileView?: boolean;
  onItemClick?: () => void;
}

const NavUserMenu: React.FC<NavUserMenuProps> = ({ 
  isMobileView = false,
  onItemClick = () => {}
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!currentUser) return null;
  
  // Use name or construct fullName from firstName and lastName
  const userName = currentUser.fullName || 
    `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 
    currentUser.name || 
    currentUser.email.split('@')[0];
  
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  const handleLogout = () => {
    logout();
    navigate('/');
    if (onItemClick) onItemClick();
  };

  if (isMobileView) {
    return (
      <>
        <Link
          to="/trip-planner"
          className="px-2 py-2 rounded-md text-gray-700"
          onClick={onItemClick}
        >
          <Map className="h-4 w-4 inline mr-1" />
          Plan Your Trip
        </Link>
        <Link
          to="/bookings"
          className="px-2 py-2 rounded-md text-gray-700"
          onClick={onItemClick}
        >
          <MapPin className="h-4 w-4 inline mr-1" />
          My Bookings
        </Link>
        <button
          onClick={handleLogout}
          className="px-2 py-2 text-left rounded-md text-gray-700 w-full"
        >
          <LogOut className="h-4 w-4 inline mr-1" />
          Log Out
        </button>
      </>
    );
  }
  
  // Desktop view
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {currentUser.isPremium && (
            <span className="absolute -top-1 -right-1">
              <Badge className="h-4 w-4 rounded-full p-0 flex items-center justify-center bg-yellow-500">
                <Star className="h-3 w-3 text-white" />
              </Badge>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="font-normal text-sm text-muted-foreground">Signed in as</span>
          <p className="font-medium">{userName}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          navigate('/profile');
          if (onItemClick) onItemClick();
        }}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          navigate('/bookings');
          if (onItemClick) onItemClick();
        }}>
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>My Bookings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          navigate('/profile#settings');
          if (onItemClick) onItemClick();
        }}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUserMenu;
