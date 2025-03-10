
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Star } from "lucide-react";
import { Movie } from "@/data/mockData";

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

const MovieCard = ({ movie, featured = false }: MovieCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <Link to={`/movie/${movie.id}`} className="block relative">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white">
              <p className="font-medium leading-tight mb-1">{movie.title}</p>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3" />
                <span>{movie.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/movie/${movie.id}`} className="block">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{movie.releaseDate}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
            >
              {genre}
            </span>
          ))}
          {movie.genre.length > 2 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              +{movie.genre.length - 2}
            </span>
          )}
        </div>

        {featured && (
          <div className="mt-3">
            <p className="text-gray-600 text-sm line-clamp-2">{movie.description}</p>
            <div className="mt-4">
              <Link
                to={`/movie/${movie.id}`}
                className="inline-flex items-center text-primary font-medium text-sm hover:underline"
              >
                Book tickets
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;
