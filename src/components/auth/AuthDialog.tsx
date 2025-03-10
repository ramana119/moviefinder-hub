
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAuth from "./UserAuth";
import UserProfile from "./UserProfile";
import { useUser } from "@/contexts/UserContext";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const { user, isAuthenticated, login, signup, logout } = useUser();
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        {isAuthenticated ? (
          <UserProfile user={user} onLogout={logout} onClose={onClose} />
        ) : (
          <UserAuth
            onLogin={login}
            onSignup={signup}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
