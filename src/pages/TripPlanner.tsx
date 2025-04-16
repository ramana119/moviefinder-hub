
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDestinations } from '../context/DestinationContext';
import { useTripPlanning } from '../context/TripPlanningContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/Layout';
import DestinationCard from '../components/DestinationCard';
import TransportOptionCard from '../components/TransportOptionCard';
import HotelCard from '../components/HotelCard';
import GuideCard from '../components/GuideCard';
import TripValidation from '../components/TripValidation';
import TripDistanceCalculator from '../components/TripDistanceCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '../utils/helpers';
import { MapPin, Calendar as CalendarIcon, Users, Hotel, Bus, Car, Train, Plane, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Destination, TransportType } from '../types';

const TripPlanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destinations, getDestinationById } = useDestinations();
  const { hotels, transports, guides, calculateTripCost, checkTripFeasibility, getSuggestedTransport, getTransportAmenities, saveTripPlan } = useTripPlanning();
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

  // Initialize with destination from params if available
  useEffect(() => {
    if (destinationIdFromParams && !selectedDestinations.includes(destinationIdFromParams)) {
      setSelectedDestinations([destinationIdFromParams]);
    }
  }, [destinationIdFromParams, selectedDestinations]);

  // Set premium status based on user
  useEffect(() => {
    if (currentUser?.isPremium) {
      setIsPremium(true);
    }
  }, [currentUser]);

  // Calculate cost whenever relevant inputs change
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
      setTotalCost(cost.totalCost);
      setCostBreakdown({
        destinationsCost: cost.destinationsCost,
        hotelsCost: cost.hotelsCost,
        transportCost: cost.transportCost,
        guidesCost: cost.guidesCost
      });
    }
  }, [selectedDestinations, selectedGuides, hotelType, transportType, numberOfDays, numberOfPeople, calculateTripCost]);

  // Check trip feasibility
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

  // Get suggested transport
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
    // Also select a default transport of this type
    const defaultTransport = transports.find(t => t.type === suggestedType);
    if (defaultTransport) {
      setSelectedTransport(defaultTransport.id);
    }
    
    toast({
      title: "Transport Updated",
      description: `Your transport type has been set to ${suggestedType}.`,
    });
  };

  const handleSubmit = async () => {
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
        status: 'planning' as const,
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

  const getTravelIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'train': return <Train className="h-4 w-4" />;
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const filteredHotels = hotels.filter(hotel => 
    selectedDestinations.includes(hotel.destinationId) && hotel.type === hotelType
  );

  const relevantTransports = transports.filter(transport => 
    transport.type === transportType
  );

  const availableGuides = guides.filter(guide => 
    selectedDestinations.includes(guide.destinationId)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
          <p className="text-gray-600">Create your perfect travel itinerary</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planning Form */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {destinations.map(destination => (
                        <Card 
                          key={destination.id}
                          className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                            selectedDestinations.includes(destination.id) ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleSelectDestination(destination.id)}
                        >
                          <CardContent className="p-0">
                            <div className="relative h-40">
                              <img
                                src={destination.images?.[0] || destination.image}
                                alt={destination.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-white drop-shadow-md" />
                                <span className="text-sm text-white font-semibold drop-shadow-md">
                                  {destination.city}, {destination.state}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="text-lg font-semibold">{destination.name}</h3>
                              <p className="text-sm text-gray-500 line-clamp-2">{destination.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Calculated)</Label>
                        <div className="flex items-center h-10 px-4 border rounded-md bg-muted text-muted-foreground">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate && numberOfDays
                            ? format(addDays(startDate, numberOfDays - 1), "PPP")
                            : "Select start date first"
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfDays">Number of Days</Label>
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon"
                            disabled={numberOfDays <= 1}
                            onClick={() => setNumberOfDays(prev => Math.max(1, prev - 1))}
                          >
                            -
                          </Button>
                          <Input
                            id="numberOfDays"
                            type="number"
                            min="1"
                            max="30"
                            value={numberOfDays}
                            onChange={e => setNumberOfDays(parseInt(e.target.value) || 1)}
                            className="mx-2 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setNumberOfDays(prev => prev + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numberOfPeople">Number of People</Label>
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon"
                            disabled={numberOfPeople <= 1}
                            onClick={() => setNumberOfPeople(prev => Math.max(1, prev - 1))}
                          >
                            -
                          </Button>
                          <Input
                            id="numberOfPeople"
                            type="number"
                            min="1"
                            max="20"
                            value={numberOfPeople}
                            onChange={e => setNumberOfPeople(parseInt(e.target.value) || 1)}
                            className="mx-2 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setNumberOfPeople(prev => prev + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
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
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="hotelType">Hotel Type</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <Button
                          variant={hotelType === 'budget' ? 'default' : 'outline'}
                          onClick={() => handleSelectHotelType('budget')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Hotel className="h-6 w-6 mb-2" />
                          <span>Budget</span>
                          <span className="text-xs mt-1">Economic</span>
                        </Button>
                        <Button
                          variant={hotelType === 'standard' ? 'default' : 'outline'}
                          onClick={() => handleSelectHotelType('standard')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Hotel className="h-6 w-6 mb-2" />
                          <span>Standard</span>
                          <span className="text-xs mt-1">Comfortable</span>
                        </Button>
                        <Button
                          variant={hotelType === 'luxury' ? 'default' : 'outline'}
                          onClick={() => handleSelectHotelType('luxury')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Hotel className="h-6 w-6 mb-2" />
                          <span>Luxury</span>
                          <span className="text-xs mt-1">Premium</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Travel Style</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant={travelStyle === 'base-hotel' ? 'default' : 'outline'}
                          onClick={() => setTravelStyle('base-hotel')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Hotel className="h-6 w-6 mb-2" />
                          <span>Base Hotel</span>
                          <span className="text-xs mt-1">Stay at one location</span>
                        </Button>
                        <Button
                          variant={travelStyle === 'mobile' ? 'default' : 'outline'}
                          onClick={() => setTravelStyle('mobile')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Hotel className="h-6 w-6 mb-2" />
                          <span>Multi-Hotel</span>
                          <span className="text-xs mt-1">Stay at multiple locations</span>
                        </Button>
                      </div>
                    </div>

                    {selectedDestinations.length > 0 && (
                      <div className="space-y-2">
                        <Label>Available Hotels</Label>
                        {filteredHotels.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredHotels.slice(0, 4).map(hotel => (
                              <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                                destination={getDestinationById(hotel.destinationId)}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No hotels available for the selected destinations and type.
                            Please select different destinations or hotel type.
                          </p>
                        )}
                      </div>
                    )}
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
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="transportType">Transport Type</Label>
                      <div className="grid grid-cols-4 gap-4">
                        <Button
                          variant={transportType === 'bus' ? 'default' : 'outline'}
                          onClick={() => setTransportType('bus')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Bus className="h-6 w-6 mb-2" />
                          <span>Bus</span>
                        </Button>
                        <Button
                          variant={transportType === 'train' ? 'default' : 'outline'}
                          onClick={() => setTransportType('train')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Train className="h-6 w-6 mb-2" />
                          <span>Train</span>
                        </Button>
                        <Button
                          variant={transportType === 'flight' ? 'default' : 'outline'}
                          onClick={() => setTransportType('flight')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Plane className="h-6 w-6 mb-2" />
                          <span>Flight</span>
                        </Button>
                        <Button
                          variant={transportType === 'car' ? 'default' : 'outline'}
                          onClick={() => setTransportType('car')}
                          className="flex flex-col h-auto py-4"
                        >
                          <Car className="h-6 w-6 mb-2" />
                          <span>Car</span>
                        </Button>
                      </div>
                    </div>
                    
                    {suggestedTransport && (
                      <Card className="bg-muted border-0">
                        <CardContent className="p-4">
                          <p className="text-sm">
                            <span className="font-medium">Recommendation:</span> We suggest traveling by{' '}
                            <span className="font-medium capitalize">{suggestedTransport.recommendedType}</span>{' '}
                            for your selected destinations.
                          </p>
                          {isPremium && suggestedTransport.premiumAdvantages && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Premium Benefits:</p>
                              <ul className="mt-1 text-xs space-y-1">
                                {suggestedTransport.premiumAdvantages.map((benefit: string, i: number) => (
                                  <li key={i} className="flex">
                                    <span className="mr-2">•</span>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Transport Options</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sleepTransport"
                            checked={sleepTransport}
                            onCheckedChange={(checked) => setSleepTransport(!!checked)}
                          />
                          <label
                            htmlFor="sleepTransport"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include overnight travel
                          </label>
                        </div>
                      </div>
                      
                      {relevantTransports.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {relevantTransports.slice(0, 4).map(transport => (
                            <TransportOptionCard
                              key={transport.id}
                              transport={transport}
                              isSelected={selectedTransport === transport.id}
                              onSelect={handleSelectTransport}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No transport options available for the selected type.
                          Please select a different transport type.
                        </p>
                      )}
                    </div>
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
                    {selectedDestinations.length > 0 ? (
                      <>
                        {availableGuides.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {availableGuides.map(guide => (
                              <GuideCard
                                key={guide.id}
                                guide={guide}
                                isSelected={selectedGuides.includes(guide.id)}
                                onSelect={handleSelectGuide}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No guides available for the selected destinations.
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Please select destinations first to see available guides.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Trip Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Destinations</h4>
                  {selectedDestinations.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {selectedDestinations.map((destinationId, index) => {
                        const destination = getDestinationById(destinationId);
                        return destination ? (
                          <div className="flex items-center gap-3 mb-3" key={destination.id}>
                            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                              <img 
                                src={destination.images?.[0] || destination.image} 
                                alt={destination.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{destination.name}</h4>
                              <p className="text-sm text-muted-foreground">{destination.city}, {destination.state}</p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No destinations selected</p>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Dates</h4>
                  {startDate ? (
                    <p className="text-sm">
                      {format(startDate, 'PPP')} - {
                        format(addDays(startDate, numberOfDays - 1), 'PPP')
                      }
                      <span className="text-xs text-muted-foreground ml-2">
                        ({numberOfDays} {numberOfDays === 1 ? 'day' : 'days'})
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No dates selected</p>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">People</h4>
                  <p className="text-sm">{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Hotel</h4>
                  <p className="text-sm capitalize">{hotelType} ({travelStyle === 'base-hotel' ? 'Base Hotel' : 'Multi-Hotel'})</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Transport</h4>
                  <div className="flex items-center">
                    {getTravelIcon(transportType)}
                    <p className="text-sm ml-1 capitalize">{transportType}</p>
                    {sleepTransport && (
                      <span className="text-xs ml-2 bg-muted px-2 py-0.5 rounded-full">Overnight</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Guides</h4>
                  {selectedGuides.length > 0 ? (
                    <div>
                      {selectedGuides.map((guideId) => {
                        const guide = guides.find(g => g.id === guideId);
                        return guide ? (
                          <div key={guide.id} className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                              <img 
                                src={guide.imageUrl} 
                                alt={guide.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-sm">{guide.name}</p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No guides selected</p>
                  )}
                </div>

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="text-sm flex justify-between">
                    <span>Destinations:</span>
                    <span>{formatPrice(costBreakdown.destinationsCost)}</span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Hotels ({numberOfDays} {numberOfDays === 1 ? 'night' : 'nights'}):</span>
                    <span>{formatPrice(costBreakdown.hotelsCost)}</span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Transport:</span>
                    <span>{formatPrice(costBreakdown.transportCost)}</span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Guides:</span>
                    <span>{formatPrice(costBreakdown.guidesCost)}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span>{formatPrice(totalCost)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full" onClick={handleSubmit} disabled={isPlanning || selectedDestinations.length === 0}>
                  {isPlanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Planning...
                    </>
                  ) : (
                    'Create Trip Plan'
                  )}
                </Button>
                {!isFeasible && (
                  <p className="text-sm text-amber-600">
                    ⚠️ This trip is not feasible with current days. Consider adding more days.
                  </p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripPlanner;
