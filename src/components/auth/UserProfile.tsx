
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
  SendIcon,
  ShieldCheck
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { UserData } from "./UserAuth";
import BookingHistory from "./BookingHistory";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  user: UserData | null;
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile = ({ user, onLogout, onClose }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const { verifyEmail, updateProfile } = useUser();
  const { toast } = useToast();
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  
  const handleVerifyEmail = () => {
    setIsVerifying(true);
    // Generate a random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailOtp(randomOtp);
    
    toast({
      title: "OTP Sent",
      description: `For demo purposes, your OTP is: ${randomOtp}`,
    });
  };
  
  const confirmVerification = () => {
    if (otp === emailOtp) {
      verifyEmail();
      setIsVerifying(false);
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully",
      });
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!user) return null;
  
  const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase();
  
  const isProfileComplete = user.name && user.email && user.phone;
  
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">My Account</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1 border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/30"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
      
      {isVerifying ? (
        <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-2" />
            <h3 className="text-xl font-bold mb-1">Email Verification</h3>
            <p className="text-muted-foreground text-sm mb-4">
              We've sent a verification code to {user.email}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Enter Verification Code</label>
            <Input
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center border-gray-700 bg-gray-800"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsVerifying(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={confirmVerification}
              disabled={otp.length !== 6}
            >
              Verify
            </Button>
          </div>
        </div>
      ) : (
        <Tabs 
          defaultValue="profile" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6 bg-gray-800">
            <TabsTrigger value="profile" className="flex gap-1 items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex gap-1 items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Ticket className="w-4 h-4" />
              Bookings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            {!isProfileComplete && (
              <div className="p-3 bg-amber-900/20 border border-amber-800 rounded text-amber-400 text-sm mb-4">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Please complete your profile to book tickets
              </div>
            )}

            {isProfileComplete && !user.verified && (
              <div className="p-3 bg-amber-900/20 border border-amber-800 rounded text-amber-400 text-sm mb-4">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Please verify your email address to make payments
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="w-20 h-20 border-2 border-gray-700">
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <p className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</p>
                  {user.verified ? (
                    <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Unverified
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs bg-amber-900/20 text-amber-400 border-amber-800 hover:bg-amber-900/30"
                        onClick={handleVerifyEmail}
                      >
                        <SendIcon className="h-3 w-3 mr-1" /> Verify Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="space-y-4 bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                className="w-full gap-1 bg-primary hover:bg-primary/90"
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
      )}
    </div>
  );
};

export default UserProfile;
