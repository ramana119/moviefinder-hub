
// Import updated types
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Booking, 
  BookingContextType, 
  TripPlan
} from '../types';
import { useToast } from '../hooks/use-toast';

// Create the BookingContext
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// BookingProvider component
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize bookings from localStorage
  React.useEffect(() => {
    try {
      const storedBookings = window.localStorage.getItem('bookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error('Failed to load bookings from localStorage', error);
    }
  }, []);

  // Save bookings to localStorage when they change
  React.useEffect(() => {
    if (bookings.length > 0) {
      window.localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  // Book a trip
  const bookTrip = useCallback(async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const newBooking: Booking = {
        ...bookingData,
        id: `booking_${uuidv4()}`,
        createdAt: new Date().toISOString(),
      };

      // Save to state
      setBookings(prev => [...prev, newBooking]);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success toast
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${newBooking.numberOfTravelers} travelers has been confirmed.`,
      });

      return newBooking.id;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to book trip';
      setError(errorMessage);
      
      // Error toast
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get bookings by user ID
  const getBookingsByUserId = useCallback((userId: string): Booking[] => {
    return bookings.filter(booking => booking.userId === userId);
  }, [bookings]);

  // Get booking by ID
  const getBookingById = useCallback((id: string): Booking | undefined => {
    return bookings.find(booking => booking.id === id);
  }, [bookings]);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }

      // Create updated booking with cancelled status
      const updatedBooking: Booking = {
        ...bookings[bookingIndex],
        status: 'cancelled',
      };

      // Update the bookings array
      const updatedBookings = [...bookings];
      updatedBookings[bookingIndex] = updatedBooking;
      setBookings(updatedBookings);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Success toast
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to cancel booking';
      setError(errorMessage);
      
      // Error toast
      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [bookings, toast]);

  // Get user bookings (alias for getBookingsByUserId for compatibility)
  const getUserBookings = useCallback((userId: string): Booking[] => {
    return getBookingsByUserId(userId);
  }, [getBookingsByUserId]);

  // Get user trip plans
  const getUserTripPlans = useCallback((userId: string): TripPlan[] => {
    // Find all bookings with tripPlanId
    const userBookingsWithTripPlan = bookings.filter(
      booking => booking.userId === userId && booking.tripPlanId
    );
    
    // Load trip plans from localStorage
    return userBookingsWithTripPlan.map(booking => {
      const tripPlanKey = `trip_plan_${booking.tripPlanId}`;
      const tripPlanJson = localStorage.getItem(tripPlanKey);
      return tripPlanJson ? JSON.parse(tripPlanJson) : null;
    }).filter(Boolean) as TripPlan[];
  }, [bookings]);

  // Add booking (for direct booking without trip plan)
  const addBooking = useCallback(async (bookingData: any): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const newBooking: Booking = {
        ...bookingData,
        id: `booking_${uuidv4()}`,
        createdAt: new Date().toISOString(),
        numberOfTravelers: bookingData.visitors || 1,
        startDate: bookingData.checkIn || new Date().toISOString(),
        endDate: bookingData.checkIn || new Date().toISOString(),
        totalPrice: bookingData.totalAmount || 0
      };

      // Save to state
      setBookings(prev => [...prev, newBooking]);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success toast
      toast({
        title: "Booking Confirmed!",
        description: `Your booking has been confirmed successfully.`,
      });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to add booking';
      setError(errorMessage);
      
      // Error toast
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save trip plan as a booking record
  const saveTripPlan = useCallback(async (tripPlan: TripPlan): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Create a booking record from the trip plan
      const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
        userId: tripPlan.userId,
        destinationId: tripPlan.selectedDestinations[0], // Use the first destination
        numberOfTravelers: tripPlan.numberOfPeople,
        startDate: tripPlan.startDate,
        endDate: tripPlan.endDate || '',
        totalPrice: tripPlan.totalCost || 0,
        tripPlanId: tripPlan.id,
      };

      // Add the booking record
      const newBookingId = await bookTrip(bookingData);
      
      // Store trip plan in localStorage
      localStorage.setItem(`trip_plan_${tripPlan.id}`, JSON.stringify(tripPlan));
      
      // Success toast
      toast({
        title: "Trip Plan Saved",
        description: "Your trip plan has been saved and booked successfully.",
      });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to save trip plan';
      setError(errorMessage);
      
      // Error toast
      toast({
        title: "Trip Plan Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [bookTrip, toast]);

  // Provide the booking context
  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        error,
        bookTrip,
        getBookingsByUserId,
        getBookingById,
        cancelBooking,
        saveTripPlan,
        addBooking,
        getUserBookings,
        getUserTripPlans,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use the BookingContext
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
