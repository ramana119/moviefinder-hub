
import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  Ticket,
  Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserData } from "./UserAuth";
import BookingHistory from "./BookingHistory";

interface UserProfileProps {
  user: UserData | null;
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile = ({ user, onLogout, onClose }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  
  if (!user) return null;
  
  const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase();
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">My Account</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
      
      <Tabs 
        defaultValue="profile" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="profile" className="flex gap-1 items-center">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex gap-1 items-center">
            <Ticket className="w-4 h-4" />
            Bookings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{user.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
