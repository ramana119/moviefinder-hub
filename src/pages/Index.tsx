import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Filter, Users, Clock, Calendar, Car, ArrowRight, Star, TrendingDown, CheckCircle, MessageCircle } from 'lucide-react';
import { useDestinations } from '../context/DestinationContext';
import DestinationCard from '../components/DestinationCard';

const Index: React.FC = () => {
  const { filteredDestinations, loading } = useDestinations();
  
  const featuredDestinations = React.useMemo(() => {
    if (!filteredDestinations.length) return [];
    
    return [...filteredDestinations]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [filteredDestinations]);

  return (
    <Layout>
      <section 
        className="relative py-20 sm:py-32 overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
          height: '600px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm mb-4">
              Experience India Differently
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover 
              <span className="text-primary"> Crowd-Free </span> 
              Travel Destinations
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-xl">
              Find and book less crowded destinations with real-time crowd prediction for a peaceful travel experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg"
                className="px-8 bg-primary hover:bg-primary/90"
              >
                <Link to="/destinations">Explore Destinations</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="px-8 text-white border-white hover:bg-white/20 bg-black/30"
              >
                <Link to="/trip-planner">Plan Your Trip</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-2">Popular Choices</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover these amazing places with real-time crowd information
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading destinations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/destinations">
                View All Destinations <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-2">Our Promise</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Zenway Travels Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your ultimate tool for avoiding crowds during your travels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm transition-transform hover:scale-105 hover:shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Real-time Crowd Data</h3>
              <p className="text-gray-600 text-center">
                Our platform provides up-to-date information on crowd levels at popular destinations, allowing you to visit at the perfect time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm transition-transform hover:scale-105 hover:shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Best Time Suggestions</h3>
              <p className="text-gray-600 text-center">
                We recommend the ideal times to visit each location to avoid the busiest periods, ensuring a more enjoyable experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm transition-transform hover:scale-105 hover:shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Complete Trip Planning</h3>
              <p className="text-gray-600 text-center">
                Plan your entire journey with our comprehensive tools for accommodations, transportation, and professional guides.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/about">
                Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-2">Happy Travelers</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from travelers who experienced peaceful journeys with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "I was amazed at how accurate the crowd predictions were. Visited the Taj Mahal at the suggested time and enjoyed a peaceful experience despite it being peak season."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Customer" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-medium">Priya Sharma</h4>
                    <p className="text-sm text-gray-500">Delhi, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The trip planning tool made our multi-destination vacation so simple. The suggested guides were knowledgeable and helped us discover hidden gems in Rajasthan."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Customer" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-medium">Rahul Mehta</h4>
                    <p className="text-sm text-gray-500">Mumbai, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "As someone who hates crowds, this service was exactly what I needed. Their premium features are worth every penny for the extra peace of mind and exclusive access."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Customer" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-medium">Neha Kapoor</h4>
                    <p className="text-sm text-gray-500">Bangalore, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-white mb-2">Need Help Planning Your Trip?</h3>
              <p className="text-white/80">
                Our AI assistant and customer support are available 24/7 to answer your questions
              </p>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="secondary">
                <Link to="/support">
                  <MessageCircle className="mr-2 h-5 w-5" /> Chat With Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for a Crowd-Free Experience?</h2>
            <p className="text-xl opacity-90 mb-8">
              Sign up today and start planning your peaceful getaway
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              asChild
              className="px-8"
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
