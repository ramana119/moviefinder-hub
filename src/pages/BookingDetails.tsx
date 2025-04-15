import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useDestinations } from '../context/DestinationContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatPrice } from '../utils/helpers';
import { format, parseISO } from 'date-fns';
import { MapPin, Calendar, Users, CreditCard, AlertTriangle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Booking, TripPlan } from '../types';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookingById, cancelBooking, getUserTripPlans } = useBookings();
  const { getDestinationById } = useDestinations();
  const { currentUser } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [destination, setDestination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  useEffect(() => {
    if (id) {
      const bookingData = getBookingById(id);
      if (bookingData) {
        setBooking(bookingData);
        
        const dest = getDestinationById(bookingData.destinationId);
        if (dest) {
          setDestination(dest);
        }
        
        // If this booking is linked to a trip plan, fetch it
        if (bookingData.tripPlanId && currentUser) {
          const userTripPlans = getUserTripPlans(currentUser.id);
          const linkedTripPlan = userTripPlans.find(plan => plan.id === bookingData.tripPlanId);
          if (linkedTripPlan) {
            setTripPlan(linkedTripPlan);
          }
        }
      } else {
        // Booking not found, redirect to bookings list
        navigate('/bookings');
      }
    }
  }, [id, getBookingById, getDestinationById, navigate, currentUser, getUserTripPlans]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    setIsLoading(true);
    try {
      await cancelBooking(booking.id);
      setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  if (!booking || !destination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/bookings')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>Loading booking details...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/bookings')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>

        {booking.status === 'cancelled' && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Booking Cancelled</AlertTitle>
            <AlertDescription>
              This booking has been cancelled and is no longer valid.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
                <CardDescription>
                  Booking ID: {booking.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <h3 className="font-medium">{destination.name}</h3>
                    <p className="text-sm text-gray-500">{destination.city}, {destination.state}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Visit Date</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.startDate)}
                      {booking.endDate && booking.endDate !== booking.startDate && 
                        ` - ${formatDate(booking.endDate)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Number of Visitors</h3>
                    <p className="text-sm text-gray-500">{booking.numberOfTravelers} people</p>
                  </div>
                </div>

                {booking.timeSlot && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Time Slot</h3>
                      <p className="text-sm text-gray-500">{booking.timeSlot}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Payment</h3>
                    <p className="text-sm text-gray-500">
                      Total Amount: {formatPrice(booking.totalPrice || booking.totalAmount || 0)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Booking Status</h3>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'}>
                      {booking.status || 'Confirmed'}
                    </Badge>
                  </div>
                </div>

                {tripPlan && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Part of Trip Plan</h3>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/trip-plans/${tripPlan.id}`)}
                      >
                        View Full Trip Plan
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {booking.status !== 'cancelled' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Destination</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-48">
                  <img 
                    src={destination.images?.[0] || destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{destination.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {destination.description.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {destination.tags && destination.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BookingDetails;
