
// src/types/index.ts
export interface Destination {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  rating: number;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  attractions?: string[];
  photography?: boolean;
  crowdData?: CrowdData;
  image?: string;
  images: string[];
  price?: number;
  tags?: string[];
}

export interface HotelType {
  id: string;
  name: string;
  destinationId: string;
  type: 'budget' | 'standard' | 'luxury';
  pricePerNight: number;
  pricePerPerson: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
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
  name?: string;
  type: 'bus' | 'train' | 'flight' | 'car';
  pricePerPerson: number;
  travelTime?: number;
  amenities: string[];
  busClass?: string;
  seatType?: string;
  class?: string;
  berthOption?: string;
  cabinClass?: string;
  baggageAllowance?: string;
  carType?: string;
  transmission?: string;
  operator?: string;
  airline?: string;
  rentalCompany?: string;
  estimatedDuration?: string;
}

export interface GuideType {
  id: string;
  name: string;
  destinationId: string;
  pricePerDay: number;
  languages: string[];
  imageUrl: string;
  rating: number;
  experience?: number;
}

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

export interface TripPlan {
  id: string;
  userId: string;
  selectedDestinations: string[];
  startDate: string;
  endDate?: string;
  numberOfDays: number;
  numberOfPeople: number;
  hotelType?: 'budget' | 'standard' | 'luxury';
  selectedTransport?: string;
  transportType: 'bus' | 'train' | 'flight' | 'car';
  guideIds?: string[];
  totalCost?: number;
  status?: 'planning' | 'confirmed' | 'cancelled';
  createdAt: string;
  isPremium?: boolean;
  sleepTransport?: boolean;
  travelStyle?: 'base-hotel' | 'mobile';
  photos?: string[];
  itinerary?: TripItineraryDay[];
  selectedHotels?: string[];
  hotelProximityScore?: number;
}

export interface TripItineraryDay {
  day: number;
  date: Date;
  destinationId: string;
  destinationName: string;
  activities: string[];
  isTransitDay: boolean;
  departureTime?: string;
  arrivalTime?: string;
  transportDetails?: {
    vehicle: string;
    duration: string;
    amenities: string[];
  };
  freshUpStops?: {
    time: string;
    location: string;
  }[];
  detailedSchedule: {
    time: string;
    activity: string;
    location: string;
    notes?: string;
  }[];
  hotels: string[];
}

export type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'bookings' | 'profileComplete'>) => Promise<void>;
  logout: () => void;
  completeProfile: (profileData: User['profileData']) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  cancelPremium: () => Promise<void>;
  withdrawPremium: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  bookings?: string[];
  profileComplete?: boolean;
  isPremium?: boolean;
  premiumPurchaseDate?: string;
  refundPercentage?: number;
  withdrawalDate?: string;
  profileData?: {
    address?: string;
    phone?: string;
    dob?: string;
    preferredDestinations?: string[];
    travelFrequency?: string;
  };
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export type CrowdLevel = 'low' | 'medium' | 'high';

export interface CrowdData {
  [time: string]: number;
}

export interface DestinationFilters {
  crowdLevel: CrowdLevel | null;
  state: string | null;
  minPrice: number;
  maxPrice: number;
}

export interface DestinationContextType {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  getDestinationById: (id: string) => Destination | undefined;
  getCurrentCrowdLevel: (crowdData?: CrowdData) => CrowdLevel;
  getBestTimeToVisit: (crowdData?: CrowdData) => string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  filters?: DestinationFilters;
  setFilters?: (filters: Partial<DestinationFilters>) => void;
  clearFilters?: () => void;
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
