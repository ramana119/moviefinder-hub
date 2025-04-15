export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  completeProfile: (data: ProfileData) => Promise<void>;
  isProfileComplete: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileComplete?: boolean;
  premiumMember?: boolean;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface SignupData {
  email: string;
  password?: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
}

export interface DestinationContextType {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  getDestinationById: (id: string) => Destination | undefined;
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
}

export interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  numberOfTravelers: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  tripPlanId?: string;
}

export interface HotelType {
  id: string;
  destinationId: string;
  name: string;
  type: 'budget' | 'standard' | 'luxury';
  amenities: string[];
  pricePerPerson: number;
  rating: number;
  location?: {
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
    distanceFromCenter: number;
    proximityScore: number;
  };
  checkInTime?: string;
  checkOutTime?: string;
  contact?: string;
}

export interface TransportType {
  id: string;
  type: 'bus' | 'train' | 'flight' | 'car';
  amenities: string[];
  pricePerPerson: number;
}

export interface GuideType {
  id: string;
  destinationId: string;
  name: string;
  languages: string[];
  pricePerDay: number;
  rating: number;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  price?: number;
  attractions?: string[];
  tags?: string[];
}

export interface TripPlan {
  id: string;
  userId: string;
  selectedDestinations: string[];
  startDate: string;
  numberOfDays: number;
  numberOfPeople: number;
  transportType: 'bus' | 'train' | 'flight' | 'car';
  travelStyle?: 'base-hotel' | 'mobile';
  isPremium?: boolean;
  itinerary: TripItineraryDay[];
  selectedHotels: string[];
  hotelProximityScore?: number;
  createdAt: string;
}

export interface TripPlanningContextType {
  hotels: HotelType[];
  transports: TransportType[];
  guides: GuideType[];
  tripPlans: TripPlan[];
  loading: boolean;
  error: string | null;
  getHotelsByDestination: (destinationId: string) => HotelType[];
  getGuidesByDestination: (destinationId: string) => GuideType[];
  calculateTripCost: (options: {
    destinationIds: string[];
    guideIds: string[];
    hotelType: 'budget' | 'standard' | 'luxury';
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
    numberOfPeople: number;
  }) => {
    destinationsCost: number;
    hotelsCost: number;
    transportCost: number;
    guidesCost: number;
    totalCost: number;
  };
  saveTripPlan: (tripPlanData: Omit<TripPlan, 'id' | 'createdAt'>) => Promise<string>;
  getUserTripPlans: (userId: string) => TripPlan[];
  getTripPlanById: (id: string) => TripPlan | undefined;
  cancelTripPlan: (tripPlanId: string) => Promise<void>;
  checkTripFeasibility: (options: {
    destinationIds: string[];
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
  }) => {
    feasible: boolean;
    daysNeeded: number;
    daysShort?: number;
    breakdown: {
      destinationId: string;
      destinationName: string;
      daysNeeded: number;
      travelHoursToNext: number;
      travelDaysToNext: number;
    }[];
    totalDistance: number;
    totalTravelHours: number;
  };
  generateOptimalItinerary: (options: {
    destinationIds: string[];
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
    startDate: Date;
    travelStyle?: 'base-hotel' | 'mobile';
    isPremium?: boolean;
  }) => TripItineraryDay[];
  calculateDistanceBetweenDestinations: (from: Destination, to: Destination) => number;
  getDistanceMatrix: (destinationIds: string[]) => {
    fromId: string;
    toId: string;
    fromName: string;
    toName: string;
    distanceKm: number;
    travelTimesByTransport: {
      bus: number;
      train: number;
      flight: number;
      car: number;
    };
  }[];
  getSuggestedTransport: (destinationIds: string[], numberOfDays: number, isPremium?: boolean) => {
    recommendedType: 'bus' | 'train' | 'flight' | 'car';
    alternativeType: 'train' | 'car';
    reasoning: string;
    totalDistanceKm: number;
    totalTravelTimeHours: number;
    timeForSightseeing: number;
    isRealistic: boolean;
    premiumAdvantages?: string[];
  };
  getTransportAmenities: (type: string, isOvernight: boolean) => string[];
  getOptimalHotels: (destinationIds: string[]) => HotelType[];
  getNearbyHotels: (destinationId: string, limit?: number) => HotelType[];
  calculateHotelProximity: (hotel: HotelType, destination: Destination) => HotelType;
}

export interface TripItineraryDay {
  day: number;
  date: Date;
  destinationId: string;
  destinationName: string;
  activities: string[];
  isTransitDay: boolean;
  detailedSchedule: {
    time: string;
    activity: string;
    location: string;
  }[];
  hotels: string[];
}
