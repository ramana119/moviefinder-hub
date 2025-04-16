
import { TripPlan } from './trip-plan';

export interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  checkIn?: string;
  timeSlot?: string;
  visitors?: number;
  totalAmount?: number;
  ticketType?: string;
  status?: 'confirmed' | 'cancelled';
  createdAt: string;
  tripPlanId?: string;
  numberOfTravelers: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  bookTrip: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Promise<string>;
  getBookingsByUserId: (userId: string) => Booking[];
  getBookingById: (id: string) => Booking | undefined;
  cancelBooking: (bookingId: string) => Promise<void>;
  saveTripPlan: (tripPlan: TripPlan) => Promise<void>;
  addBooking: (bookingData: any) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  getUserTripPlans: (userId: string) => TripPlan[];
}
