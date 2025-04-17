
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/utils/helpers';
import { Loader2, CreditCard, DollarSign, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Get booking details from location state or fetch from API
  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    } else {
      // Mock booking details if none provided
      setBookingDetails({
        id: 'BOOKING' + Math.floor(Math.random() * 10000),
        totalAmount: 12500,
        currency: 'INR',
        description: 'Trip booking',
        itemCount: 1,
        tax: 1000,
        discount: 500,
        subtotal: 12000,
        destinations: ['Taj Mahal, Agra'],
        dates: {
          checkIn: new Date().toISOString(),
          checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        travelers: 2
      });
    }
  }, [location.state]);

  const formatCardNumber = (value: string) => {
    const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = val.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue.substring(0, 19)); // limit to 16 digits + 3 spaces
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvv)) {
      toast({
        title: "Error",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === 'upi' && !upiId) {
      toast({
        title: "Error",
        description: "Please enter a valid UPI ID",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    }, 3000);
  };

  if (!bookingDetails) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>
          
          {paymentComplete ? (
            <Card className="w-full border-green-200 bg-green-50">
              <CardContent className="pt-6 px-6 pb-8 flex flex-col items-center text-center">
                <div className="mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                <p className="text-green-700 mb-6">Your booking has been confirmed and is now being processed.</p>
                <p className="text-sm text-green-600 mb-2">Booking Reference: {bookingDetails.id}</p>
                <p className="text-sm text-green-600 mb-6">A confirmation email has been sent to your registered email address.</p>
                <Button className="mt-4" onClick={() => navigate('/bookings')}>
                  View My Bookings
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                      <TabsList className="grid grid-cols-2 mb-6">
                        <TabsTrigger value="card" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" /> Credit/Debit Card
                        </TabsTrigger>
                        <TabsTrigger value="upi" className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" /> UPI Payment
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card">
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="cardName">Cardholder Name</Label>
                              <Input 
                                id="cardName" 
                                placeholder="John Smith" 
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <div className="relative">
                                <Input 
                                  id="cardNumber" 
                                  placeholder="1234 5678 9012 3456"
                                  value={cardNumber}
                                  onChange={handleCardNumberChange}
                                  maxLength={19}
                                  required
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5" />
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input 
                                  id="expiryDate" 
                                  placeholder="MM/YY"
                                  value={expiryDate}
                                  onChange={handleExpiryDateChange}
                                  maxLength={5}
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input 
                                  id="cvv" 
                                  placeholder="123"
                                  value={cvv}
                                  onChange={handleCvvChange}
                                  maxLength={3}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center p-3 border border-green-200 rounded-md bg-green-50">
                              <Lock className="h-5 w-5 text-green-600 mr-2" />
                              <p className="text-sm text-green-800">Your payment information is secure and encrypted</p>
                            </div>
                          </div>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="upi">
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="upiId">UPI ID</Label>
                              <Input 
                                id="upiId" 
                                placeholder="yourname@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                required
                              />
                              <p className="text-sm text-gray-500">Enter your UPI ID (e.g., username@bankname)</p>
                            </div>
                            
                            <div className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50 mt-4">
                              <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                              <p className="text-sm text-gray-700">
                                You will receive a payment request on your UPI app after clicking Pay Now.
                              </p>
                            </div>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Booking Details</h3>
                      <p className="text-sm text-gray-500">Booking ID: {bookingDetails.id}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Destination</span>
                          <span className="font-medium">{bookingDetails.destinations.join(', ')}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Check-in</span>
                          <span className="font-medium">{new Date(bookingDetails.dates.checkIn).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Check-out</span>
                          <span className="font-medium">{new Date(bookingDetails.dates.checkOut).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Travelers</span>
                          <span className="font-medium">{bookingDetails.travelers}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Price Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Subtotal</span>
                          <span>{formatPrice(bookingDetails.subtotal)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Taxes & Fees</span>
                          <span>{formatPrice(bookingDetails.tax)}</span>
                        </div>
                        
                        {bookingDetails.discount > 0 && (
                          <div className="flex justify-between items-center text-sm text-green-600">
                            <span>Discount</span>
                            <span>-{formatPrice(bookingDetails.discount)}</span>
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center font-bold">
                          <span>Total</span>
                          <span>{formatPrice(bookingDetails.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Pay Now {formatPrice(bookingDetails.totalAmount)}</>
                        )}
                      </Button>
                      
                      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Secure payment processed by Zenway Secure Gateway</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
