// Update imports to fix missing methods
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useDestinations } from '../context/DestinationContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Calendar as CalendarIcon, Users, Route, Hotel, Bus, Car, Train, Plane, User, Check, X, Star } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

interface BookingItemProps {
  booking: any;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  const { getDestinationById } = useDestinations();
  const destination = getDestinationById(booking.destinationId);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Booking ID: {booking.id}</CardTitle>
        <CardDescription>
          {destination ? destination.name : 'Destination Details'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium leading-none">Destination</p>
            <p className="text-sm text-gray-500">
              {destination ? `${destination.city}, ${destination.state}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Number of Travelers</p>
            <p className="text-sm text-gray-500">{booking.numberOfTravelers}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium leading-none">Start Date</p>
            <p className="text-sm text-gray-500">{format(new Date(booking.startDate), 'PPP')}</p>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">End Date</p>
            <p className="text-sm text-gray-500">{format(new Date(booking.endDate), 'PPP')}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Total Price</p>
          <p className="text-sm text-gray-500">{formatPrice(booking.totalPrice)}</p>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Status</p>
          <Badge variant="secondary">{booking.status || 'Confirmed'}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const MyBookings = () => {
  const { getUserBookings, getUserTripPlans } = useBookings();
  const { getDestinationById } = useDestinations();
  const { currentUser } = useAuth();

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
        <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
        
        {bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map(booking => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
