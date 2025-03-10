
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserAuth from "./UserAuth";
import { useUser } from "@/contexts/UserContext";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const { login, signup } = useUser();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <UserAuth
          onLogin={login}
          onSignup={signup}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
