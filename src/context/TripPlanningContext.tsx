
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useDestinations } from './DestinationContext';
import { useToast } from '@/hooks/use-toast';
import { 
  TripPlan, 
  DayPlan, 
  TripPlanQueryParams, 
  TripPlanningContextType,
  TripItineraryDay 
} from '../types/trip-plan';
import { Destination } from '../types/destination';
import { HotelType } from '../types/hotel';
import { TransportType } from '../types/transport';
import { GuideType } from '../types/guide';
import { calculateHotelCostPerDay, calculateTransportCost } from '../utils/priceUtils';

// Mock data for development
const mockHotels: HotelType[] = [
  {
    id: 'hotel-1',
    name: 'Beach Resort',
    destinationId: 'dest-1',
    type: 'luxury',
    pricePerNight: 7500,
    amenities: ['Pool', 'Restaurant', 'Spa']
  },
  {
    id: 'hotel-2',
    name: 'City Center Hotel',
    destinationId: 'dest-2',
    type: 'standard',
    pricePerNight: 3500,
    amenities: ['WiFi', 'Breakfast', 'Parking']
  },
  {
    id: 'hotel-3',
    name: 'Budget Inn',
    destinationId: 'dest-1',
    type: 'budget',
    pricePerNight: 1500,
    amenities: ['WiFi', 'AC']
  }
];

const mockTransports: TransportType[] = [
  {
    id: 'transport-1',
    name: 'Express Bus',
    type: 'bus',
    pricePerKm: 2
  },
  {
    id: 'transport-2',
    name: 'Local Train',
    type: 'train',
    pricePerKm: 3
  },
  {
    id: 'transport-3',
    name: 'Flight',
    type: 'flight',
    pricePerKm: 8
  },
  {
    id: 'transport-4',
    name: 'Car Rental',
    type: 'car',
    pricePerKm: 4
  }
];

const mockGuides: GuideType[] = [
  {
    id: 'guide-1',
    name: 'Alex',
    destinationId: 'dest-1',
    languages: ['English', 'Hindi'],
    pricePerDay: 1500,
    rating: 4.8
  },
  {
    id: 'guide-2',
    name: 'Sarah',
    destinationId: 'dest-2',
    languages: ['English', 'French'],
    pricePerDay: 2000,
    rating: 4.9
  }
];

// Function to calculate distance between two destinations
const calculateDistance = (from: Destination, to: Destination): number => {
  // Simple mock distance calculation
  // In a real app, this would use GPS coordinates
  const latDiff = (from.coordinates?.lat || 0) - (to.coordinates?.lat || 0);
  const longDiff = (from.coordinates?.long || 0) - (to.coordinates?.long || 0);
  return Math.sqrt(latDiff * latDiff + longDiff * longDiff) * 111; // Rough km conversion
};

// Function to calculate travel time based on transport type and distance
const calculateTravelTime = (
  distanceKm: number,
  transportType: 'bus' | 'train' | 'flight' | 'car'
): number => {
  const speeds = {
    bus: 60, // km/h
    train: 100, // km/h
    flight: 800, // km/h
    car: 80 // km/h
  };
  
  // Add additional time for flights (boarding, security, etc.)
  const extraTime = transportType === 'flight' ? 2 : 0;
  
  return (distanceKm / speeds[transportType]) + extraTime;
};

