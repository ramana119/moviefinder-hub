
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Ticket, 
  Clock, 
  Calendar, 
  ChevronRight,
  Download,
  QrCode,
  Star,
  CircleUser
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

// Mock bookings data
const mockBookings = [
  {
    id: 1,
    movieTitle: "Inception",
    posterUrl: "https://source.unsplash.com/featured/500x800?movie",
    date: "2023-06-15",
    time: "18:30",
    theater: "PVR Cinemas, Inorbit Mall",
    seats: ["F12", "F13"],
    status: "upcoming",
    totalAmount: 560,
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=booking-1-code"
  },
  {
    id: 2,
    movieTitle: "The Dark Knight",
    posterUrl: "https://source.unsplash.com/featured/501x800?movie",
    date: "2023-06-01",
    time: "21:15",
    theater: "INOX, Phoenix Mall",
    seats: ["H5", "H6", "H7"],
    status: "completed",
    totalAmount: 840,
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=booking-2-code"
  },
  {
    id: 3,
    movieTitle: "Interstellar",
    posterUrl: "https://source.unsplash.com/featured/502x800?movie",
    date: "2023-05-22",
    time: "15:45",
    theater: "Cinepolis, Nexus Mall",
    seats: ["D8", "D9"],
    status: "completed",
    totalAmount: 560,
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=booking-3-code"
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  
  const upcomingBookings = mockBookings.filter(booking => booking.status === "upcoming");
  const pastBookings = mockBookings.filter(booking => booking.status === "completed");
  
  const handleViewTicket = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-gray-600">View and manage your movie tickets</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-sm">
              <CircleUser className="w-8 h-8 text-gray-400" />
              <div className="pr-2">
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@example.com</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bookings list */}
            <div className="lg:col-span-2">
              <Tabs 
                defaultValue="upcoming" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="upcoming" className="text-base">
                    Upcoming
                    {upcomingBookings.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                        {upcomingBookings.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-base">
                    Completed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map(booking => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-48 md:h-auto">
                            <img 
                              src={booking.posterUrl} 
                              alt={booking.movieTitle} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold mb-2">{booking.movieTitle}</h3>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                                Confirmed
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center col-span-2">
                                <Ticket className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{booking.seats.join(", ")}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-4">
                              {booking.theater}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="font-bold">₹{booking.totalAmount}</div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1"
                                onClick={() => handleViewTicket(booking)}
                              >
                                View Ticket
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Ticket className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                      <p className="text-gray-500 mb-4">You don't have any upcoming movie tickets.</p>
                      <Button asChild>
                        <Link to="/movies">
                          Browse Movies
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {pastBookings.length > 0 ? (
                    pastBookings.map(booking => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-48 md:h-auto">
                            <img 
                              src={booking.posterUrl} 
                              alt={booking.movieTitle} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold mb-2">{booking.movieTitle}</h3>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                                Completed
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center col-span-2">
                                <Ticket className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{booking.seats.join(", ")}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-4">
                              {booking.theater}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="font-bold">₹{booking.totalAmount}</div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="gap-1"
                                >
                                  <Star className="w-4 h-4" />
                                  Rate
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => handleViewTicket(booking)}
                                >
                                  View Ticket
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Ticket className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                      <p className="text-gray-500 mb-4">You haven't booked any tickets yet.</p>
                      <Button asChild>
                        <Link to="/movies">
                          Browse Movies
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Ticket preview */}
            <div>
              {selectedBooking ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6 sticky top-24"
                >
                  <h2 className="text-xl font-bold mb-4">Movie Ticket</h2>
                  
                  <div className="border-b pb-4 mb-4">
                    <div className="relative aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={selectedBooking.posterUrl} 
                        alt={selectedBooking.movieTitle} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <h3 className="text-white font-bold">{selectedBooking.movieTitle}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{selectedBooking.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">{selectedBooking.time}</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-gray-500">Theater</p>
                        <p className="font-medium">{selectedBooking.theater}</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-gray-500">Seats</p>
                        <p className="font-medium">{selectedBooking.seats.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-center text-sm text-gray-500 mb-4">Scan this QR code at the theater</p>
                    <div className="flex justify-center">
                      <div className="p-2 border rounded-lg">
                        <img 
                          src={selectedBooking.qrCode} 
                          alt="Ticket QR Code" 
                          className="w-40 h-40"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 flex flex-col gap-3">
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download Ticket
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <QrCode className="w-4 h-4" />
                      Save to Google Wallet
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Ticket className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No ticket selected</h3>
                  <p className="text-gray-500 mb-4">
                    Select a booking to view your ticket details here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
