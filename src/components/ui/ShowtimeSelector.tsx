
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

  const handleShowtimeClick = (e: React.MouseEvent, showtimeId: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      redirectToLogin();
    }
  };

  return (
    <div>
      {/* Format filter */}
      {formats.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {formats.map(format => (
            <button
              key={format}
              className={`px-3 py-1 text-xs rounded-full transition ${
                selectedFormat === format
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
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
              onClick={(e) => handleShowtimeClick(e, showtime.id)}
              className={`
                inline-block px-3 py-2 text-xs font-medium rounded border 
                hover:border-primary hover:text-primary transition-colors
                ${showtime.available !== false ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-400 cursor-not-allowed'}
              `}
            >
              {showtime.time}
            </Link>
          </motion.div>
        ))}
        
        {filteredShowtimes.length === 0 && (
          <p className="text-sm text-gray-500 py-2">No showtimes available for this selection.</p>
        )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
