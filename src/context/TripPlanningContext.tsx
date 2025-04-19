import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useDestinations } from './DestinationContext';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Destination {
  id: string;
  name: string;
  attractions: string[];
  // other destination properties
}

export interface DayPlan {
  day: number;
  date: Date;
  destinationId: string;
  activities: string[];
  stayDestinationId: string;
}

export interface TripPlan {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  destinations: string[]; // Array of destination IDs
  dayPlans: DayPlan[];
  travelStyle: 'base-hotel' | 'mobile';
  budget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripPlanQueryParams {
  destinations?: string[];
  startDate?: Date;
  endDate?: Date;
  numberOfDays?: number;
  travelStyle?: 'base-hotel' | 'mobile';
  budget?: number;
}

interface TripPlanningContextType {
  tripPlans: TripPlan[];
  currentTripPlan: TripPlan | null;
  isLoading: boolean;
  error: string | null;
  tripPlanParams: TripPlanQueryParams;
  setTripPlanParams: React.Dispatch<React.SetStateAction<TripPlanQueryParams>>;
  createTripPlan: (name: string) => Promise<TripPlan | null>;
  updateTripPlan: (tripPlanId: string, updates: Partial<TripPlan>) => Promise<TripPlan | null>;
  deleteTripPlan: (tripPlanId: string) => Promise<boolean>;
  getTripPlanById: (tripPlanId: string) => Promise<TripPlan | null>;
  getUserTripPlans: () => Promise<TripPlan[]>;
  clearCurrentTripPlan: () => void;
  generateItinerary: () => DayPlan[];
}

// Function to generate an optimal itinerary
const generateOptimalItinerary = (
  destinations: Destination[],
  numberOfDays: number,
  startDate: Date,
  travelStyle: 'base-hotel' | 'mobile' = 'mobile'
): DayPlan[] => {
  // Create an array of day plans based on the number of days
  const dayPlans: DayPlan[] = [];
  
  if (destinations.length === 0) {
    return dayPlans;
  }
  
  // For the base-hotel style, stay in one place and make day trips
  if (travelStyle === 'base-hotel' && destinations.length > 0) {
    const baseDestination = destinations[0]; // Use the first destination as base
    
    for (let day = 0; day < numberOfDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      // Calculate which destination to visit on this day
      // For base-hotel, we'll cycle through all destinations while staying at the base
      const destinationToVisit = destinations[day % destinations.length];
      
      const dayPlan: DayPlan = {
        day: day + 1,
        date: currentDate,
        destinationId: destinationToVisit.id,
        activities: [
          `Explore ${destinationToVisit.name}`,
          `Visit ${destinationToVisit.attractions[0] || 'local attractions'}`
        ],
        stayDestinationId: baseDestination.id // Always stay at the base destination
      };
      
      dayPlans.push(dayPlan);
    }
  } 
  // For the mobile style, move between destinations
  else {
    // Determine how many days to spend at each destination
    const daysPerDestination = Math.max(1, Math.floor(numberOfDays / destinations.length));
    let remainingDays = numberOfDays % destinations.length;
    
    let currentDay = 0;
    
    // Distribute days among destinations
    destinations.forEach((destination, index) => {
      // Calculate days at this destination, adding an extra day if there are remaining days
      const daysAtThisDestination = daysPerDestination + (remainingDays > 0 ? 1 : 0);
      if (remainingDays > 0) remainingDays--;
      
      for (let i = 0; i < daysAtThisDestination; i++) {
        if (currentDay < numberOfDays) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + currentDay);
          
          const dayPlan: DayPlan = {
            day: currentDay + 1,
            date: currentDate,
            destinationId: destination.id,
            activities: [
              `Explore ${destination.name}`,
              `Visit ${destination.attractions[i % destination.attractions.length] || 'local attractions'}`
            ],
            stayDestinationId: destination.id // Stay at the current destination
          };
          
          dayPlans.push(dayPlan);
          currentDay++;
        }
      }
    });
  }
  
  return dayPlans;
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
    
    // Generate the itinerary
    return generateOptimalItinerary(
      selectedDestinations,
      tripPlanParams.numberOfDays || 7,
      tripPlanParams.startDate || new Date(),
      tripPlanParams.travelStyle || 'mobile'
    );
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
        userId: currentUser.uid,
        name: name || `Trip to ${destinations.find(d => d.id === tripPlanParams.destinations?.[0])?.name || 'Unknown'}`,
        startDate: tripPlanParams.startDate || new Date(),
        endDate: endDate,
        numberOfDays: tripPlanParams.numberOfDays || 7,
        destinations: tripPlanParams.destinations || [],
        dayPlans: dayPlans,
        travelStyle: tripPlanParams.travelStyle || 'mobile',
        budget: tripPlanParams.budget || 50000,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // In a real app, you would save this to a database
      // For now, we'll just update our local state
      setTripPlans(prevPlans => [...prevPlans, newTripPlan]);
      setCurrentTripPlan(newTripPlan);
      
      toast({
        title: "Trip plan created",
        description: `Your trip plan "${newTripPlan.name}" has been created successfully.`,
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
        updatedAt: new Date()
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
        description: `Your trip plan "${updatedTripPlan.name}" has been updated successfully.`,
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
  
  // Get a trip plan by ID
  const getTripPlanById = async (tripPlanId: string): Promise<TripPlan | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the trip plan
      const tripPlan = tripPlans.find(plan => plan.id === tripPlanId);
      
      if (!tripPlan) {
        throw new Error("Trip plan not found");
      }
      
      setCurrentTripPlan(tripPlan);
      return tripPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get trip plan";
      setError(errorMessage);
      
      toast({
        title: "Error retrieving trip plan",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
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
      // For now, we'll just return our local state
      // This is a placeholder for demonstration purposes
      const mockTripPlans: TripPlan[] = [
        {
          id: "trip-1",
          userId: currentUser.uid,
          name: "Weekend in Goa",
          startDate: new Date(2023, 11, 15),
          endDate: new Date(2023, 11, 17),
          numberOfDays: 3,
          destinations: ["dest-1", "dest-2"],
          dayPlans: [
            {
              day: 1,
              date: new Date(2023, 11, 15),
              destinationId: "dest-1",
              activities: ["Beach day", "Seafood dinner"],
              stayDestinationId: "dest-1"
            },
            {
              day: 2,
              date: new Date(2023, 11, 16),
              destinationId: "dest-2",
              activities: ["Spice plantation tour", "Local market shopping"],
              stayDestinationId: "dest-1"
            },
            {
              day: 3,
              date: new Date(2023, 11, 17),
              destinationId: "dest-1",
              activities: ["Water sports", "Sunset cruise"],
              stayDestinationId: "dest-1"
            }
          ],
          travelStyle: "base-hotel",
          budget: 25000,
          createdAt: new Date(2023, 10, 1),
          updatedAt: new Date(2023, 10, 1)
        }
      ];
      
      setTripPlans(mockTripPlans);
      return mockTripPlans;
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
  const value = {
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
    generateItinerary
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
