
import React from 'react';
import Layout from '../components/Layout';
import { 
  Users, Clock, Search, MapPin, CheckCircle, 
  BarChart3, Calendar, Compass, Award, Globe, ShieldCheck,
  Building, Phone, Mail, MapPin as LocationPin, Facebook, Instagram, Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Zenway Travels Story</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Creating peaceful travel experiences by helping you discover and enjoy destinations without the crowds
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,202.7C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-2">Our Journey</Badge>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Zenway Travels, we believe that the best travel experiences happen when you can fully immerse yourself in a destination without the distraction and stress of large crowds. 
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to help travelers find peaceful moments in popular places by providing real-time crowd data and intelligent recommendations.
              </p>
              <p className="text-lg text-gray-600">
                Founded in 2022 by a group of travel enthusiasts and data scientists, Zenway Travels has quickly grown to become India's leading platform for mindful tourism.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Team meeting" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-2">Our Process</Badge>
            <h2 className="text-3xl font-bold mb-4">How Our Platform Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A seamless journey from discovery to experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Discover</h3>
                <p className="text-gray-600">
                  Browse our curated collection of destinations across India with detailed information and crowd predictions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Analyze</h3>
                <p className="text-gray-600">
                  Check real-time crowd levels and predictions to find the perfect time for your visit.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Book</h3>
                <p className="text-gray-600">
                  Secure your tickets, accommodations, and transportation for your preferred low-crowd time slot.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">4. Enjoy</h3>
                <p className="text-gray-600">
                  Experience the destination without the crowds, making the most of your travel time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Crowd Prediction Technology */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-2">Our Technology</Badge>
              <h2 className="text-3xl font-bold mb-6">Our Crowd Prediction Technology</h2>
              <p className="text-lg text-gray-600 mb-6">
                Zenway Travels uses advanced algorithms to analyze visitor patterns and predict crowd levels throughout the day. Our technology helps you make informed decisions about when to visit popular destinations.
              </p>
              
              <ul className="space-y-4">
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Historical visitation data analysis</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Real-time crowd monitoring</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>AI-powered prediction models</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Weather and seasonal trend integration</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6">How We Calculate Crowd Levels</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Data Collection</h4>
                    <p className="text-sm text-gray-600">
                      We gather information from multiple sources including historical visitation data, ticket sales, and local reports.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Time Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Our algorithms identify patterns based on time of day, day of week, and seasonal variations.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location-Specific Factors</h4>
                    <p className="text-sm text-gray-600">
                      Each destination has unique crowd patterns influenced by local events, holidays, and accessibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-2">Our Principles</Badge>
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Excellence in Service</h3>
                <p className="text-gray-600">
                  We strive to provide exceptional experiences and exceed customer expectations at every touchpoint.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Sustainable Tourism</h3>
                <p className="text-gray-600">
                  We promote responsible travel practices that protect destinations and support local communities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Trust & Transparency</h3>
                <p className="text-gray-600">
                  We're committed to honest communication and building trust with our customers and partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-2">Our People</Badge>
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experts behind Zenway Travels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Anjali Mehta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Anjali Mehta</h3>
              <p className="text-primary mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                Former tourism executive with a passion for creating meaningful travel experiences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Vikram Singh" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Vikram Singh</h3>
              <p className="text-primary mb-2">CTO</p>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                Data scientist and engineer who built our crowd prediction algorithm.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Priya Kapoor" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Priya Kapoor</h3>
              <p className="text-primary mb-2">Head of Operations</p>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                Hospitality industry veteran ensuring smooth customer experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-2">Get in Touch</Badge>
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help with your travel planning needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Building className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Main Office</h3>
                <p className="text-gray-600">
                  One Horizon Center<br />
                  Golf Course Road, Sector 43<br />
                  Gurgaon, Haryana 122002
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Phone className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600">
                  Customer Support: +91 1800-200-3000<br />
                  Business Inquiries: +91 124-456-7890<br />
                  Working Hours: 9AM - 7PM IST
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600">
                  Support: help@zenwaytravels.com<br />
                  Partnerships: partners@zenwaytravels.com<br />
                  Careers: jobs@zenwaytravels.com
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Crowd-Free Travel?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join thousands of travelers who are discovering the joy of visiting amazing places without the crowds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors"
              asChild
              size="lg"
            >
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button 
              variant="outline"
              className="border border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium transition-colors"
              asChild
              size="lg"
            >
              <Link to="/destinations">View Destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
