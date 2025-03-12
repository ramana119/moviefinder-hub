
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, LogIn, Phone, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface UserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  verified: boolean;
}

interface UserAuthProps {
  onLogin: (userData: UserData) => void;
  onSignup: (userData: UserData) => void;
  onClose: () => void;
}

const UserAuth = ({ onLogin, onSignup, onClose }: UserAuthProps) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loginData, setLoginData] = useState<{email: string; password: string}>({ email: "", password: "" });
  const [signupData, setSignupData] = useState<UserData>({ 
    name: "", 
    email: "", 
    password: "", 
    phone: "",
    verified: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would verify credentials here
      onLogin({
        ...loginData, 
        name: "User Name", // This would come from backend in real app
        phone: "", // This would come from backend in real app
        verified: true // This would come from backend in real app
      });
      toast({
        title: "Success",
        description: "You've been logged in successfully",
      });
      onClose();
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Set verified to false initially - would send email verification in real app
      const userData = {...signupData, verified: false};
      onSignup(userData);
      
      toast({
        title: "Success",
        description: "Your account has been created successfully. Please verify your email.",
      });
      onClose();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-b from-indigo-50 to-white rounded-lg shadow-xl w-full max-w-md p-6"
    >
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6 bg-indigo-100">
          <TabsTrigger value="login" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Login</TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Your email"
                  className="pl-10 border-indigo-200 focus:border-indigo-400"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Your password"
                  className="pl-10 border-indigo-200 focus:border-indigo-400"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  className="pl-10 border-indigo-200 focus:border-indigo-400"
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Your email"
                  className="pl-10 border-indigo-200 focus:border-indigo-400"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Your phone number"
                  className="pl-10 border-indigo-200 focus:border-indigo-400"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10 border-indigo-200 focus:border-indigo-400"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default UserAuth;
