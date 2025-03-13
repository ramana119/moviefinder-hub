
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, LogIn, Phone, CheckSquare, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface UserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  verified: boolean;
  emailOtp?: string;
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
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
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
    
    // Simulate API call to check credentials against stored data
    setTimeout(() => {
      setIsLoading(false);
      
      // Check local storage for users
      const usersJSON = localStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      const user = users.find((u: UserData) => u.email === loginData.email);
      
      if (!user) {
        toast({
          title: "Error",
          description: "No account found with this email. Please sign up first.",
          variant: "destructive",
        });
        return;
      }
      
      if (user.password !== loginData.password) {
        toast({
          title: "Error",
          description: "Incorrect password",
          variant: "destructive",
        });
        return;
      }
      
      onLogin(user);
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

    // Generate random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSignupData({...signupData, emailOtp: randomOtp});
    
    // Show OTP input
    setShowOtpInput(true);
    
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${signupData.email}. For this demo, your OTP is: ${randomOtp}`,
    });
  };

  const verifyOtp = () => {
    if (otp === signupData.emailOtp) {
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        
        // Save user data to localStorage
        const usersJSON = localStorage.getItem("users");
        const users = usersJSON ? JSON.parse(usersJSON) : [];
        users.push({...signupData, verified: false});
        localStorage.setItem("users", JSON.stringify(users));
        
        // Set verified to false initially - would send email verification in real app
        const userData = {...signupData, verified: false};
        onSignup(userData);
        
        toast({
          title: "Success",
          description: "Your account has been created successfully. Please verify your email.",
        });
        onClose();
      }, 1000);
    } else {
      toast({
        title: "Error",
        description: "Incorrect OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-xl w-full max-w-md p-6"
    >
      {!showOtpInput ? (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6 bg-gray-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Your email"
                    className="pl-10 border-gray-700 bg-gray-800 focus:border-primary"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    className="pl-10 border-gray-700 bg-gray-800 focus:border-primary"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
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
                  <User className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    className="pl-10 border-gray-700 bg-gray-800 focus:border-primary"
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Your email"
                    className="pl-10 border-gray-700 bg-gray-800 focus:border-primary"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="pl-10 border-gray-700 bg-gray-800 focus:border-primary"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10 border-gray-700 bg-gray-800 focus:border-primary"
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
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  I accept the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
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
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-2" />
            <h2 className="text-xl font-bold mb-1">Email Verification</h2>
            <p className="text-muted-foreground text-sm mb-4">
              We've sent a 6-digit code to {signupData.email}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otp">Enter Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="6-digit code"
              className="text-center border-gray-700 bg-gray-800 focus:border-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          <Button 
            onClick={verifyOtp} 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Didn't receive the code? <a href="#" className="text-primary hover:underline">Resend</a>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default UserAuth;
