
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
  name?: string;
  fullName?: string;
  password?: string;
  bookings?: string[];
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
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface SignupData {
  email: string;
  password?: string;
  fullName?: string;
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
  getCurrentCrowdLevel?: (crowdData?: CrowdData) => CrowdLevel;
  getBestTimeToVisit?: (crowdData?: CrowdData) => string;
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
  checkIn?: string;
  timeSlot?: string;
  visitors?: number;
  ticketType?: string;
  totalAmount?: number;
  status?: 'confirmed' | 'cancelled';
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
    nearbyAttractions?: string[];
  };
  checkInTime?: string;
  checkOutTime?: string;
  contact?: string;
  pricePerNight?: number;
  imageUrl?: string;
}

export interface TransportType {
  id: string;
  name: string;
  type: 'bus' | 'train' | 'flight' | 'car';
  pricePerPerson: number;
  travelTime: number;
  amenities: string[];
  transportClass: BusType | TrainType | FlightType | CarType;
  operator?: string;
  departureTime?: string;
  arrivalTime?: string;
  totalSeats?: number;
  availableSeats?: number;
  rating?: number;
  cancellationPolicy?: string;
}

export interface GuideType {
  id: string;
  name: string;
  destinationId: string;
  pricePerDay: number;
  languages: string[];
  imageUrl: string;
  rating: number;
  experience: number;
  specialties?: string[];
  availability?: string[];
  reviews?: {
    rating: number;
    comment: string;
    userId: string;
  }[];
  image?: string; // For backward compatibility
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  price?: number;
  attractions?: string[];
  tags?: string[];
  rating?: number;
  crowdData?: {
    [time: string]: number;
  };
  bestTimeToVisit?: string;
  peakHours?: string[];
  offPeakHours?: string[];
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
  transportClass?: BusType | TrainType | FlightType | CarType;
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
    notes?: string;
  }[];
  hotels: string[];
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
}

export type BusType = 'standard' | 'luxury' | 'sleeper' | 'volvo';
export type TrainType = 'general' | 'sleeper' | 'ac-chair' | 'ac-sleeper';
export type FlightType = 'economy' | 'business' | 'first-class';
export type CarType = 'hatchback' | 'sedan' | 'suv' | 'luxury';

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