// Function to generate an optimal itinerary
const generateOptimalItinerary = (options: {
  destinationIds: string[];
  transportType: 'bus' | 'train' | 'flight' | 'car';
  numberOfDays: number;
  startDate: Date;
  travelStyle?: 'base-hotel' | 'mobile';
  hotelType?: 'budget' | 'standard' | 'luxury';
  isPremium?: boolean;
}): TripItineraryDay[] => {
  const { 
    destinationIds, 
    transportType, 
    numberOfDays, 
    startDate, 
    travelStyle = 'mobile',
    hotelType = 'standard',
    isPremium = false
  } = options;
  
  // Mock implementation for demo purposes
  const itinerary: TripItineraryDay[] = [];
  
  for (let day = 1; day <= numberOfDays; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    
    // Determine which destination to visit on this day
    const destinationIndex = (day - 1) % destinationIds.length;
    const destinationId = destinationIds[destinationIndex];
    
    // Is this a travel day? (First day or when changing destinations)
    const isTransitDay = day > 1 && 
                       destinationIndex === 0 && 
                       destinationIds.length > 1;
    
    const dayItinerary: TripItineraryDay = {
      day,
      date: currentDate,
      destinationId,
      destinationName: `Destination ${destinationIndex + 1}`, // Mock name
      activities: isTransitDay 
        ? ['Travel day'] 
        : ['Morning sightseeing', 'Lunch at local restaurant', 'Evening leisure time'],
      isTransitDay,
      detailedSchedule: isTransitDay 
        ? [
            { time: '08:00', activity: 'Departure', location: 'Hotel Lobby' },
            { time: '12:00', activity: 'Lunch stop', location: 'Highway Restaurant' },
            { time: '18:00', activity: 'Arrival', location: 'Destination Hotel' }
          ]
        : [
            { time: '08:00', activity: 'Breakfast', location: 'Hotel Restaurant' },
            { time: '10:00', activity: 'Sightseeing', location: 'Main Attractions' },
            { time: '13:00', activity: 'Lunch', location: 'Local Restaurant' },
            { time: '15:00', activity: 'Shopping/Relaxation', location: 'City Center' },
            { time: '19:00', activity: 'Dinner', location: 'Recommended Restaurant' }
          ],
      hotels: [destinationId] // Stay at the current destination
    };
    
    if (isTransitDay) {
      dayItinerary.departureTime = '08:00 AM';
      dayItinerary.arrivalTime = '18:00 PM';
      dayItinerary.transportDetails = {
        vehicle: transportType,
        duration: '10 hours',
        amenities: ['Air Conditioning', 'Refreshments']
      };
    }
    
    itinerary.push(dayItinerary);
  }
  
  return itinerary;
};

// Create the context
const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

