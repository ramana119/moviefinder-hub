
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="bg-[#121212] text-white min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/booking/:movieId/:showtimeId" element={<SeatSelection />} />
            <Route path="/checkout/:movieId/:showtimeId" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
