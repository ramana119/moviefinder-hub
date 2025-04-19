
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
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
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <DestinationProvider>
          <BookingProvider>
            <TripPlanningProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/destinations/:id" element={<DestinationDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/premium-features" element={<PremiumFeatures />} />
                  </Route>
                  
                  {/* Auth required but no profile completion required */}
                  <Route element={
                    <RouteGuard requireAuth={true}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </RouteGuard>
                  }>
                    <Route path="/complete-profile" element={<ProfileCompletion />} />
                  </Route>
                  
                  {/* Protected Routes requiring both auth and profile completion */}
                  <Route element={
                    <RouteGuard requireAuth={true} requireProfileComplete={true}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </RouteGuard>
                  }>
                    <Route path="/bookings" element={<MyBookings />} />
                    <Route path="/bookings/:id" element={<BookingDetails />} />
                    <Route path="/profile" element={<Profile />} />
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
            </TripPlanningProvider>
          </BookingProvider>
        </DestinationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