// Provider component
export const TripPlanningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { destinations } = useDestinations();
  const { toast } = useToast();
  
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [currentTripPlan, setCurrentTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parameters for trip planning
  const [tripPlanParams, setTripPlanParams] = useState<TripPlanQueryParams>({
    destinations: [],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    numberOfDays: 7,
    travelStyle: 'mobile',
    budget: 50000
  });
  
  // Load user's trip plans when user changes
  useEffect(() => {
    if (currentUser) {
      getUserTripPlans();
    } else {
      setTripPlans([]);
      setCurrentTripPlan(null);
    }
  }, [currentUser]);
  
  // Generate an itinerary based on current parameters
  const generateItinerary = (): DayPlan[] => {
    if (!tripPlanParams.destinations || tripPlanParams.destinations.length === 0) {
      toast({
        title: "No destinations selected",
        description: "Please select at least one destination for your trip.",
        variant: "destructive"
      });
      return [];
    }
    
    if (!tripPlanParams.startDate || !tripPlanParams.numberOfDays) {
      toast({
        title: "Missing trip details",
        description: "Please specify start date and duration for your trip.",
        variant: "destructive"
      });
      return [];
    }
    
    // Find the full destination objects based on the IDs in tripPlanParams
    const selectedDestinations = destinations.filter(
      dest => tripPlanParams.destinations?.includes(dest.id)
    );
    
    // Basic implementation for mock data
    const dayPlans: DayPlan[] = [];
    
    for (let day = 0; day < (tripPlanParams.numberOfDays || 7); day++) {
      const currentDate = new Date(tripPlanParams.startDate || new Date());
      currentDate.setDate(currentDate.getDate() + day);
      
      const destinationIndex = day % selectedDestinations.length;
      const destination = selectedDestinations[destinationIndex];
      
      if (destination) {
        const dayPlan: DayPlan = {
          day: day + 1,
          date: currentDate,
          destinationId: destination.id,
          activities: ["Explore destination", "Visit local attractions"],
          stayDestinationId: destination.id
        };
        
        dayPlans.push(dayPlan);
      }
    }
    
    return dayPlans;
  };

  // Calculate trip cost
  const calculateTripCost = (options: {
    destinationIds: string[];
    guideIds: string[];
    hotelType: 'budget' | 'standard' | 'luxury';
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
    numberOfPeople: number;
  }) => {
    const { destinationIds, guideIds, hotelType, transportType, numberOfDays, numberOfPeople } = options;
    
    // 1. Calculate destinations cost
    const destinationsCost = destinationIds.length * 1000 * numberOfPeople;
    
    // 2. Calculate hotels cost
    const dailyHotelCost = calculateHotelCostPerDay(hotelType);
    const hotelsCost = dailyHotelCost * numberOfDays * numberOfPeople;
    
    // 3. Calculate transport cost
    // Simplified: For each destination, calculate transport cost
    const totalDistance = destinationIds.length * 300; // Mock average distance
    const transportCost = calculateTransportCost(transportType, totalDistance) * numberOfPeople;
    
    // 4. Calculate guides cost
    const guidesTotal = guideIds.reduce((total, guideId) => {
      const guide = mockGuides.find(g => g.id === guideId);
      return total + (guide ? guide.pricePerDay * numberOfDays : 0);
    }, 0);
    
    return {
      destinationsCost,
      hotelsCost,
      transportCost,
      guidesCost: guidesTotal,
      totalCost: destinationsCost + hotelsCost + transportCost + guidesTotal
    };
  };
  
  // Check trip feasibility
  const checkTripFeasibility = (options: {
    destinationIds: string[];
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
  }) => {
    const { destinationIds, transportType, numberOfDays } = options;
    
    // Calculate minimum days needed for each destination
    const minDaysPerDestination = 1; // At least 1 day per destination
    
    // Calculate travel time between destinations
    let totalTravelHours = 0;
    let totalDistance = 0;
    
    const breakdown = destinationIds.map((destId, index) => {
      const destination = destinations.find(d => d.id === destId);
      const destinationName = destination ? destination.name : `Destination ${index + 1}`;
      
      let travelHoursToNext = 0;
      let distanceToNext = 0;
      
      // Calculate travel time to next destination
      if (index < destinationIds.length - 1) {
        const nextDestId = destinationIds[index + 1];
        const nextDestination = destinations.find(d => d.id === nextDestId);
        
        if (destination && nextDestination) {
          distanceToNext = calculateDistance(destination, nextDestination);
          travelHoursToNext = calculateTravelTime(distanceToNext, transportType);
          
          totalDistance += distanceToNext;
          totalTravelHours += travelHoursToNext;
        }
      }
      
      return {
        destinationId: destId,
        destinationName,
        daysNeeded: minDaysPerDestination,
        travelHoursToNext,
        travelDaysToNext: travelHoursToNext > 6 ? 1 : 0 // If travel time > 6 hours, allocate a full day
      };
    });
    
    // Calculate total days needed
    const travelDays = breakdown.reduce((sum, item) => sum + item.travelDaysToNext, 0);
    const destinationDays = destinationIds.length * minDaysPerDestination;
    const totalDaysNeeded = destinationDays + travelDays;
    
    const feasible = numberOfDays >= totalDaysNeeded;
    
    return {
      feasible,
      daysNeeded: totalDaysNeeded,
      daysShort: feasible ? 0 : totalDaysNeeded - numberOfDays,
      breakdown,
      totalDistance,
      totalTravelHours
    };
  };

  // Get distance matrix for all selected destinations
  const getDistanceMatrix = (destinationIds: string[]) => {
    const matrix: Array<{
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
    }> = [];
    
    // Generate distances between each pair of destinations
    for (let i = 0; i < destinationIds.length; i++) {
      for (let j = i + 1; j < destinationIds.length; j++) {
        const fromDestId = destinationIds[i];
        const toDestId = destinationIds[j];
        
        const fromDest = destinations.find(d => d.id === fromDestId);
        const toDest = destinations.find(d => d.id === toDestId);
        
        if (fromDest && toDest) {
          const distanceKm = calculateDistance(fromDest, toDest);
          
          matrix.push({
            fromId: fromDestId,
            toId: toDestId,
            fromName: fromDest.name,
            toName: toDest.name,
            distanceKm,
            travelTimesByTransport: {
              bus: calculateTravelTime(distanceKm, 'bus'),
              train: calculateTravelTime(distanceKm, 'train'),
              flight: calculateTravelTime(distanceKm, 'flight'),
              car: calculateTravelTime(distanceKm, 'car')
            }
          });
        }
      }
    }
    
    return matrix;
  };

  // Get suggested transport based on destinations and trip duration
  const getSuggestedTransport = (
    destinationIds: string[], 
    numberOfDays: number,
    isPremium = false
  ) => {
    // Calculate total distance
    let totalDistanceKm = 0;
    const distanceMatrix = getDistanceMatrix(destinationIds);
    
    distanceMatrix.forEach(item => {
      totalDistanceKm += item.distanceKm;
    });
    
    // Determine transport type based on total distance and number of days
    let recommendedType: 'bus' | 'train' | 'flight' | 'car' = 'car';
    let reasoning = '';
    let timeForSightseeing = numberOfDays * 24; // Hours
    let totalTravelTimeHours = 0;
    
    if (totalDistanceKm > 1500) {
      recommendedType = 'flight';
      totalTravelTimeHours = calculateTravelTime(totalDistanceKm, 'flight');
      reasoning = 'Long distance trip is best done by air travel';
    } else if (totalDistanceKm > 700) {
      recommendedType = 'train';
      totalTravelTimeHours = calculateTravelTime(totalDistanceKm, 'train');
      reasoning = 'Medium-long distance trip with good rail connectivity';
    } else if (totalDistanceKm > 300) {
      recommendedType = isPremium ? 'car' : 'bus';
      totalTravelTimeHours = calculateTravelTime(totalDistanceKm, isPremium ? 'car' : 'bus');
      reasoning = isPremium ? 'Premium car option for added convenience' : 'Economical bus option for this distance';
    } else {
      totalTravelTimeHours = calculateTravelTime(totalDistanceKm, 'car');
      reasoning = 'Short distances are most convenient by car';
    }
    
    // Subtract travel time from total time
    timeForSightseeing -= totalTravelTimeHours;
    
    return {
      recommendedType,
      alternativeType: recommendedType === 'flight' ? 'train' : 'car',
      reasoning,
      totalDistanceKm,
      totalTravelTimeHours,
      timeForSightseeing,
      isRealistic: timeForSightseeing > (numberOfDays * 8), // At least 8 hours per day for sightseeing
      premiumAdvantages: isPremium ? [
        'Access to premium lounges at airports/stations',
        'Skip-the-line privileges at attractions',
        'Private transfers between destinations'
      ] : undefined
    };
  };

  // Get hotels by destination
  const getHotelsByDestination = (destinationId: string) => {
    return mockHotels.filter(hotel => hotel.destinationId === destinationId);
  };

  // Get amenities for a transport type
  const getTransportAmenities = (type: string, isOvernight: boolean) => {
    const baseAmenities = ['Air conditioning', 'Restroom access'];
    
    switch (type) {
      case 'flight':
        return [...baseAmenities, 'Meal service', 'Entertainment system'];
      case 'train':
        return isOvernight 
          ? [...baseAmenities, 'Sleeper berth', 'Blankets', 'Charging points'] 
          : [...baseAmenities, 'Cafeteria', 'Charging points'];
      case 'bus':
        return isOvernight 
          ? [...baseAmenities, 'Reclining seats', 'Blankets', 'Water bottle'] 
          : [...baseAmenities, 'Regular stops', 'Water bottle'];
      case 'car':
        return ['Air conditioning', 'Music system', 'Flexible stops'];
      default:
        return baseAmenities;
    }
  };
  
  // Create a new trip plan
  const createTripPlan = async (name: string): Promise<TripPlan | null> => {
    if (!currentUser) {
      setError("You must be logged in to create a trip plan");
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate day plans based on current parameters
      const dayPlans = generateItinerary();
      
      if (dayPlans.length === 0) {
        throw new Error("Failed to generate itinerary. Please check your trip parameters.");
      }
      
      // Calculate end date based on start date and number of days
      const endDate = new Date(tripPlanParams.startDate || new Date());
      endDate.setDate(endDate.getDate() + (tripPlanParams.numberOfDays || 7) - 1);
      
      // Create the new trip plan
      const newTripPlan: TripPlan = {
        id: `trip-${Date.now()}`, // In a real app, this would be generated by the backend
        userId: currentUser.id,
        name: name || `Trip to ${destinations.find(d => d.id === tripPlanParams.destinations?.[0])?.name || 'Unknown'}`,
        startDate: (tripPlanParams.startDate || new Date()).toISOString(),
        endDate: endDate.toISOString(),
        numberOfDays: tripPlanParams.numberOfDays || 7,
        numberOfPeople: 2,
        selectedDestinations: tripPlanParams.destinations || [],
        hotelType: 'standard',
        transportType: 'car',
        travelStyle: tripPlanParams.travelStyle || 'mobile',
        totalCost: 50000,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        itinerary: generateOptimalItinerary({
          destinationIds: tripPlanParams.destinations || [],
          transportType: 'car',
          numberOfDays: tripPlanParams.numberOfDays || 7,
          startDate: tripPlanParams.startDate || new Date(),
          travelStyle: tripPlanParams.travelStyle
        })
      };
      
      // In a real app, you would save this to a database
      // For now, we'll just update our local state
      setTripPlans(prevPlans => [...prevPlans, newTripPlan]);
      setCurrentTripPlan(newTripPlan);
      
      toast({
        title: "Trip plan created",
        description: `Your trip plan has been created successfully.`,
      });
      
      return newTripPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create trip plan";
      setError(errorMessage);
      
      toast({
        title: "Error creating trip plan",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save trip plan
  const saveTripPlan = async (tripPlanData: Omit<TripPlan, 'id' | 'createdAt'>): Promise<string> => {
    if (!currentUser) {
      throw new Error("You must be logged in to save a trip plan");
    }
    
    setIsLoading(true);
    
    try {
      // Create new trip plan with ID and createdAt
      const newTripPlan: TripPlan = {
        ...tripPlanData,
        id: `trip-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      // Generate itinerary if needed
      if (!newTripPlan.itinerary) {
        newTripPlan.itinerary = generateOptimalItinerary({
          destinationIds: newTripPlan.selectedDestinations,
          transportType: newTripPlan.transportType,
          numberOfDays: newTripPlan.numberOfDays,
          startDate: new Date(newTripPlan.startDate),
          travelStyle: newTripPlan.travelStyle,
          hotelType: newTripPlan.hotelType
        });
      }
      
      // In a real app, you would save this to a database
      setTripPlans(prevPlans => [...prevPlans, newTripPlan]);
      
      toast({
        title: "Trip plan saved",
        description: "Your trip plan has been saved successfully."
      });
      
      return newTripPlan.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save trip plan";
      toast({
        title: "Error saving trip plan",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an existing trip plan
  const updateTripPlan = async (tripPlanId: string, updates: Partial<TripPlan>): Promise<TripPlan | null> => {
    if (!currentUser) {
      setError("You must be logged in to update a trip plan");
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the trip plan to update
      const tripPlanIndex = tripPlans.findIndex(plan => plan.id === tripPlanId);
      
      if (tripPlanIndex === -1) {
        throw new Error("Trip plan not found");
      }
      
      // Create the updated trip plan
      const updatedTripPlan = {
        ...tripPlans[tripPlanIndex],
        ...updates,
      };
      
      // In a real app, you would update this in a database
      // For now, we'll just update our local state
      const newTripPlans = [...tripPlans];
      newTripPlans[tripPlanIndex] = updatedTripPlan;
      
      setTripPlans(newTripPlans);
      
      // If we're updating the current trip plan, update that too
      if (currentTripPlan && currentTripPlan.id === tripPlanId) {
        setCurrentTripPlan(updatedTripPlan);
      }
      
      toast({
        title: "Trip plan updated",
        description: `Your trip plan has been updated successfully.`,
      });
      
      return updatedTripPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update trip plan";
      setError(errorMessage);
      
      toast({
        title: "Error updating trip plan",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a trip plan
  const deleteTripPlan = async (tripPlanId: string): Promise<boolean> => {
    if (!currentUser) {
      setError("You must be logged in to delete a trip plan");
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the trip plan to delete
      const tripPlanIndex = tripPlans.findIndex(plan => plan.id === tripPlanId);
      
      if (tripPlanIndex === -1) {
        throw new Error("Trip plan not found");
      }
      
      // In a real app, you would delete this from a database
      // For now, we'll just update our local state
      const newTripPlans = tripPlans.filter(plan => plan.id !== tripPlanId);
      setTripPlans(newTripPlans);
      
      // If we're deleting the current trip plan, clear it
      if (currentTripPlan && currentTripPlan.id === tripPlanId) {
        setCurrentTripPlan(null);
      }
      
      toast({
        title: "Trip plan deleted",
        description: "Your trip plan has been deleted successfully.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete trip plan";
      setError(errorMessage);
      
      toast({
        title: "Error deleting trip plan",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a trip plan
  const cancelTripPlan = async (tripPlanId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error("You must be logged in to cancel a trip plan");
    }
    
    setIsLoading(true);
    
    try {
      // Find the trip plan
      const tripPlanIndex = tripPlans.findIndex(plan => plan.id === tripPlanId);
      
      if (tripPlanIndex === -1) {
        throw new Error("Trip plan not found");
      }
      
      // Update the trip plan status to cancelled
      const updatedTrip = {
        ...tripPlans[tripPlanIndex],
        status: 'cancelled' as const
      };
      
      // Update in state
      const newTripPlans = [...tripPlans];
      newTripPlans[tripPlanIndex] = updatedTrip;
      setTripPlans(newTripPlans);
      
      // If it's the current trip plan, update that too
      if (currentTripPlan && currentTripPlan.id === tripPlanId) {
        setCurrentTripPlan(updatedTrip);
      }
      
      toast({
        title: "Trip Cancelled",
        description: "Your trip has been cancelled successfully."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel trip";
      toast({
        title: "Error cancelling trip",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a trip plan by ID
  const getTripPlanById = (tripPlanId: string): TripPlan | null => {
    const tripPlan = tripPlans.find(plan => plan.id === tripPlanId);
    
    if (!tripPlan) {
      // Add a mock trip plan for testing
      if (tripPlanId === 'trip-1') {
        const mockTrip: TripPlan = {
          id: "trip-1",
          userId: currentUser?.id || "user-1",
          selectedDestinations: ["dest-1", "dest-2"],
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          numberOfDays: 7,
          numberOfPeople: 2,
          hotelType: "standard",
          transportType: "car",
          totalCost: 35000,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          travelStyle: "base-hotel",
          itinerary: generateOptimalItinerary({
            destinationIds: ["dest-1", "dest-2"],
            transportType: "car",
            numberOfDays: 7,
            startDate: new Date(),
            travelStyle: "base-hotel",
            hotelType: "standard"
          })
        };
        return mockTrip;
      }
      return null;
    }
    
    return tripPlan;
  };
  
  // Get all trip plans for the current user
  const getUserTripPlans = async (): Promise<TripPlan[]> => {
    if (!currentUser) {
      setError("You must be logged in to view trip plans");
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch this from a database
      // This is a placeholder for demonstration purposes
      if (tripPlans.length === 0) {
        const mockTripPlans: TripPlan[] = [
          {
            id: "trip-1",
            userId: currentUser.id,
            selectedDestinations: ["dest-1", "dest-2"],
            startDate: new Date(2023, 11, 15).toISOString(),
            endDate: new Date(2023, 11, 17).toISOString(),
            numberOfDays: 3,
            numberOfPeople: 2,
            hotelType: "standard",
            transportType: "car",
            totalCost: 25000,
            status: "confirmed",
            createdAt: new Date(2023, 10, 1).toISOString(),
            travelStyle: "base-hotel",
            itinerary: generateOptimalItinerary({
              destinationIds: ["dest-1", "dest-2"],
              transportType: "car",
              numberOfDays: 3,
              startDate: new Date(2023, 11, 15),
              travelStyle: "base-hotel",
              hotelType: "standard"
            })
          }
        ];
        
        setTripPlans(mockTripPlans);
        return mockTripPlans;
      }
      
      return tripPlans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get trip plans";
      setError(errorMessage);
      
      toast({
        title: "Error retrieving trip plans",
        description: errorMessage,
        variant: "destructive"
      });
      
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear the current trip plan
  const clearCurrentTripPlan = () => {
    setCurrentTripPlan(null);
  };
  
  // Context value
  const value: TripPlanningContextType = {
    tripPlans,
    currentTripPlan,
    isLoading,
    error,
    tripPlanParams,
    setTripPlanParams,
    createTripPlan,
    updateTripPlan,
    deleteTripPlan,
    getTripPlanById,
    getUserTripPlans,
    clearCurrentTripPlan,
    generateItinerary,
    // Additional properties needed by components
    hotels: mockHotels,
    transports: mockTransports,
    guides: mockGuides,
    loading: isLoading,
    calculateTripCost,
    saveTripPlan,
    checkTripFeasibility,
    getDistanceMatrix,
    getSuggestedTransport,
    getTransportAmenities,
    getHotelsByDestination,
    generateOptimalItinerary,
    cancelTripPlan
  };
  
  return (
    <TripPlanningContext.Provider value={value}>
      {children}
    </TripPlanningContext.Provider>
  );
};

// Custom hook to use the trip planning context
export const useTripPlanning = () => {
  const context = useContext(TripPlanningContext);
  
  if (context === undefined) {
    throw new Error("useTripPlanning must be used within a TripPlanningProvider");
  }
  
  return context;
};
