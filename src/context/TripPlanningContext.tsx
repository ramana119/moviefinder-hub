import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { 
  TripPlanningContextType, 
  HotelType, 
  TransportType, 
  GuideType, 
  TripPlan,
  Destination,
  TripItineraryDay
} from '../types';
import { hotels } from '../data/hotels';
import { transports } from '../data/transports';
import { guides } from '../data/guides';
import { useToast } from '../hooks/use-toast';
import { useBookings } from './BookingContext';
import { useDestinations } from './DestinationContext';
import { getTransportAmenities } from '../utils/tripPlanningUtils';
import { getBasePrice } from '../utils/helpers';

const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

export const TripPlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { saveTripPlan: saveBookingTripPlan } = useBookings();
  const { destinations } = useDestinations();

  useEffect(() => {
    try {
      const storedTripPlans = localStorage.getItem('tripPlans');
      if (storedTripPlans) {
        const parsedPlans = JSON.parse(storedTripPlans);
        if (Array.isArray(parsedPlans)) {
          setTripPlans(parsedPlans);
        } else {
          console.warn('Invalid trip plans data in localStorage');
          localStorage.removeItem('tripPlans');
        }
      }
    } catch (err) {
      console.error('Error initializing trip plans:', err);
      setError('Failed to load trip plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tripPlans.length > 0 || !loading) {
      try {
        localStorage.setItem('tripPlans', JSON.stringify(tripPlans));
      } catch (err) {
        console.error('Failed to save trip plans to localStorage:', err);
      }
    }
  }, [tripPlans, loading]);

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const calculateDistanceBetweenDestinations = useCallback((from: Destination, to: Destination): number => {
    if (!from.coordinates || !to.coordinates) return 0;
    return calculateDistance(
      from.coordinates.lat,
      from.coordinates.lng,
      to.coordinates.lat,
      to.coordinates.lng
    );
  }, [calculateDistance]);

  const calculateHotelProximity = useCallback((hotel: HotelType, destination: Destination): HotelType => {
    if (!destination.coordinates || !hotel.location) {
      return {
        ...hotel,
        location: hotel.location || {
          coordinates: { lat: 0, lng: 0 },
          address: 'Unknown location',
          distanceFromCenter: 0,
          proximityScore: 5
        }
      };
    }
    
    const distance = calculateDistance(
      hotel.location.coordinates.lat,
      hotel.location.coordinates.lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    );
    
    const proximityScore = Math.max(1, 10 - Math.floor(distance / 2));
    
    return {
      ...hotel,
      location: {
        ...hotel.location,
        distanceFromCenter: distance,
        proximityScore
      }
    };
  }, [calculateDistance]);

  const getHotelsByDestination = useCallback((destinationId: string): HotelType[] => {
    const destination = destinations.find(d => d.id === destinationId);
    if (!destination) return [];
    
    return hotels
      .filter(hotel => hotel.destinationId === destinationId)
      .map(hotel => calculateHotelProximity(hotel, destination));
  }, [destinations, calculateHotelProximity]);

  const getNearbyHotels = useCallback((destinationId: string, limit = 3) => {
    return getHotelsByDestination(destinationId)
      .sort((a, b) => {
        if (a.location && b.location) {
          return a.location.distanceFromCenter - b.location.distanceFromCenter;
        }
        return 0;
      })
      .slice(0, limit);
  }, [getHotelsByDestination]);

  const getOptimalHotels = useCallback((destinationIds: string[]): HotelType[] => {
    if (!destinationIds || destinationIds.length === 0) {
      return [];
    }
    
    const destinationHotels = destinationIds.map(destId => {
      const destination = destinations.find(d => d.id === destId);
      if (!destination) return [];
      
      return hotels
        .filter(h => h.destinationId === destId)
        .map(h => calculateHotelProximity(h, destination));
    });

    if (destinationHotels.length === 0 || destinationHotels.some(hotels => hotels.length === 0)) {
      return [];
    }

    const avgProximity = destinationHotels.reduce((sum, hotels) => {
      const destAvg = hotels.length > 0 
        ? hotels.reduce((sum, hotel) => sum + (hotel.location ? hotel.location.proximityScore : 0), 0) / hotels.length
        : 0;
      return sum + destAvg;
    }, 0) / destinationIds.length;

    return destinationHotels.map(hotels => {
      if (hotels.length === 0) {
        return null;
      }
      return hotels.sort((a, b) => {
        const aScore = a.location ? a.location.proximityScore : 0;
        const bScore = b.location ? b.location.proximityScore : 0;
        return Math.abs(aScore - avgProximity) - Math.abs(bScore - avgProximity);
      })[0];
    }).filter(Boolean) as HotelType[];
  }, [destinations, calculateHotelProximity]);

  const getDistanceMatrix = useCallback((destinationIds: string[]) => {
    const selectedDestinations = destinationIds
      .map(id => destinations.find(d => d.id === id))
      .filter(Boolean) as Destination[];
    
    if (selectedDestinations.length < 2) return [];

    const matrix = [];
    for (let i = 0; i < selectedDestinations.length - 1; i++) {
      const from = selectedDestinations[i];
      const to = selectedDestinations[i + 1];
      const distance = calculateDistanceBetweenDestinations(from, to);
      
      matrix.push({
        fromId: from.id,
        toId: to.id,
        fromName: from.name,
        toName: to.name,
        distanceKm: distance,
        travelTimesByTransport: {
          bus: Math.round(distance / 50 * 1.2),
          train: Math.round(distance / 80 * 1.1),
          flight: Math.round(distance / 500 * 1.5),
          car: Math.round(distance / 60 * 1.3)
        }
      });
    }
    return matrix;
  }, [destinations, calculateDistanceBetweenDestinations]);

  const generateOptimalItinerary = useCallback((options: {
    destinationIds: string[];
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
    startDate: Date;
    travelStyle?: 'base-hotel' | 'mobile';
    isPremium?: boolean;
  }): TripItineraryDay[] => {
    const selectedDestinations = options.destinationIds
      .map(id => destinations.find(dest => dest.id === id))
      .filter(Boolean) as Destination[];
    
    if (!selectedDestinations.length) return [];
    
    const distanceMatrix = getDistanceMatrix(options.destinationIds);
    const itinerary: TripItineraryDay[] = [];
    let currentDate = new Date(options.startDate);
    
    for (let i = 0; i < options.numberOfDays; i++) {
      const destIndex = i % selectedDestinations.length;
      const destination = selectedDestinations[destIndex];
      
      const detailedSchedule = [
        { time: '08:00', activity: 'Breakfast', location: `Hotel in ${destination.name}` },
        { time: '09:30', activity: `Explore ${destination.name}`, location: destination.name },
        { time: '12:30', activity: 'Lunch', location: `Restaurant in ${destination.name}` },
        { time: '14:00', activity: `Visit ${destination.attractions?.[0] || 'local attractions'}`, location: destination.name },
        { time: '18:00', activity: 'Dinner', location: `Restaurant in ${destination.name}` }
      ];
      
      itinerary.push({
        day: i + 1,
        date: new Date(currentDate),
        destinationId: destination.id,
        destinationName: destination.name,
        activities: [
          `Explore ${destination.name}`,
          `Visit ${destination.attractions?.[0] || 'local attractions'}`
        ],
        isTransitDay: false,
        detailedSchedule,
        hotels: [destination.id]
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return itinerary;
  }, [destinations, getDistanceMatrix]);

  const saveTripPlan = useCallback(async (tripPlanData: Omit<TripPlan, 'id' | 'createdAt'>): Promise<string> => {
    setError(null);
    setLoading(true);

    try {
      if (!tripPlanData.selectedDestinations?.length) {
        throw new Error('At least one destination is required');
      }

      const newTripPlanId = `trip_${uuidv4()}`;
      const transportType = tripPlanData.transportType || 'car';
      
      let optimalHotels: HotelType[] = [];
      
      try {
        optimalHotels = getOptimalHotels(tripPlanData.selectedDestinations);
      } catch (hotelErr) {
        console.error('Error finding optimal hotels:', hotelErr);
        setError('Failed to find optimal hotels');
      }
      
      let itinerary: TripItineraryDay[] = [];
      
      try {
        itinerary = generateOptimalItinerary({
          destinationIds: tripPlanData.selectedDestinations,
          transportType,
          numberOfDays: tripPlanData.numberOfDays,
          startDate: new Date(tripPlanData.startDate),
          travelStyle: tripPlanData.travelStyle,
          isPremium: tripPlanData.isPremium
        });
      } catch (itineraryErr) {
        console.error('Error generating itinerary:', itineraryErr);
        setError('Failed to generate itinerary');
        const startDate = new Date(tripPlanData.startDate);
        itinerary = tripPlanData.selectedDestinations.map((destId, idx) => {
          const dest = destinations.find(d => d.id === destId);
          const day = idx + 1;
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + idx);
          
          return {
            day,
            date,
            destinationId: destId,
            destinationName: dest?.name || 'Unknown Destination',
            activities: ['Explore the area'],
            isTransitDay: false,
            detailedSchedule: [
              { time: '09:00', activity: 'Sightseeing', location: dest?.name || 'Unknown' }
            ],
            hotels: [destId]
          };
        });
      }
      
      const avgProximityScore = optimalHotels.length > 0
        ? optimalHotels.reduce((sum, hotel) => 
            sum + (hotel.location ? hotel.location.proximityScore : 0), 0) / optimalHotels.length
        : 5; // Default mid-range score if no hotels

      const newTripPlan: TripPlan = {
        ...tripPlanData,
        id: newTripPlanId,
        createdAt: new Date().toISOString(),
        transportType,
        itinerary,
        hotelProximityScore: avgProximityScore,
        selectedHotels: optimalHotels.map(hotel => hotel.id)
      };

      setTripPlans(prev => [...prev, newTripPlan]);
      await saveBookingTripPlan(newTripPlan);
      
      toast({
        title: 'Trip Plan Saved!',
        description: 'Your trip plan has been created successfully.',
      });

      return newTripPlanId;
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to create trip plan';
      setError(errorMsg);
      toast({
        title: 'Trip Planning Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getOptimalHotels, generateOptimalItinerary, saveBookingTripPlan, toast, destinations]);

  const getUserTripPlans = useCallback((userId: string) => {
    return tripPlans.filter(plan => plan.userId === userId);
  }, [tripPlans]);

  const getTripPlanById = useCallback((id: string) => {
    return tripPlans.find(plan => plan.id === id);
  }, [tripPlans]);

  const cancelTripPlan = useCallback(async (tripPlanId: string) => {
    setLoading(true);
    try {
      setTripPlans(prev => prev.filter(plan => plan.id !== tripPlanId));
      toast({
        title: 'Trip Cancelled',
        description: 'Your trip has been cancelled.',
      });
    } catch (err) {
      setError('Failed to cancel trip');
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel trip',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const calculateTripCost = useCallback((options: {
    destinationIds: string[];
    guideIds: string[];
    hotelType: 'budget' | 'standard' | 'luxury';
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
    numberOfPeople: number;
    travelStyle?: 'base-hotel' | 'mobile';
  }) => {
    const selectedDestinations = options.destinationIds
      .map(id => destinations.find(d => d.id === id))
      .filter(Boolean) as Destination[];
    
    const destinationsCost = selectedDestinations.reduce((sum, dest) => 
      sum + getBasePrice(dest.price || 0), 0) * options.numberOfPeople;
    
    let hotelCostPerDay = 0;
    const selectedHotels = hotels.filter(h => 
      options.destinationIds.includes(h.destinationId) && h.type === options.hotelType
    );
    
    if (selectedHotels.length > 0) {
      const baseCosts = {
        'budget': 1000,
        'standard': 2500,
        'luxury': 5000
      };
      
      if (options.destinationIds.length === 1) {
        hotelCostPerDay = baseCosts[options.hotelType];
      } else if (options.travelStyle === 'base-hotel') {
        hotelCostPerDay = baseCosts[options.hotelType] * 1.1;
      } else if (options.travelStyle === 'mobile') {
        hotelCostPerDay = baseCosts[options.hotelType] * 1.2 * options.destinationIds.length;
      }
      
      if (hotelCostPerDay === 0 && selectedHotels.length > 0) {
        hotelCostPerDay = selectedHotels.reduce((sum, h) => sum + h.pricePerPerson, 0) / selectedHotels.length;
      }
    }
    
    const hotelsCost = hotelCostPerDay * options.numberOfPeople * options.numberOfDays;
    
    const transportMultipliers = {
      'bus': 1,
      'train': 1.5,
      'flight': 3,
      'car': 1.2
    };
    
    const baseTransportCost = 500;
    
    const distanceMultiplier = options.destinationIds.length > 1 ? 
      (options.destinationIds.length - 1) * 0.8 : 1;
    
    const transportCost = baseTransportCost * transportMultipliers[options.transportType] * 
      options.numberOfPeople * distanceMultiplier;
    
    const guidesCost = guides
      .filter(g => options.guideIds.includes(g.id))
      .reduce((sum, g) => sum + g.pricePerDay, 0) * options.numberOfDays;
    
    return {
      destinationsCost,
      hotelsCost,
      transportCost,
      guidesCost,
      totalCost: destinationsCost + hotelsCost + transportCost + guidesCost
    };
  }, [destinations, guides]);

  const checkTripFeasibility = useCallback((options: {
    destinationIds: string[];
    transportType: 'bus' | 'train' | 'flight' | 'car';
    numberOfDays: number;
  }) => {
    const distanceMatrix = getDistanceMatrix(options.destinationIds);
    const totalDistance = distanceMatrix.reduce((sum, segment) => sum + segment.distanceKm, 0);
    const travelHours = distanceMatrix.reduce((sum, segment) => 
      sum + segment.travelTimesByTransport[options.transportType], 0);
    
    const daysNeeded = Math.ceil(travelHours / 8) + options.destinationIds.length;
    const daysShort = options.numberOfDays < daysNeeded ? daysNeeded - options.numberOfDays : undefined;
    
    return {
      feasible: options.numberOfDays >= daysNeeded,
      daysNeeded,
      daysShort,
      breakdown: distanceMatrix.map(segment => ({
        destinationId: segment.fromId,
        destinationName: segment.fromName,
        daysNeeded: 1,
        travelHoursToNext: segment.travelTimesByTransport[options.transportType],
        travelDaysToNext: Math.ceil(segment.travelTimesByTransport[options.transportType] / 8)
      })),
      totalDistance,
      totalTravelHours: travelHours
    };
  }, [getDistanceMatrix]);

  const getSuggestedTransport = useCallback((
    destinationIds: string[], 
    numberOfDays: number,
    isPremium?: boolean
  ) => {
    const distanceMatrix = getDistanceMatrix(destinationIds);
    const totalDistance = distanceMatrix.reduce((sum, segment) => sum + segment.distanceKm, 0);
    const totalTravelHours = {
      bus: distanceMatrix.reduce((sum, segment) => sum + segment.travelTimesByTransport.bus, 0),
      train: distanceMatrix.reduce((sum, segment) => sum + segment.travelTimesByTransport.train, 0),
      flight: distanceMatrix.reduce((sum, segment) => sum + segment.travelTimesByTransport.flight, 0),
      car: distanceMatrix.reduce((sum, segment) => sum + segment.travelTimesByTransport.car, 0)
    };
    
    let recommendedType: 'bus' | 'train' | 'flight' | 'car' = 'car';
    let reasoning = '';
    
    if (totalDistance > 1000) {
      recommendedType = 'flight';
      reasoning = 'Best for long distances over 1000km';
    } else if (totalDistance > 300) {
      recommendedType = 'train';
      reasoning = 'Comfortable for medium distances';
    } else if (numberOfDays > 7) {
      recommendedType = 'car';
      reasoning = 'Flexibility for longer trips';
    } else {
      recommendedType = 'bus';
      reasoning = 'Economical for short trips';
    }
    
    const sightseeingTime = (numberOfDays * 8) - totalTravelHours[recommendedType];
    
    return {
      recommendedType,
      alternativeType: recommendedType === 'flight' ? 'train' as const : 'car' as const,
      reasoning,
      totalDistanceKm: totalDistance as number,
      totalTravelTimeHours: totalTravelHours[recommendedType] as number,
      timeForSightseeing: sightseeingTime,
      isRealistic: sightseeingTime > 0,
      premiumAdvantages: isPremium ? [
        'Priority boarding',
        'Extra luggage allowance',
        'Flexible cancellation'
      ] : undefined
    };
  }, [getDistanceMatrix]);

  return (
    <TripPlanningContext.Provider
      value={{
        hotels,
        transports,
        guides,
        tripPlans,
        loading,
        error,
        getHotelsByDestination,
        getGuidesByDestination: (destId) => guides.filter(g => g.destinationId === destId),
        calculateTripCost,
        saveTripPlan,
        getUserTripPlans,
        getTripPlanById,
        cancelTripPlan,
        checkTripFeasibility,
        generateOptimalItinerary,
        calculateDistanceBetweenDestinations,
        getDistanceMatrix,
        getSuggestedTransport,
        getTransportAmenities,
        getOptimalHotels,
        getNearbyHotels,
        calculateHotelProximity
      }}
    >
      {children}
    </TripPlanningContext.Provider>
  );
};

export const useTripPlanning = () => {
  const context = useContext(TripPlanningContext);
  if (context === undefined) {
    throw new Error('useTripPlanning must be used within a TripPlanningProvider');
  }
  return context;
};
