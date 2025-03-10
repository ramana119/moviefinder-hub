
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Ticket, 
  ChevronRight,
  Eye,
  Star
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Mock bookings data - in a real app, this would come from an API
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

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  
  const upcomingBookings = mockBookings.filter(booking => booking.status === "upcoming");
  const pastBookings = mockBookings.filter(booking => booking.status === "completed");
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="upcoming" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="upcoming" className="flex gap-1 items-center">
            Upcoming
            {upcomingBookings.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
                {upcomingBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4 space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <motion.div
                key={booking.id}
                whileHover={{ y: -2 }}
                className="bg-muted/50 rounded-lg overflow-hidden border border-border"
              >
                <div className="flex items-start">
                  <div className="w-1/3 h-24">
                    <img 
                      src={booking.posterUrl} 
                      alt={booking.movieTitle} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold line-clamp-1">{booking.movieTitle}</h3>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] rounded">
                        Confirmed
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-1 text-xs mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <Ticket className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="line-clamp-1">{booking.seats.join(", ")}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs font-bold">₹{booking.totalAmount}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2"
                        asChild
                      >
                        <Link to={`/dashboard`}>
                          View
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                <Ticket className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium mb-1">No upcoming bookings</h3>
              <p className="text-xs text-muted-foreground mb-3">You don't have any upcoming movie tickets</p>
              <Button size="sm" asChild>
                <Link to="/">
                  Browse Movies
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4 space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <motion.div
                key={booking.id}
                whileHover={{ y: -2 }}
                className="bg-muted/50 rounded-lg overflow-hidden border border-border"
              >
                <div className="flex items-start">
                  <div className="w-1/3 h-24">
                    <img 
                      src={booking.posterUrl} 
                      alt={booking.movieTitle} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold line-clamp-1">{booking.movieTitle}</h3>
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-800 text-[10px] rounded">
                        Completed
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-1 text-xs mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <Ticket className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="line-clamp-1">{booking.seats.join(", ")}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs font-bold">₹{booking.totalAmount}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1">
                          <Star className="w-3 h-3" />
                          Rate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs px-2"
                          asChild
                        >
                          <Link to={`/dashboard`}>
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                <Ticket className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium mb-1">No past bookings</h3>
              <p className="text-xs text-muted-foreground mb-3">You haven't booked any tickets yet</p>
              <Button size="sm" asChild>
                <Link to="/">
                  Browse Movies
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingHistory;
