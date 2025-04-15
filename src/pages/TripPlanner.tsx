import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDestinations } from '../context/DestinationContext';
import { useTripPlanning } from '../context/TripPlanningContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import DestinationCard from '../components/DestinationCard';
import TransportOptionCard from '../components/TransportOptionCard';
import HotelCard from '../components/HotelCard';
import GuideCard from '../components/GuideCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '../utils/helpers';
import { Loader2, MapPin, Calendar as CalendarIcon, Users, Route, Hotel, Bus, Car, Train, Plane, User, Check, X, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Destination, TransportType, HotelType, GuideType } from '../types';

const TripPlanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destinations, getDestinationById } = useDestinations();
  const { hotels, transports, guides, calculateTripCost, checkTripFeasibility, getSuggestedTransport, getTransportAmenities, saveTripPlan } = useTripPlanning();
  const { currentUser } = useAuth();

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
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [isFeasible, setIsFeasible] = useState<boolean>(true);
  const [feasibilityDetails, setFeasibilityDetails] = useState<any>(null);
  const [suggestedTransport, setSuggestedTransport] = useState<any>(null);
  const [transportAmenities, setTransportAmenities] = useState<string[]>([]);
  const [hotelProximity, setHotelProximity] = useState<number>(5);

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
    const cost = calculateTripCost({
      destinationIds: selectedDestinations,
      guideIds: selectedGuides,
      hotelType,
      transportType,
      numberOfDays,
      numberOfPeople
    });
    setTotalCost(cost.totalCost);
  }, [selectedDestinations, selectedGuides, hotelType, transportType, numberOfDays, numberOfPeople, calculateTripCost]);

  useEffect(() => {
    const feasibility = checkTripFeasibility({
      destinationIds: selectedDestinations,
      transportType,
      numberOfDays
    });
    setIsFeasible(feasibility.feasible);
    setFeasibilityDetails(feasibility);
  }, [selectedDestinations, transportType, numberOfDays, checkTripFeasibility]);

  useEffect(() => {
    if (selectedDestinations.length > 1) {
      const suggested = getSuggestedTransport(selectedDestinations, numberOfDays, isPremium);
      setSuggestedTransport(suggested);
      setTransportType(suggested.recommendedType);
    }
  }, [selectedDestinations, numberOfDays, isPremium, getSuggestedTransport]);

  useEffect(() => {
    if (suggestedTransport) {
      const isOvernight = numberOfDays > 2 && sleepTransport;
      const amenities = getTransportAmenities(suggestedTransport.recommendedType, isOvernight);
      setTransportAmenities(amenities);
    }
  }, [suggestedTransport, sleepTransport, numberOfDays, getTransportAmenities]);

  const handleSelectDestination = (destinationId: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const handleSelectTransport = (transportId: string) => {
    setSelectedTransport(transportId);
  };

  const handleSelectHotelType = (hotelType: 'budget' | 'standard' | 'luxury') => {
    setHotelType(hotelType);
  };

  const handleSelectGuide = (guideId: string) => {
    setSelectedGuides(prev =>
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
  };

  const handleSubmit = async () => {
    setIsPlanning(true);
    try {
      if (!startDate) {
        throw new Error('Please select a start date');
      }

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + numberOfDays);

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
      navigate(`/bookings/${tripPlanId}`);
    } catch (error: any) {
      console.error('Error saving trip plan:', error);
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
      default: return <Route className="h-4 w-4" />;
    }
  };

  const renderDestinationCard = (destination: Destination, isSelected: boolean) => {
    return (
      <Card 
        key={destination.id}
        className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleSelectDestination(destination.id)}
      >
        <CardContent className="p-0">
          <div className="relative h-40">
            <img
              src={destination.images[0] || destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-white stroke-black/50 stroke-1" />
              <span className="text-sm text-white font-semibold drop-shadow-md">{destination.city}, {destination.state}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{destination.name}</h3>
            <p className="text-sm text-gray-500">{destination.description.substring(0, 50)}...</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTransportOption = (transport: TransportType) => {
    const isSelected = selectedTransport === transport.id;

    return (
      <TransportOptionCard
        key={transport.id}
        transport={transport}
        onSelect={handleSelectTransport}
        isSelected={isSelected}
      />
    );
  };

  const renderHotelOption = (hotel: HotelType) => {
    const destination = selectedDestinations.length > 0 ? getDestinationById(selectedDestinations[0]) : null;

    return (
      <HotelCard
        key={hotel.id}
        hotel={hotel}
        destination={destination}
      />
    );
  };

  const renderGuideOption = (guide: GuideType) => {
    return (
      <GuideCard
        key={guide.id}
        guide={guide}
        onSelect={handleSelectGuide}
        isSelected={selectedGuides.includes(guide.id)}
      />
    );
  };

  const renderItineraryDestination = (destination: Destination, index: number) => {
    return (
      <div className="flex items-center gap-3 mb-4" key={destination.id}>
        <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
          <img 
            src={destination.images[0] || destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{destination.name}</h4>
          <p className="text-sm text-muted-foreground">{destination.city}, {destination.state}</p>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
          <p className="text-gray-600">Create your perfect travel itinerary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Planning Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>
                  Enter the details of your dream trip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destinations">Destinations</Label>
                  <ScrollArea className="h-40 p-2 rounded-md border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {destinations.map(destination => (
                        renderDestinationCard(destination, selectedDestinations.includes(destination.id))
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="numberOfDays">Number of Days</Label>
                    <Input
                      id="numberOfDays"
                      type="number"
                      min="1"
                      max="14"
                      value={numberOfDays}
                      onChange={e => setNumberOfDays(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople">Number of People</Label>
                    <Input
                      id="numberOfPeople"
                      type="number"
                      min="1"
                      max="10"
                      value={numberOfPeople}
                      onChange={e => setNumberOfPeople(parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotelType">Hotel Type</Label>
                    <Select value={hotelType} onValueChange={handleSelectHotelType}>
                      <SelectTrigger id="hotelType">
                        <SelectValue placeholder="Select hotel type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportType">Transport Type</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setTransportType('bus')}
                      className={transportType === 'bus' ? 'ring-2 ring-primary' : ''}
                    >
                      {getTravelIcon('bus')}
                      Bus
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTransportType('train')}
                      className={transportType === 'train' ? 'ring-2 ring-primary' : ''}
                    >
                      {getTravelIcon('train')}
                      Train
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTransportType('flight')}
                      className={transportType === 'flight' ? 'ring-2 ring-primary' : ''}
                    >
                      {getTravelIcon('flight')}
                      Flight
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTransportType('car')}
                      className={transportType === 'car' ? 'ring-2 ring-primary' : ''}
                    >
                      {getTravelIcon('car')}
                      Car
                    </Button>
                  </div>
                </div>

                {suggestedTransport && (
                  <div className="p-4 rounded-md bg-muted">
                    <p className="text-sm text-muted-foreground">
                      Based on your selected destinations, we recommend traveling by <strong>{suggestedTransport.recommendedType}</strong>.
                      {isPremium && suggestedTransport.premiumAdvantages && (
                        <>
                          <br />
                          <span className="font-medium">Premium Benefits:</span>
                          <ul>
                            {suggestedTransport.premiumAdvantages.map((benefit, index) => (
                              <li key={index} className="list-disc ml-5 text-xs">{benefit}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="guides">Guides</Label>
                  <ScrollArea className="h-40 p-2 rounded-md border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedDestinations.map(destinationId => {
                        const availableGuides = guides.filter(guide => guide.destinationId === destinationId);
                        return availableGuides.map(guide => renderGuideOption(guide));
                      })}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sleepTransport"
                    checked={sleepTransport}
                    onCheckedChange={setSleepTransport}
                  />
                  <Label htmlFor="sleepTransport">Include overnight travel</Label>
                </div>

                <div className="space-y-2">
                  <Label>Travel Style</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setTravelStyle('base-hotel')}
                      className={travelStyle === 'base-hotel' ? 'ring-2 ring-primary' : ''}
                    >
                      Base Hotel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTravelStyle('mobile')}
                      className={travelStyle === 'mobile' ? 'ring-2 ring-primary' : ''}
                    >
                      Mobile (Multiple Hotels)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Destinations</h4>
                  {selectedDestinations.length > 0 ? (
                    selectedDestinations.map((destinationId, index) => {
                      const destination = getDestinationById(destinationId);
                      return destination ? renderItineraryDestination(destination, index) : null;
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No destinations selected</p>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Dates</h4>
                  {startDate ? (
                    <p className="text-sm">{format(startDate, 'PPP')} - {format(new Date(startDate.setDate(startDate.getDate() + numberOfDays)), 'PPP')}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No dates selected</p>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">People</h4>
                  <p className="text-sm">{numberOfPeople} travelers</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Hotel</h4>
                  <p className="text-sm">{hotelType}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Transport</h4>
                  <div className="flex items-center">
                    {getTravelIcon(transportType)}
                    <p className="text-sm ml-1">{transportType}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Guides</h4>
                  {selectedGuides.length > 0 ? (
                    selectedGuides.map(guideId => {
                      const guide = guides.find(g => g.id === guideId);
                      return guide ? (
                        <p key={guide.id} className="text-sm">{guide.name}</p>
                      ) : null;
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No guides selected</p>
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span>{formatPrice(totalCost)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isPlanning}>
                  {isPlanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Planning...
                    </>
                  ) : (
                    'Create Trip Plan'
                  )}
                </Button>
              </CardFooter>
            </Card>

            {feasibilityDetails && !isFeasible && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Trip Feasibility</CardTitle>
                  <CardDescription>
                    This trip may not be feasible with the selected number of days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Days Needed: {feasibilityDetails.daysNeeded}
                  </p>
                  {feasibilityDetails.daysShort && (
                    <p>
                      Days Short: {feasibilityDetails.daysShort}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripPlanner;
