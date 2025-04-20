
import { HotelType } from './hotel';
import { TransportType } from './transport';
import { GuideType } from './guide';
import { Destination } from './destination';

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

export interface TripPlanningContextType {
  tripPlans: TripPlan[];
  currentTripPlan: TripPlan | null;
  isLoading: boolean;
  error: string | null;
  tripPlanParams: TripPlanQueryParams;
  setTripPlanParams: React.Dispatch<React.SetStateAction<TripPlanQueryParams>>;
  createTripPlan: (name: string) => Promise<TripPlan | null>;
  updateTripPlan: (tripPlanId: string, updates: Partial<TripPlan>) => Promise<TripPlan | null>;
  deleteTripPlan: (tripPlanId: string) => Promise<boolean>;
  getTripPlanById: (tripPlanId: string) => TripPlan | null;
  getUserTripPlans: () => Promise<TripPlan[]>;
  clearCurrentTripPlan: () => void;
  generateItinerary: () => DayPlan[];
  // Add missing properties used in components
  hotels: HotelType[];
  transports: TransportType[];
  guides: GuideType[];
  loading: boolean;
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
  getHotelsByDestination: (destinationId: string) => HotelType[];
  generateOptimalItinerary: (options: {
    destinationIds: string[];
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
    startDate: Date;
    travelStyle?: 'base-hotel' | 'mobile';
    hotelType?: 'budget' | 'standard' | 'luxury';
    isPremium?: boolean;
  }) => TripItineraryDay[];
  cancelTripPlan: (tripPlanId: string) => Promise<void>;
}

export interface DayPlan {
  day: number;
  date: Date;
  destinationId: string;
  activities: string[];
  stayDestinationId: string;
}

export interface TripPlanQueryParams {
  destinations?: string[];
  startDate?: Date;
  endDate?: Date;
  numberOfDays?: number;
  travelStyle?: 'base-hotel' | 'mobile';
  budget?: number;
}
