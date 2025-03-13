
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Calendar, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/data/mockData";

interface FeaturedMovieProps {
  movies: Movie[];
}

const FeaturedMovie = ({ movies }: FeaturedMovieProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = movies[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!currentMovie) {
    return (
      <div className="relative w-full h-[70vh] bg-gray-900 flex items-center justify-center">
        <p className="text-primary text-xl">Loading featured movies...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image with simplified overlay */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentMovie.backdropUrl})`,
                backgroundPosition: "center 25%",
              }}
            ></div>
          </div>

          <div className="relative z-30 container mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-3xl mt-20">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs sm:text-sm px-3 py-1.5 bg-primary/80 text-primary-foreground font-medium rounded-full">
                  Now Showing
                </span>
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{currentMovie.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{currentMovie.duration}</span>
                </div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
              >
                {currentMovie.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                {currentMovie.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="text-xs sm:text-sm px-3 py-1 bg-white/20 text-white rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center gap-2 mb-6"
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">
                  {currentMovie.rating.toFixed(1)}/10
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white/90 text-sm sm:text-base mb-8 max-w-xl line-clamp-3"
              >
                {currentMovie.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="font-medium rounded-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link to={`/movie/${currentMovie.id}`}>
                    Book Tickets
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-medium text-white border-white hover:text-white hover:bg-white/20 rounded-full"
                  asChild
                >
                  <a
                    href={currentMovie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Trailer
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Simplified indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/50"
            }`}
            aria-label={`View slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedMovie;
