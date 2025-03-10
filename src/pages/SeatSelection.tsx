
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Info,
  Clock,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import AuthDialog from "@/components/auth/AuthDialog";
import { movies, theaters, showtimes, getMovieById, getShowtimeById, getTheaterById } from "@/data/mockData";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: "regular" | "premium" | "vip";
  price: number;
  status: "available" | "booked" | "selected";
}

const SeatSelection = () => {
  const { movieId, showtimeId } = useParams<{ movieId: string; showtimeId: string }>();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || "";
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useUser();
  
  const [movie, setMovie] = useState(movies[0]);
  const [showtime, setShowtime] = useState(showtimes[0]);
  const [theater, setTheater] = useState(theaters[0]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
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
    
    // Generate seat map
    generateSeats();
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [movieId, showtimeId]);
  
  const generateSeats = () => {
    const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
    const seatsPerRow = 16;
    const generatedSeats: Seat[] = [];
    
    seatRows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        // Skip some seats to create walking space in the middle
        if (i === 5 || i === 12) continue;
        
        // Determine seat type and price
        let type: "regular" | "premium" | "vip" = "regular";
        let price = 150;
        
        if (row >= "F" && row <= "H") {
          type = "premium";
          price = 250;
        } else if (row >= "J") {
          type = "vip";
          price = 350;
        }
        
        // Randomly mark some seats as booked
        const randomStatus = Math.random() < 0.2 ? "booked" : "available";
        
        generatedSeats.push({
          id: `${row}${i}`,
          row,
          number: i,
          type,
          price,
          status: randomStatus
        });
      }
    });
    
    setSeats(generatedSeats);
  };
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked") return;
    
    setSeats(prevSeats => 
      prevSeats.map(s => 
        s.id === seat.id 
          ? { ...s, status: s.status === "selected" ? "available" : "selected" }
          : s
      )
    );
    
    setSelectedSeats(prevSelected => {
      const isAlreadySelected = prevSelected.some(s => s.id === seat.id);
      
      if (isAlreadySelected) {
        return prevSelected.filter(s => s.id !== seat.id);
      } else {
        return [...prevSelected, { ...seat, status: "selected" }];
      }
    });
  };
  
  const getTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };
  
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed",
        variant: "destructive"
      });
      return;
    }
    
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    // In a real app, you would save the booking details to context/state
    // and then redirect to the checkout page
    navigate(`/checkout/${movieId}/${showtimeId}?date=${date}&seats=${selectedSeats.map(s => s.id).join(',')}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header with basic info */}
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
            <h1 className="text-2xl font-bold">{movie.title}</h1>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{showtime.time}</span>
            </div>
            <div>
              <span className="font-medium">{theater.name}</span>
              <span className="text-gray-500 ml-1">({showtime.format})</span>
            </div>
          </div>
          
          {/* Seat map */}
          <div className="max-w-4xl mx-auto mb-12">
            {/* Screen */}
            <div className="relative mb-16">
              <div className="h-8 bg-gradient-to-b from-gray-300 to-transparent rounded-t-lg mb-1"></div>
              <div className="h-1 bg-gray-400 w-full rounded-full"></div>
              <p className="absolute top-full left-1/2 transform -translate-x-1/2 text-gray-500 text-sm mt-2">SCREEN</p>
            </div>
            
            {/* Seat legend */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded mr-2"></div>
                <span className="text-xs">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
                <span className="text-xs">Booked</span>
              </div>
            </div>
            
            {/* Price legend */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-3 h-3 border border-gray-300 rounded mr-2"></div>
                <span className="text-xs">Regular (₹150)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border border-blue-300 rounded mr-2"></div>
                <span className="text-xs">Premium (₹250)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border border-violet-300 rounded mr-2"></div>
                <span className="text-xs">VIP (₹350)</span>
              </div>
            </div>
            
            {/* Seat grid - UPDATED with smaller seats */}
            <div className="grid grid-rows-10 gap-y-1 mb-8">
              {Array.from(new Set(seats.map(seat => seat.row))).map(row => (
                <div key={row} className="flex items-center">
                  <div className="w-4 text-center text-gray-500 text-xs font-medium mr-1">
                    {row}
                  </div>
                  <div className="flex-1 grid grid-cols-18 gap-x-0.5">
                    {seats
                      .filter(seat => seat.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map(seat => (
                        <motion.button
                          key={seat.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            w-full aspect-square rounded-sm flex items-center justify-center text-[10px]
                            ${seat.status === "booked" ? "bg-gray-400 cursor-not-allowed" : ""}
                            ${seat.status === "selected" ? "bg-primary text-white" : ""}
                            ${seat.status === "available" ? "bg-gray-200 hover:bg-gray-300" : ""}
                            ${seat.type === "premium" ? "border border-blue-300" : ""}
                            ${seat.type === "vip" ? "border border-violet-300" : ""}
                            ${seat.type === "regular" ? "border border-gray-300" : ""}
                          `}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === "booked"}
                        >
                          {seat.number}
                        </motion.button>
                      ))}
                  </div>
                  <div className="w-4 text-center text-gray-500 text-xs font-medium ml-1">
                    {row}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating bottom bar with summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-500 text-sm">Selected Seats: {selectedSeats.length}</p>
            <div className="font-bold text-xl">Total: ₹{getTotal().toLocaleString()}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedSeats.map(seat => (
                <span key={seat.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {seat.id}
                </span>
              ))}
            </div>
          </div>
          <Button 
            className="w-full sm:w-auto"
            disabled={selectedSeats.length === 0}
            onClick={handleProceed}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
      
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
      
      <Footer />
    </div>
  );
};

export default SeatSelection;
