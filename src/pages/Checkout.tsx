import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard,
  Calendar,
  Clock,
  CircleCheck,
  MapPin,
  Ticket,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EmailTicket from "@/components/checkout/EmailTicket";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { movies, theaters, showtimes, getMovieById, getShowtimeById, getTheaterById } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";

const Checkout = () => {
  const { movieId, showtimeId } = useParams<{ movieId: string; showtimeId: string }>();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || "";
  const seatsParam = searchParams.get("seats") || "";
  const selectedSeatIds = seatsParam.split(",");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useUser();
  
  const [movie, setMovie] = useState(movies[0]);
  const [showtime, setShowtime] = useState(showtimes[0]);
  const [theater, setTheater] = useState(theaters[0]);
  const [loading, setLoading] = useState(true);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  
  const seatPrice = 150; // In a real app, this would be calculated from the selected seats
  
  useEffect(() => {
    setLoading(true);
    
    // Find movie, showtime, and theater
    const foundMovie = getMovieById(movieId || '');
    const foundShowtime = getShowtimeById(showtimeId || '');
    
    if (foundMovie) setMovie(foundMovie);
    if (foundShowtime) {
      setShowtime(foundShowtime);
      const foundTheater = getTheaterById(foundShowtime.theaterId);
      if (foundTheater) setTheater(foundTheater);
    }
    
    // Populate email from user context if available
    if (user?.email) {
      setEmail(user.email);
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [movieId, showtimeId, user]);
  
  const calculateTotal = () => {
    const baseTotal = selectedSeatIds.length * seatPrice;
    const convenienceFee = Math.round(baseTotal * 0.1); // 10% convenience fee
    return {
      baseTotal,
      convenienceFee,
      grandTotal: baseTotal + convenienceFee
    };
  };
  
  const handlePayment = () => {
    if (!email || !phone || !acceptTerms) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and accept the terms.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsBookingComplete(true);
      
      // Generate a random ticket ID
      setTicketId(`CIN${Math.floor(Math.random() * 10000000)}`);
      
      toast({
        title: "Booking successful!",
        description: "Your tickets have been booked successfully.",
        variant: "default"
      });
    }, 2000);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (isBookingComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl p-8 text-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CircleCheck className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-8">Your tickets have been booked successfully.</p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold">{movie.title}</h2>
                    <div className="text-gray-600">{showtime.format}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">Booking ID</div>
                    <div className="text-gray-600">#{ticketId}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Date</div>
                    <div className="text-gray-600">{date}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Time</div>
                    <div className="text-gray-600">{showtime.time}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Theater</div>
                    <div className="text-gray-600">{theater.name}</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg mb-6">
                  <div className="font-medium mb-2">Seats</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeatIds.map(seatId => (
                      <span key={seatId} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                        {seatId}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().grandTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="#" download="ticket.pdf">
                    <Ticket className="w-4 h-4 mr-2" />
                    Download Ticket
                  </a>
                </Button>
                <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Ticket via Email</DialogTitle>
                    </DialogHeader>
                    <EmailTicket 
                      ticketId={ticketId}
                      movieTitle={movie.title}
                      showtime={showtime.time}
                      date={date}
                      defaultEmail={email}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  View My Bookings
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Booking details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                
                <div className="flex mb-4">
                  <div className="w-24 h-36 bg-gray-200 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{movie.title}</h3>
                    <p className="text-sm text-gray-600">{showtime.format}</p>
                    
                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{showtime.time}</span>
                      </div>
                      <div className="flex items-center col-span-2 mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{theater.name}, {theater.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <h3 className="font-medium mb-2">Selected Seats ({selectedSeatIds.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeatIds.map(seatId => (
                      <span key={seatId} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {seatId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Your booking confirmation and tickets will be sent to this email address.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <div className="border rounded-lg p-4 flex items-center mb-4">
                  <input
                    type="radio"
                    id="card-payment"
                    name="payment-method"
                    className="mr-3"
                    checked
                    readOnly
                  />
                  <label htmlFor="card-payment" className="flex items-center cursor-pointer">
                    <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Mock Payment (For Demo)</span>
                  </label>
                </div>
                
                <div className="flex items-start mb-4">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-gray-600 leading-relaxed"
                  >
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Right side - Price breakdown */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Price Details</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tickets ({selectedSeatIds.length} × ₹{seatPrice})</span>
                    <span>₹{calculateTotal().baseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>₹{calculateTotal().convenienceFee.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal().grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="promo" className="block text-sm font-medium mb-1">
                    Apply Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handlePayment}
                  disabled={isPaymentProcessing}
                >
                  {isPaymentProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Pay ₹" + calculateTotal().grandTotal.toLocaleString()
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  This is a demo application. No actual payment will be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
