
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedMovie from "@/components/ui/FeaturedMovie";
import MovieCard from "@/components/ui/MovieCard";
import SearchFilter from "@/components/ui/SearchFilter";
import { movies } from "@/data/mockData";

const Index = () => {
  // Current date to determine which movies are now showing vs coming soon
  const currentDate = new Date();
  
  // Filter movies based on release date
  const nowShowingMoviesAll = movies.filter(movie => {
    const releaseDate = new Date(movie.releaseDate);
    // Movies released up to 2 months ago are considered "now showing"
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return releaseDate <= currentDate && releaseDate >= twoMonthsAgo;
  });
  
  const comingSoonMoviesAll = movies.filter(movie => {
    const releaseDate = new Date(movie.releaseDate);
    // Movies to be released in the future are "coming soon"
    return releaseDate > currentDate;
  });

  // For testing, if the arrays are empty, create temporary collections
  const tempNowShowing = nowShowingMoviesAll.length > 0 ? 
    nowShowingMoviesAll : 
    movies.filter((_, index) => index < 5);
    
  const tempComingSoon = comingSoonMoviesAll.length > 0 ? 
    comingSoonMoviesAll : 
    movies.filter((_, index) => index >= 5);

  // Make sure we have movies to display, fallback to all movies if filters return empty arrays
  const [featuredMovies, setFeaturedMovies] = useState(
    tempNowShowing.slice(0, 3)
  );
  
  const [nowShowingMovies, setNowShowingMovies] = useState(
    tempNowShowing
  );
  
  const [comingSoonMovies, setComingSoonMovies] = useState(
    tempComingSoon
  );
  
  const [displayedMovies, setDisplayedMovies] = useState(movies);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    genres: string[];
    languages: string[];
    formats: string[];
  }>({
    genres: [],
    languages: [],
    formats: [],
  });

  // Log for debugging
  useEffect(() => {
    console.log("All movies count:", movies.length);
    console.log("Now showing movies count:", nowShowingMoviesAll.length);
    console.log("Coming soon movies count:", comingSoonMoviesAll.length);
    console.log("Featured movies:", featuredMovies);
  }, []);

  // Simulating loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(query, activeFilters);
  };

  const handleFilter = (filters: {
    genres: string[];
    languages: string[];
    formats: string[];
  }) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchQuery, filters);
  };

  const applyFiltersAndSearch = (query: string, filters: typeof activeFilters) => {
    let filtered = [...movies];
    
    // Apply search query
    if (query.trim()) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.genres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre.some((g) => filters.genres.includes(g))
      );
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter((movie) =>
        filters.languages.includes(movie.language)
      );
    }

    if (filters.formats.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.format.some((f) => filters.formats.includes(f))
      );
    }

    setDisplayedMovies(filtered);
    
    // Update Now Showing and Coming Soon collections based on release date
    const currentDate = new Date();
    
    const nowShowing = filtered.filter(movie => {
      const releaseDate = new Date(movie.releaseDate);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      return releaseDate <= currentDate && releaseDate >= twoMonthsAgo;
    });
    
    const comingSoon = filtered.filter(movie => {
      const releaseDate = new Date(movie.releaseDate);
      return releaseDate > currentDate;
    });
    
    setNowShowingMovies(nowShowing.length > 0 ? nowShowing : tempNowShowing);
    setComingSoonMovies(comingSoon.length > 0 ? comingSoon : tempComingSoon);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="loader"></span>
      </div>
    );
  }

  // If we still don't have movies to display, show a message
  if (movies.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Movies Available</h2>
            <p className="text-muted-foreground">Please check back later for movie listings.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner with Featured Movies */}
        {featuredMovies.length > 0 ? (
          <FeaturedMovie movies={featuredMovies} />
        ) : (
          <div className="w-full h-[70vh] flex items-center justify-center bg-gray-900">
            <p className="text-primary text-xl">No featured movies available</p>
          </div>
        )}

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* Now Showing Movies */}
              <div>
                <motion.div
                  variants={childVariants}
                  className="flex justify-between items-center mb-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Now Showing
                  </h2>
                  <a
                    href="#"
                    className="text-primary font-medium hover:underline"
                  >
                    View All
                  </a>
                </motion.div>

                {nowShowingMovies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {nowShowingMovies.map((movie) => (
                      <motion.div key={movie.id} variants={childVariants}>
                        <MovieCard movie={movie} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No movies currently showing</p>
                )}
              </div>

              {/* Coming Soon Movies */}
              <div>
                <motion.div
                  variants={childVariants}
                  className="flex justify-between items-center mb-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Coming Soon
                  </h2>
                  <a
                    href="#"
                    className="text-primary font-medium hover:underline"
                  >
                    View All
                  </a>
                </motion.div>

                {comingSoonMovies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {comingSoonMovies.map((movie) => (
                      <motion.div key={movie.id} variants={childVariants}>
                        <MovieCard movie={movie} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming movies scheduled</p>
                )}
              </div>

              {/* Featured Movie Section */}
              <div>
                <motion.h2
                  variants={childVariants}
                  className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
                >
                  Featured Movies
                </motion.h2>

                {featuredMovies.length >= 2 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredMovies.slice(0, 2).map((movie) => (
                      <motion.div key={movie.id} variants={childVariants}>
                        <MovieCard movie={movie} featured />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No featured movies available</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
