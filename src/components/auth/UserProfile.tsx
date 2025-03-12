
import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  Ticket,
  Settings,
  CheckCircle,
  AlertCircle,
  SendIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserData } from "./UserAuth";
import BookingHistory from "./BookingHistory";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";

interface UserProfileProps {
  user: UserData | null;
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile = ({ user, onLogout, onClose }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { verifyEmail } = useUser();
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  
  const handleVerifyEmail = () => {
    verifyEmail();
  };
  
  if (!user) return null;
  
  const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase();
  
  return (
    <div className="p-6 bg-gradient-to-b from-purple-50 to-indigo-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-purple-800">My Account</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
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
        <TabsList className="grid grid-cols-2 mb-6 bg-purple-100">
          <TabsTrigger value="profile" className="flex gap-1 items-center data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex gap-1 items-center data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Ticket className="w-4 h-4" />
            Bookings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <Avatar className="w-20 h-20 border-2 border-purple-200">
              <AvatarFallback className="text-xl bg-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <p className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</p>
                {user.verified ? (
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Unverified
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                      onClick={handleVerifyEmail}
                    >
                      <SendIcon className="h-3 w-3 mr-1" /> Verify Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator className="bg-purple-100" />
          
          <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{user.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              className="w-full gap-1 bg-purple-600 hover:bg-purple-700"
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
