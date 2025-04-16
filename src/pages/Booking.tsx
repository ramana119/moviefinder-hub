
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestinations } from '../context/DestinationContext';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, MapPin, Clock, Users, CreditCard, Check } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { formatPrice, getBasePrice } from '../utils/helpers';
import { Label } from '@/components/ui/label';

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDestinationById } = useDestinations();
  const { bookTrip, addBooking, loading } = useBookings();
  const { currentUser } = useAuth();
  
  const [destination, setDestination] = useState<any>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 4));
  const [timeSlot, setTimeSlot] = useState<string>('Morning');
  const [visitors, setVisitors] = useState<number>(1);
  const [ticketType, setTicketType] = useState<string>('Regular');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      const dest = getDestinationById(id);
      setDestination(dest);
    }
  }, [id, getDestinationById]);
  
  const totalAmount = visitors * (destination ? getBasePrice(destination.price || 0) : 0);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!destination) {
        throw new Error('Destination not found');
      }
      
      if (id) {
        const bookingData = {
          userId: currentUser?.id || 'guest',
          destinationId: destination.id,
          checkIn: checkIn?.toISOString() || new Date().toISOString(),
          timeSlot,
          visitors,
          totalAmount,
          ticketType,
          numberOfTravelers: visitors,
          startDate: checkIn?.toISOString() || new Date().toISOString(),
          endDate: checkOut?.toISOString() || new Date().toISOString(),
          totalPrice: totalAmount
        };
        
        await addBooking(bookingData);
      } else {
        const bookingData = {
          userId: currentUser?.id || 'guest',
          destinationId: destination.id,
          checkIn: checkIn?.toISOString() || new Date().toISOString(),
          timeSlot,
          visitors,
          totalAmount,
          ticketType,
          numberOfTravelers: visitors,
          startDate: checkIn?.toISOString() || new Date().toISOString(),
          endDate: checkOut?.toISOString() || new Date().toISOString(),
          totalPrice: totalAmount
        };
        
        await bookTrip(bookingData);
      }
      
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error booking trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!destination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Destination not found.</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Trip to {destination.name}</h1>
          <p className="text-gray-600">Plan your visit to this amazing destination</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Enter your booking details below
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <Label htmlFor="checkIn">Check-in Date</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <div className="mb-2">
                  <Label htmlFor="checkOut">Check-out Date</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="visitors">Number of Visitors</Label>
              <Input
                type="number"
                id="visitors"
                min="1"
                value={visitors}
                onChange={e => setVisitors(parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="ticketType">Ticket Type</Label>
              <Select value={ticketType} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Google Pay">Google Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
          <div className="p-6 border-t">
            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Booking;
