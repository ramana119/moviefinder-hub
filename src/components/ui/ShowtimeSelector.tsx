
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Showtime } from "@/data/mockData";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  movieId: string;
  date: string;
}

const ShowtimeSelector = ({ showtimes, movieId, date }: ShowtimeSelectorProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  
  const formats = Array.from(new Set(showtimes.map(s => s.format)));
  
  const filteredShowtimes = selectedFormat 
    ? showtimes.filter(s => s.format === selectedFormat)
    : showtimes;

  return (
    <div>
      {/* Format filter */}
      {formats.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {formats.map(format => (
            <button
              key={format}
              className={`px-2 py-1 text-xs rounded-full transition ${
                selectedFormat === format
                  ? "bg-primary text-white"
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
              className={`
                inline-block px-3 py-2 text-xs font-medium rounded border 
                hover:border-primary hover:text-primary transition-colors
                border-green-500 text-green-700
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
