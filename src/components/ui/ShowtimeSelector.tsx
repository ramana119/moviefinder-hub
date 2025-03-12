
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Showtime } from "@/data/mockData";
import { Badge } from "./badge";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  movieId: string;
  date: string;
}

const ShowtimeSelector = ({ showtimes, movieId, date }: ShowtimeSelectorProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const { isAuthenticated, redirectToLogin } = useUser();
  
  const formats = Array.from(new Set(showtimes.map(s => s.format)));
  
  const filteredShowtimes = selectedFormat 
    ? showtimes.filter(s => s.format === selectedFormat)
    : showtimes;

  const handleShowtimeClick = (e: React.MouseEvent, showtimeId: string, available: boolean) => {
    if (!available) {
      e.preventDefault();
      return;
    }
    
    if (!isAuthenticated) {
      e.preventDefault();
      redirectToLogin();
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
      {/* Format filter */}
      {formats.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {formats.map(format => (
            <button
              key={format}
              className={`px-3 py-1 text-xs rounded-full transition ${
                selectedFormat === format
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-200"
              }`}
              onClick={() => setSelectedFormat(format === selectedFormat ? null : format)}
            >
              {format}
            </button>
          ))}
        </div>
      )}
      
      {/* Showtime grid */}
      <div className="flex flex-wrap gap-2">
        {filteredShowtimes.map((showtime) => (
          <motion.div
            key={showtime.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/booking/${movieId}/${showtime.id}?date=${date}`}
              onClick={(e) => handleShowtimeClick(e, showtime.id, showtime.available)}
              className={`
                inline-block px-4 py-2 text-xs font-medium rounded border 
                hover:border-indigo-500 transition-colors
                ${showtime.available 
                  ? 'bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}
              `}
            >
              {showtime.time}
            </Link>
          </motion.div>
        ))}
        
        {filteredShowtimes.length === 0 && (
          <p className="text-sm text-indigo-500 py-2">No showtimes available for this selection.</p>
        )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
