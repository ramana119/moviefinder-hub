
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Star, 
  PlayCircle, 
  HeartIcon, 
  Share2, 
  Calendar as CalendarIcon,
  ChevronRight,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { movies, theaters, showtimes } from "@/data/mockData";
import ShowtimeSelector from "@/components/ui/ShowtimeSelector";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState(movies[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [availableTheaters, setAvailableTheaters] = useState(theaters);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Find the movie by ID
    const foundMovie = movies.find((m) => m.id === Number(id));
    
    if (foundMovie) {
      setMovie(foundMovie);
      // Filter theaters by city (would be done via API in a real app)
      setAvailableTheaters(theaters.slice(0, 5));
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Movie Backdrop */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.backdropUrl})`,
              backgroundPosition: "center 20%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20"></div>
          
          <div className="container mx-auto px-4 sm:px-6 h-full relative z-30">
            <div className="flex flex-col md:flex-row items-end h-full pb-16">
              {/* Movie Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl mr-8 mb-8 flex-shrink-0"
              >
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Movie Info */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex flex-wrap gap-3 mb-3">
                    {movie.format.map((format, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-md"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {movie.title}
                  </h1>
                  
                  <div className="flex items-center text-white/90 gap-4 mb-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-medium">{movie.rating.toFixed(1)}/10</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{movie.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{movie.releaseDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre.map((genre, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm bg-white/10 text-white rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      className="gap-2"
                      onClick={() => document.getElementById('book-tickets')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Book Tickets
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2 text-white border-white hover:bg-white/20 hover:text-white"
                      asChild
                    >
                      <a 
                        href={movie.trailerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Watch Trailer
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Movie Content */}
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Movie Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {movie.description}
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-500">Genre</h3>
                        <p>{movie.genre.join(', ')}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Release Date</h3>
                        <p>{movie.releaseDate}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Director</h3>
                        <p>Sample Director</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Language</h3>
                        <p>{movie.language}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
                          J
                        </div>
                        <div>
                          <h3 className="font-medium">John Doe</h3>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        This movie was fantastic! Great character development and an engaging plot from start to finish.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
                          S
                        </div>
                        <div>
                          <h3 className="font-medium">Sarah Smith</h3>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        One of the best movies I've seen this year. The visuals were stunning and the story kept me hooked.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cast">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((actor) => (
                      <div key={actor} className="text-center">
                        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/150?img=${actor + 10}`} 
                            alt="Actor" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium">Actor Name {actor}</h3>
                        <p className="text-sm text-gray-500">Character {actor}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column: Book Tickets */}
            <div id="book-tickets">
              <div className="bg-gray-50 p-6 rounded-xl sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Book Tickets</h2>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" /> 
                    Select Date
                  </h3>
                  <div className="flex overflow-x-auto pb-2 gap-2">
                    {getDates().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        className={`flex-shrink-0 px-3 py-2 rounded-lg flex flex-col items-center min-w-[80px] transition-colors ${
                          selectedDate.toDateString() === date.toDateString()
                            ? "bg-primary text-white"
                            : "bg-white border hover:border-primary"
                        }`}
                      >
                        <span className="text-xs font-medium">
                          {format(date, "EEE")}
                        </span>
                        <span className="text-lg font-bold">
                          {format(date, "d")}
                        </span>
                        <span className="text-xs">
                          {format(date, "MMM")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Theater Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> 
                    Select Theater
                  </h3>
                  <div className="space-y-4">
                    {availableTheaters.map((theater) => (
                      <div 
                        key={theater.id}
                        className="bg-white p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <h4 className="font-medium">{theater.name}</h4>
                        <p className="text-xs text-gray-500 mb-3">{theater.location}</p>
                        
                        <ShowtimeSelector 
                          showtimes={showtimes.filter(s => s.theaterId === theater.id)} 
                          movieId={movie.id}
                          date={format(selectedDate, "yyyy-MM-dd")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
