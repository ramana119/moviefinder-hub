
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

interface EmailTicketProps {
  ticketId: string;
  movieTitle: string;
  showtime: string;
  date: string;
  defaultEmail?: string;
}

const EmailTicket = ({ ticketId, movieTitle, showtime, date, defaultEmail = "" }: EmailTicketProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Success",
        description: `Ticket for "${movieTitle}" has been sent to ${email}`,
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSendEmail} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ticket-email">Email Ticket</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="ticket-email"
              type="email"
              placeholder="Enter email address"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSending}>
            {isSending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        We'll send ticket #{ticketId} for {movieTitle} on {date} at {showtime} to the provided email.
      </p>
    </form>
  );
};

export default EmailTicket;
