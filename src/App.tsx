
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import About from './pages/About';
import Booking from './pages/Booking';
import BookingDetails from './pages/BookingDetails';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProfileCompletion from './pages/ProfileCompletion';
import NotFound from './pages/NotFound';
import PremiumFeatures from './pages/PremiumFeatures';
import PremiumSuccess from './pages/PremiumSuccess';
import TripPlanner from './pages/TripPlanner';
import Support from './pages/Support';
import Payment from './pages/Payment';
import { AuthProvider } from './context/AuthContext';
import { DestinationProvider } from './context/DestinationContext';
import { TripPlanningProvider } from './context/TripPlanningContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';
import RouteGuard from './components/RouteGuard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <DestinationProvider>
          <TripPlanningProvider>
            <BookingProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/destinations/:id" element={<DestinationDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/premium-features" element={<PremiumFeatures />} />
                  
                  {/* Protected Routes */}
                  <Route element={<RouteGuard>{/* This adds the children prop */}</RouteGuard>}>
                    <Route path="/bookings" element={<MyBookings />} />
                    <Route path="/bookings/:id" element={<BookingDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/complete-profile" element={<ProfileCompletion />} />
                    <Route path="/premium-success" element={<PremiumSuccess />} />
                    <Route path="/trip-planner" element={<TripPlanner />} />
                    <Route path="/booking/:destinationId" element={<Booking />} />
                    <Route path="/payment" element={<Payment />} />
                  </Route>
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </Router>
            </BookingProvider>
          </TripPlanningProvider>
        </DestinationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
