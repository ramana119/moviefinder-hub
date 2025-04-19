
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripPlanning } from '../context/TripPlanningContext';
import { useDestinations } from '../context/DestinationContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TripPlan, TripItineraryDay } from '@/types/trip-plan';
import { Destination } from '@/types/destination';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/utils/helpers';
import { format } from 'date-fns';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Car, 
  Bus, 
  Train, 
  Plane, 
  Hotel, 
  User, 
  Info, 
  AlertCircle,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TripPlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { getTripPlanById, cancelTripPlan, loading, error } = useTripPlanning();
  const { getDestinationById } = useDestinations();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (id) {
      const trip = getTripPlanById(id);
      if (trip) {
        setTripPlan(trip);
      } else {
        toast({
          title: 'Trip Plan Not Found',
          description: 'We could not find the requested trip plan.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }
  }, [id, getTripPlanById, toast]);

  // Function to handle trip cancellation
  const handleCancelTrip = async () => {
    if (!tripPlan || !id) return;
    
    setIsCanceling(true);
    try {
      await cancelTripPlan(id);
      toast({
        title: 'Trip Cancelled',
        description: 'Your trip has been successfully cancelled.',
      });
      navigate('/bookings');
    } catch (err) {
      toast({
        title: 'Cancellation Failed',
        description: 'We could not cancel your trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  // Get transport icon based on transport type
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="h-5 w-5" />;
      case 'bus': return <Bus className="h-5 w-5" />;
      case 'train': return <Train className="h-5 w-5" />;
      case 'flight': return <Plane className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tripPlan) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Trip plan not found. Please try again or contact support.'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/bookings')}>Back to My Trips</Button>
      </div>
    );
  }

  // Calculate trip duration
  const startDate = new Date(tripPlan.startDate);
  const endDate = tripPlan.endDate 
    ? new Date(tripPlan.endDate) 
    : new Date(startDate.getTime() + (tripPlan.numberOfDays * 24 * 60 * 60 * 1000));

  // Format dates
  const formattedStartDate = format(startDate, 'MMM d, yyyy');
  const formattedEndDate = format(endDate, 'MMM d, yyyy');

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/bookings')} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Trips
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main trip details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {tripPlan.selectedDestinations.length > 1 
                      ? `${tripPlan.selectedDestinations.length}-Destination Adventure` 
                      : getDestinationById(tripPlan.selectedDestinations[0])?.name || 'Trip Plan'}
                  </CardTitle>
                  <CardDescription>
                    {formattedStartDate} - {formattedEndDate} • {tripPlan.numberOfDays} days
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {tripPlan.isPremium && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Premium
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    tripPlan.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : tripPlan.status === 'cancelled' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {tripPlan.status ? tripPlan.status.charAt(0).toUpperCase() + tripPlan.status.slice(1) : 'Planning'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Travel Dates</h3>
                      <p className="text-muted-foreground">{formattedStartDate} - {formattedEndDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Travelers</h3>
                      <p className="text-muted-foreground">{tripPlan.numberOfPeople} {tripPlan.numberOfPeople === 1 ? 'person' : 'people'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Hotel className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Accommodation</h3>
                      <p className="text-muted-foreground capitalize">
                        {tripPlan.hotelType || 'Standard'} 
                        {tripPlan.travelStyle ? ` (${tripPlan.travelStyle === 'base-hotel' ? 'Base Hotel' : 'Multiple Hotels'})` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    {getTransportIcon(tripPlan.transportType)}
                    <div className="ml-3">
                      <h3 className="font-medium">Transportation</h3>
                      <p className="text-muted-foreground capitalize">
                        {tripPlan.transportType}
                        {tripPlan.sleepTransport ? ' (Overnight travel)' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Destinations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tripPlan.selectedDestinations.map((destId) => {
                    const destination = getDestinationById(destId);
                    return destination ? (
                      <Card key={destId} className="overflow-hidden">
                        <div className="h-32 overflow-hidden">
                          <img 
                            src={destination.image || destination.images?.[0]} 
                            alt={destination.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-medium">{destination.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> 
                            {destination.city}, {destination.state}
                          </p>
                        </CardContent>
                      </Card>
                    ) : null;
                  })}
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-medium text-lg mb-3">Day-by-Day Itinerary</h3>
                <Accordion type="single" collapsible className="w-full">
                  {tripPlan.itinerary?.map((day, index) => (
                    <AccordionItem key={index} value={`day-${index}`}>
                      <AccordionTrigger className="hover:bg-gray-50 px-4">
                        <div className="flex flex-1 items-center justify-between pr-4">
                          <div className="font-medium">
                            Day {day.day} - {format(new Date(day.date), 'MMM d')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {day.isTransitDay ? 'Travel Day' : day.destinationName}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2">
                        <div className="space-y-4">
                          {day.isTransitDay ? (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-start">
                                {getTransportIcon(day.transportDetails?.vehicle || tripPlan.transportType)}
                                <div className="ml-3">
                                  <h4 className="font-medium">{day.destinationName}</h4>
                                  <div className="text-sm text-muted-foreground">
                                    <p>Departure: {day.departureTime}</p>
                                    <p>Arrival: {day.arrivalTime}</p>
                                    <p>Duration: {day.transportDetails?.duration}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {day.activities.map((activity, actIdx) => (
                                <div key={actIdx} className="flex items-start">
                                  <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                                  <p>{activity}</p>
                                </div>
                              ))}
                              
                              <div className="mt-4 pt-2 border-t">
                                <h5 className="font-medium text-sm mb-2">Detailed Schedule</h5>
                                <div className="space-y-2">
                                  {day.detailedSchedule.map((schedule, schedIdx) => (
                                    <div key={schedIdx} className="flex">
                                      <div className="text-xs font-medium text-muted-foreground w-16">
                                        {schedule.time}
                                      </div>
                                      <div>
                                        <p className="text-sm">{schedule.activity}</p>
                                        <p className="text-xs text-muted-foreground">{schedule.location}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {day.hotels && day.hotels.length > 0 && (
                                <div className="mt-3 pt-2 border-t">
                                  <p className="text-sm flex items-center">
                                    <Hotel className="h-4 w-4 mr-2 text-muted-foreground" />
                                    Stay at: {day.hotels.map(hotelId => {
                                      const destination = getDestinationById(hotelId);
                                      return destination ? `${tripPlan.hotelType || 'Standard'} hotel in ${destination.name}` : 'Hotel';
                                    }).join(', ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip summary and actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destinations</span>
                    <span>{formatPrice(tripPlan.totalCost ? tripPlan.totalCost * 0.4 : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accommodation</span>
                    <span>{formatPrice(tripPlan.totalCost ? tripPlan.totalCost * 0.3 : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transportation</span>
                    <span>{formatPrice(tripPlan.totalCost ? tripPlan.totalCost * 0.2 : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guides & Services</span>
                    <span>{formatPrice(tripPlan.totalCost ? tripPlan.totalCost * 0.1 : 0)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="font-bold text-lg">Total</p>
                    <p className="text-xs text-muted-foreground">
                      {tripPlan.numberOfPeople} {tripPlan.numberOfPeople === 1 ? 'person' : 'people'}, {tripPlan.numberOfDays} days
                    </p>
                  </div>
                  <p className="font-bold text-lg">{formatPrice(tripPlan.totalCost || 0)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-3">
              {tripPlan.status !== 'cancelled' ? (
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleCancelTrip}
                  disabled={isCanceling}
                >
                  {isCanceling ? 'Cancelling...' : 'Cancel Trip'}
                </Button>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Trip Cancelled</AlertTitle>
                  <AlertDescription>
                    This trip has been cancelled.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/trip-planner')}
              >
                Plan Similar Trip
              </Button>
            </CardFooter>
          </Card>

          {tripPlan.isPremium && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-amber-600 mr-2">★</span> 
                  Premium Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-amber-600 text-xs">✓</span>
                    </div>
                    <span>Free complimentary guide included</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-amber-600 text-xs">✓</span>
                    </div>
                    <span>Priority hotel bookings</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-amber-600 text-xs">✓</span>
                    </div>
                    <span>Flexible cancellation policy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripPlanDetails;
