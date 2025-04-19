import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDestinations } from '../context/DestinationContext';
import { useTripPlanning } from '../context/TripPlanningContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import TripValidation from '../components/TripValidation';
import TripDistanceCalculator from '../components/TripDistanceCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DestinationSelector from '../components/trip-planner/DestinationSelector';
import DatePeoplePicker from '../components/trip-planner/DatePeoplePicker';
import HotelTypeSelector from '../components/trip-planner/HotelTypeSelector';
import TransportTypeSelector from '../components/trip-planner/TransportTypeSelector';
import GuideSelector from '../components/trip-planner/GuideSelector';
import TripCostBreakdown from '../components/trip-planner/TripCostBreakdown';
import PremiumFeaturesBanner from '../components/trip-planner/PremiumFeaturesBanner';

const TripPlanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destinations, getDestinationById } = useDestinations();
  const { hotels, transports, guides, calculateTripCost, checkTripFeasibility, getSuggestedTransport, saveTripPlan } = useTripPlanning();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [numberOfDays, setNumberOfDays] = useState<number>(3);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [hotelType, setHotelType] = useState<'budget' | 'standard' | 'luxury'>('standard');
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [transportType, setTransportType] = useState<'bus' | 'train' | 'flight' | 'car'>('car');
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [sleepTransport, setSleepTransport] = useState<boolean>(false);
  const [travelStyle, setTravelStyle] = useState<'base-hotel' | 'mobile'>('base-hotel');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [costBreakdown, setCostBreakdown] = useState<{
    destinationsCost: number;
    hotelsCost: number;
    transportCost: number;
    guidesCost: number;
  }>({ destinationsCost: 0, hotelsCost: 0, transportCost: 0, guidesCost: 0 });
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [isFeasible, setIsFeasible] = useState<boolean>(true);
  const [feasibilityDetails, setFeasibilityDetails] = useState<any>(null);
  const [suggestedTransport, setSuggestedTransport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('destinations');

  const destinationIdFromParams = location.state?.destinationId;

  useEffect(() => {
    if (destinationIdFromParams && !selectedDestinations.includes(destinationIdFromParams)) {
      setSelectedDestinations([destinationIdFromParams]);
    }
  }, [destinationIdFromParams, selectedDestinations]);

  useEffect(() => {
    if (currentUser?.isPremium) {
      setIsPremium(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedDestinations.length > 0) {
      const cost = calculateTripCost({
        destinationIds: selectedDestinations,
        guideIds: selectedGuides,
        hotelType,
        transportType,
        numberOfDays,
        numberOfPeople
      });
      
      let adjustedTotalCost = cost.totalCost;
      if (isPremium && selectedGuides.length > 0 && cost.guidesCost > 0) {
        const cheapestGuide = guides
          .filter(g => selectedGuides.includes(g.id))
          .sort((a, b) => a.pricePerDay - b.pricePerDay)[0];
          
        if (cheapestGuide) {
          adjustedTotalCost -= cheapestGuide.pricePerDay * numberOfDays;
        }
      }
      
      setTotalCost(adjustedTotalCost);
      setCostBreakdown({
        destinationsCost: cost.destinationsCost,
        hotelsCost: cost.hotelsCost,
        transportCost: cost.transportCost,
        guidesCost: isPremium && selectedGuides.length > 0 ? 
          Math.max(0, cost.guidesCost - (guides.find(g => selectedGuides.includes(g.id))?.pricePerDay || 0) * numberOfDays) : 
          cost.guidesCost
      });
    }
  }, [selectedDestinations, selectedGuides, hotelType, transportType, numberOfDays, numberOfPeople, calculateTripCost, isPremium, guides]);

  useEffect(() => {
    if (selectedDestinations.length > 0) {
      const feasibility = checkTripFeasibility({
        destinationIds: selectedDestinations,
        transportType,
        numberOfDays
      });
      setIsFeasible(feasibility.feasible);
      setFeasibilityDetails(feasibility);
    }
  }, [selectedDestinations, transportType, numberOfDays, checkTripFeasibility]);

  useEffect(() => {
    if (selectedDestinations.length > 1) {
      const suggested = getSuggestedTransport(selectedDestinations, numberOfDays, isPremium);
      setSuggestedTransport(suggested);
      if (!selectedTransport) {
        setTransportType(suggested.recommendedType);
      }
    }
  }, [selectedDestinations, numberOfDays, isPremium, getSuggestedTransport, selectedTransport]);

  const handleSelectDestination = (destinationId: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const handleSelectTransport = (transportId: string) => {
    setSelectedTransport(transportId);
    const transport = transports.find(t => t.id === transportId);
    if (transport) {
      setTransportType(transport.type);
    }
  };

  const handleSelectHotelType = (hotelType: 'budget' | 'standard' | 'luxury') => {
    setHotelType(hotelType);
  };

  const handleSelectGuide = (guideId: string) => {
    setSelectedGuides(prev =>
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
  };

  const handleAdjustDays = (suggestedDays: number) => {
    setNumberOfDays(suggestedDays);
    toast({
      title: "Trip Duration Updated",
      description: `Your trip has been adjusted to ${suggestedDays} days.`,
    });
  };

  const handleSuggestTransport = (suggestedType: 'bus' | 'train' | 'flight' | 'car') => {
    setTransportType(suggestedType);
    const defaultTransport = transports.find(t => t.type === suggestedType);
    if (defaultTransport) {
      setSelectedTransport(defaultTransport.id);
    }
    
    toast({
      title: "Transport Updated",
      description: `Your transport type has been set to ${suggestedType}.`,
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (selectedDestinations.length === 0) {
      toast({
        title: "Destination Required",
        description: "Please select at least one destination for your trip.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Start Date Required",
        description: "Please select a start date for your trip.",
        variant: "destructive",
      });
      return;
    }

    setIsPlanning(true);
    try {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + numberOfDays - 1);

      const tripPlanData = {
        userId: currentUser?.id || 'guest',
        selectedDestinations,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfDays,
        numberOfPeople,
        hotelType,
        selectedTransport,
        transportType,
        guideIds: selectedGuides,
        totalCost,
        status: 'confirmed' as const,
        isPremium,
        sleepTransport,
        travelStyle
      };

      const tripPlanId = await saveTripPlan(tripPlanData);
      toast({
        title: "Trip Planned Successfully",
        description: "Your trip has been created. Redirecting to details page...",
      });
      navigate(`/bookings/${tripPlanId}`);
    } catch (error: any) {
      console.error('Error saving trip plan:', error);
      toast({
        title: "Trip Planning Failed",
        description: error.message || "There was an error planning your trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const filteredHotels = hotels.filter(hotel => 
    selectedDestinations.includes(hotel.destinationId) && hotel.type === hotelType
  );

  const relevantTransports = transports.filter(transport => 
    transport.type === transportType
  );

  const availableGuides = guides.filter(guide => 
    selectedDestinations.some(destId => guide.destinationId === destId)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
        <p className="text-muted-foreground">Create your perfect travel itinerary with Zenway Travels</p>
      </div>

      <div className="mb-6">
        <PremiumFeaturesBanner isPremium={isPremium} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="dates">Dates & People</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="destinations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Destinations</CardTitle>
                  <CardDescription>
                    Choose one or more destinations for your trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DestinationSelector 
                    destinations={destinations}
                    selectedDestinations={selectedDestinations}
                    onSelectDestination={handleSelectDestination}
                  />
                </CardContent>
              </Card>

              {selectedDestinations.length > 0 && (
                <TripDistanceCalculator
                  destinationIds={selectedDestinations}
                  numberOfDays={numberOfDays}
                  startDate={startDate}
                  selectedTransportType={transportType}
                  onSuggestTransport={handleSuggestTransport}
                  onSuggestDays={handleAdjustDays}
                />
              )}
            </TabsContent>
            
            <TabsContent value="dates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Duration & Group Size</CardTitle>
                  <CardDescription>
                    Select your travel dates and number of travelers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DatePeoplePicker 
                    numberOfDays={numberOfDays}
                    setNumberOfDays={setNumberOfDays}
                    numberOfPeople={numberOfPeople}
                    setNumberOfPeople={setNumberOfPeople}
                    startDate={startDate}
                    setStartDate={setStartDate}
                  />
                </CardContent>
              </Card>
              
              {!isFeasible && feasibilityDetails && (
                <TripValidation
                  feasible={isFeasible}
                  daysNeeded={feasibilityDetails.daysNeeded}
                  daysShort={feasibilityDetails.daysShort}
                  breakdown={feasibilityDetails.breakdown}
                  transportType={transportType}
                  totalDistance={feasibilityDetails.totalDistance}
                  totalTravelHours={feasibilityDetails.totalTravelHours}
                  onAdjustDays={() => handleAdjustDays(feasibilityDetails.daysNeeded)}
                  onContinue={() => setActiveTab('accommodation')}
                  isPremium={isPremium}
                />
              )}
            </TabsContent>
            
            <TabsContent value="accommodation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accommodation</CardTitle>
                  <CardDescription>
                    Choose your hotel type and travel style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HotelTypeSelector 
                    hotelType={hotelType}
                    handleSelectHotelType={handleSelectHotelType}
                    travelStyle={travelStyle}
                    setTravelStyle={setTravelStyle}
                    selectedDestinations={selectedDestinations}
                    filteredHotels={filteredHotels}
                    getDestinationById={getDestinationById}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transport" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transport</CardTitle>
                  <CardDescription>
                    Choose your preferred mode of travel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransportTypeSelector 
                    transportType={transportType}
                    setTransportType={setTransportType}
                    sleepTransport={sleepTransport}
                    setSleepTransport={setSleepTransport}
                    relevantTransports={relevantTransports}
                    selectedTransport={selectedTransport}
                    handleSelectTransport={handleSelectTransport}
                    suggestedTransport={suggestedTransport}
                    isPremium={isPremium}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guides</CardTitle>
                  <CardDescription>
                    Optional: Select a guide for your trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GuideSelector 
                    selectedDestinations={selectedDestinations}
                    availableGuides={availableGuides}
                    selectedGuides={selectedGuides}
                    handleSelectGuide={handleSelectGuide}
                    isPremium={isPremium}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <TripCostBreakdown 
            selectedDestinations={selectedDestinations}
            startDate={startDate}
            numberOfDays={numberOfDays}
            numberOfPeople={numberOfPeople}
            hotelType={hotelType}
            travelStyle={travelStyle}
            transportType={transportType}
            sleepTransport={sleepTransport}
            selectedGuides={selectedGuides}
            guides={guides}
            costBreakdown={costBreakdown}
            totalCost={totalCost}
            isPlanning={isPlanning}
            isFeasible={isFeasible}
            getDestinationById={getDestinationById}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
