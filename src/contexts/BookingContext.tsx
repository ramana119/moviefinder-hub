
import { createContext, useState, useContext, ReactNode } from "react";
import { Movie, Showtime, Theater, Seat, Booking } from "../data/mockData";

type BookingContextType = {
  selectedMovie: Movie | null;
  selectedTheater: Theater | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  bookingTotal: number;
  userEmail: string;
  userName: string;
  bookingHistory: Booking[];
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedTheater: (theater: Theater | null) => void;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelectedSeats: () => void;
  setUserEmail: (email: string) => void;
  setUserName: (name: string) => void;
  completeBooking: () => string; // Returns booking ID
  clearBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);

  const selectSeat = (seat: Seat) => {
    if (seat.isBooked) return;
    
    // Check if seat is already selected
    if (selectedSeats.some(s => s.id === seat.id)) {
      return;
    }
    
    setSelectedSeats([...selectedSeats, {...seat, isSelected: true}]);
  };

  const deselectSeat = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter(seat => seat.id !== seatId));
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const calculateTotal = (): number => {
    if (!selectedShowtime) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      if (selectedShowtime) {
        switch (seat.type) {
          case 'standard':
            return total + selectedShowtime.price.standard;
          case 'premium':
            return total + selectedShowtime.price.premium;
          case 'vip':
            return total + selectedShowtime.price.vip;
          default:
            return total;
        }
      }
      return total;
    }, 0);
  };

  const bookingTotal = calculateTotal();

  const generateBookingId = () => {
    return 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generateBookingId()}`;
  };

  const completeBooking = (): string => {
    if (!selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
      throw new Error("Incomplete booking information");
    }
    
    const bookingId = generateBookingId();
    
    const newBooking: Booking = {
      id: bookingId,
      userId: "1", // Mock user ID
      movieId: selectedMovie.id,
      theaterId: selectedTheater.id,
      showtimeId: selectedShowtime.id,
      seats: selectedSeats,
      totalAmount: bookingTotal,
      bookingDate: new Date().toISOString(),
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      qrCode: generateQRCode()
    };
    
    setBookingHistory([...bookingHistory, newBooking]);
    
    // In a real app, we'd send this to the backend
    console.log("Booking completed:", newBooking);
    
    return bookingId;
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedShowtime(null);
    clearSelectedSeats();
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        selectedTheater,
        selectedShowtime,
        selectedSeats,
        bookingTotal,
        userEmail,
        userName,
        bookingHistory,
        setSelectedMovie,
        setSelectedTheater,
        setSelectedShowtime,
        selectSeat,
        deselectSeat,
        clearSelectedSeats,
        setUserEmail,
        setUserName,
        completeBooking,
        clearBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
