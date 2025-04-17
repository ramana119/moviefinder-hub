
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useDestinations } from '../context/DestinationContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar as CalendarIcon, Users, Route, Hotel, Bus, Car, Train, Plane, User, Check, X, Star, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '../utils/helpers';

interface BookingItemProps {
  booking: any;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  const { getDestinationById } = useDestinations();
  const destination = getDestinationById(booking.destinationId);
  
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800"
  };
  
  const statusColor = statusColors[booking.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";

  return (
    <Card className="mb-4 overflow-hidden border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-32 md:h-auto bg-gray-200 relative overflow-hidden">
          <img 
            src={destination?.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
            alt={destination?.name || "Destination"} 
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {booking.status || 'Confirmed'}
          </div>
        </div>
        
        <div className="w-full md:w-3/4 p-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">{destination?.name || "Destination Details"}</h3>
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {destination ? `${destination.city}, ${destination.state}` : 'Location unavailable'}
              </p>
            </div>
            <div className="text-right mt-2 md:mt-0">
              <p className="text-lg font-bold">{formatPrice(booking.totalPrice)}</p>
              <p className="text-xs text-gray-500">Booking ID: {booking.id.substring(0, 8)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Travel Dates</p>
                <p className="text-sm">{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Travelers</p>
                <p className="text-sm">{booking.numberOfTravelers} {booking.numberOfTravelers === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm">
                  {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button asChild variant="outline" size="sm" className="mr-2">
              <Link to={`/bookings/${booking.id}`}>View Details</Link>
            </Button>
            {booking.status !== 'cancelled' && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const TripPlanItem: React.FC<{ tripPlan: any }> = ({ tripPlan }) => {
  const { getDestinationById } = useDestinations();
  const mainDestination = getDestinationById(tripPlan.selectedDestinations[0]);
  
  return (
    <Card className="mb-4 overflow-hidden border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-32 md:h-auto bg-gray-200 relative overflow-hidden">
          <img 
            src={mainDestination?.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
            alt={mainDestination?.name || "Trip"} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {tripPlan.status || 'Planning'}
          </div>
        </div>
        
        <div className="w-full md:w-3/4 p-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {tripPlan.selectedDestinations.length > 1 
                  ? `${tripPlan.selectedDestinations.length} Destination Trip` 
                  : mainDestination?.name || "Trip Plan"}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {tripPlan.selectedDestinations.map((id: string, index: number) => {
                  const dest = getDestinationById(id);
                  return dest ? (
                    <span key={id}>
                      {dest.name}
                      {index < tripPlan.selectedDestinations.length - 1 ? ' • ' : ''}
                    </span>
                  ) : null;
                })}
              </p>
            </div>
            <div className="text-right mt-2 md:mt-0">
              <p className="text-lg font-bold">{formatPrice(tripPlan.totalCost || 0)}</p>
              <p className="text-xs text-gray-500">Created {format(new Date(tripPlan.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Travel Dates</p>
                <p className="text-sm">
                  {format(new Date(tripPlan.startDate), 'MMM d')} - 
                  {tripPlan.endDate 
                    ? format(new Date(tripPlan.endDate), 'MMM d, yyyy') 
                    : format(new Date(new Date(tripPlan.startDate).getTime() + (tripPlan.numberOfDays * 24 * 60 * 60 * 1000)), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Travelers</p>
                <p className="text-sm">{tripPlan.numberOfPeople} {tripPlan.numberOfPeople === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
            
            {tripPlan.transportType && (
              <div className="flex items-center">
                {tripPlan.transportType === 'car' && <Car className="h-4 w-4 text-gray-500 mr-2" />}
                {tripPlan.transportType === 'bus' && <Bus className="h-4 w-4 text-gray-500 mr-2" />}
                {tripPlan.transportType === 'train' && <Train className="h-4 w-4 text-gray-500 mr-2" />}
                {tripPlan.transportType === 'flight' && <Plane className="h-4 w-4 text-gray-500 mr-2" />}
                <div>
                  <p className="text-xs text-gray-500">Transport</p>
                  <p className="text-sm capitalize">{tripPlan.transportType}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button asChild variant="outline" size="sm" className="mr-2">
              <Link to={`/bookings/${tripPlan.id}`}>View Trip</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const MyBookings = () => {
  const { getUserBookings, getUserTripPlans } = useBookings();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("trips");
  const [bookings, setBookings] = useState<any[]>([]);
  const [tripPlans, setTripPlans] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      const userBookings = getUserBookings(currentUser.id);
      setBookings(userBookings);

      const userTripPlans = getUserTripPlans(currentUser.id);
      setTripPlans(userTripPlans);
    }
  }, [currentUser, getUserBookings, getUserTripPlans]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Travel History</h1>
            <p className="text-gray-600 mt-1">View and manage your trips and bookings</p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/trip-planner">
              Plan New Trip <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="trips">Trip Plans</TabsTrigger>
                <TabsTrigger value="bookings">Direct Bookings</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="trips" className="p-6">
              {tripPlans.length > 0 ? (
                <div className="space-y-4">
                  {tripPlans.map(tripPlan => (
                    <TripPlanItem key={tripPlan.id} tripPlan={tripPlan} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">No Trip Plans Yet</h3>
                  <p className="text-gray-500 mt-1 mb-4">Start planning your first adventure</p>
                  <Button asChild>
                    <Link to="/trip-planner">Plan a Trip</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bookings" className="p-6">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">No Bookings Yet</h3>
                  <p className="text-gray-500 mt-1 mb-4">Book your first destination</p>
                  <Button asChild>
                    <Link to="/destinations">Explore Destinations</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;
