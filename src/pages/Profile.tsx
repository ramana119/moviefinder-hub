
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, CreditCard, Edit, Map, MapPin, Star, User, UserCheck, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '../utils/helpers';
import { ScrollArea } from '@/components/ui/scroll-area';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthenticated, isLoading, logout, cancelPremium, withdrawPremium } = useAuth();
  const { getBookingsByUserId } = useBookings();
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPremiumCancelConfirm, setShowPremiumCancelConfirm] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (currentUser) {
      const bookings = getBookingsByUserId(currentUser.id);
      setUserBookings(bookings);
    }
  }, [currentUser, getBookingsByUserId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancelPremium = async () => {
    try {
      await cancelPremium();
      setShowPremiumCancelConfirm(false);
      toast({
        title: 'Premium Cancelled',
        description: 'Your premium subscription has been cancelled successfully.',
      });
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'There was an error cancelling your premium subscription.',
        variant: 'destructive',
      });
    }
  };

  const handleWithdrawPremium = async () => {
    try {
      await withdrawPremium();
      setShowPremiumCancelConfirm(false);
      toast({
        title: 'Premium Withdrawn',
        description: 'Your premium benefits have been withdrawn immediately.',
      });
    } catch (error) {
      toast({
        title: 'Withdrawal Failed',
        description: 'There was an error withdrawing your premium subscription.',
        variant: 'destructive',
      });
    }
  };

  const calculateRefundPercent = () => {
    if (!currentUser?.premiumPurchaseDate) return 0;
    
    const purchaseDate = new Date(currentUser.premiumPurchaseDate);
    const now = new Date();
    const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSincePurchase <= 7) return 90;
    if (daysSincePurchase <= 14) return 50;
    if (daysSincePurchase <= 30) return 25;
    return 0;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>Please log in to view your profile</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg" alt={currentUser.name || currentUser.email} />
                    <AvatarFallback className="text-xl">
                      {getInitials(currentUser.name || currentUser.email)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {currentUser.name || currentUser.email}
                  </h2>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  
                  {currentUser.isPremium && (
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">Premium Member</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-1 mt-4">
                  <Button 
                    variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Bookings
                  </Button>
                  {currentUser.isPremium && (
                    <Button 
                      variant={activeTab === 'premium' ? 'default' : 'ghost'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('premium')}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Premium Status
                    </Button>
                  )}
                  <Separator className="my-2" />
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Manage your personal information</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p>{currentUser.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Profile Status</h3>
                      <div className="flex items-center mt-1">
                        {currentUser.profileComplete ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Membership</h3>
                      <div className="flex items-center mt-1">
                        {currentUser.isPremium ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center">
                            Standard
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {currentUser.profileData && (
                      <>
                        {currentUser.profileData.address && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                            <p>{currentUser.profileData.address}</p>
                          </div>
                        )}
                        
                        {currentUser.profileData.phone && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                            <p>{currentUser.profileData.phone}</p>
                          </div>
                        )}
                        
                        {currentUser.profileData.dob && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                            <p>{formatDate(currentUser.profileData.dob)}</p>
                          </div>
                        )}
                        
                        {currentUser.profileData.preferredDestinations && currentUser.profileData.preferredDestinations.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Preferred Destinations</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {currentUser.profileData.preferredDestinations.map((dest, i) => (
                                <Badge key={i} variant="secondary" className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {dest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {currentUser.profileData.travelFrequency && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Travel Frequency</h3>
                            <p>{currentUser.profileData.travelFrequency}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
                {!currentUser.profileComplete && (
                  <CardFooter>
                    <Button onClick={() => navigate('/profile/complete')}>
                      Complete Your Profile
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
            
            {activeTab === 'bookings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>View and manage your bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {userBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">You don't have any bookings yet.</p>
                      <Button className="mt-4" onClick={() => navigate('/destinations')}>
                        Explore Destinations
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {userBookings.map((booking) => (
                          <Card key={booking.id} className="overflow-hidden">
                            <div className="p-4 flex justify-between items-center border-b">
                              <div>
                                <h3 className="font-medium">{booking.destinationName || 'Destination'}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(booking.startDate || booking.checkIn)}
                                </p>
                              </div>
                              <Badge variant={booking.status === 'confirmed' ? 'outline' : 'destructive'}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Confirmed'}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {booking.timeSlot ? booking.timeSlot : (booking.endDate ? `${formatDate(booking.endDate)}` : '')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {booking.visitors || booking.numberOfTravelers} {(booking.visitors || booking.numberOfTravelers) === 1 ? 'visitor' : 'visitors'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Total: ₹{(booking.totalAmount || booking.totalPrice || 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/bookings/${booking.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'premium' && currentUser.isPremium && (
              <Card>
                <CardHeader>
                  <CardTitle>Premium Membership</CardTitle>
                  <CardDescription>Manage your premium subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <h3 className="font-medium text-amber-800">Premium Status: Active</h3>
                    </div>
                    <p className="text-sm text-amber-700">
                      You're enjoying all the benefits of CrowdLess Premium.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Membership Details</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-sm text-muted-foreground">Start Date:</span>
                        <span className="text-sm">{formatDate(currentUser.premiumPurchaseDate)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Premium Benefits</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Advanced crowd predictions with hourly breakdown
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Exclusive premium destinations
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Priority booking slots
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Premium travel itineraries with insider tips
                      </li>
                    </ul>
                  </div>
                  
                  {!showPremiumCancelConfirm ? (
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => setShowPremiumCancelConfirm(true)}
                    >
                      Cancel Premium Membership
                    </Button>
                  ) : (
                    <div className="space-y-3 border border-red-200 rounded-lg p-4 bg-red-50">
                      <h3 className="font-medium text-red-800">Confirm Cancellation</h3>
                      <p className="text-sm text-red-700">
                        You will still have access to premium features until the end of your current billing period.
                        {calculateRefundPercent() > 0 && ` You are eligible for a ${calculateRefundPercent()}% refund.`}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleCancelPremium}
                        >
                          Confirm Cancel
                        </Button>
                        {calculateRefundPercent() > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200" 
                            onClick={handleWithdrawPremium}
                          >
                            Withdraw Now + {calculateRefundPercent()}% Refund
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowPremiumCancelConfirm(false)}
                        >
                          Keep Premium
                        </Button>
                      </div>
                    </div>
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

export default Profile;
