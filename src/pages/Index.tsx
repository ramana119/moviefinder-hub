
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

  const [featuredMovies, setFeaturedMovies] = useState(nowShowingMoviesAll.slice(0, 3));
  const [nowShowingMovies, setNowShowingMovies] = useState(nowShowingMoviesAll.slice(0, 5));
  const [comingSoonMovies, setComingSoonMovies] = useState(comingSoonMoviesAll.slice(0, 5));
  const [displayedMovies, setDisplayedMovies] = useState(movies);
  const [isLoading, setIsLoading] = useState(true);

  // Simulating loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setDisplayedMovies(movies);
      return;
    }

    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setDisplayedMovies(filtered);
  };

  const handleFilter = (filters: {
    genres: string[];
    languages: string[];
    formats: string[];
  }) => {
    let filtered = [...movies];

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner with Featured Movies */}
        <FeaturedMovie movies={featuredMovies} />

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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {nowShowingMovies.map((movie) => (
                    <motion.div key={movie.id} variants={childVariants}>
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {comingSoonMovies.map((movie) => (
                    <motion.div key={movie.id} variants={childVariants}>
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Featured Movie Section */}
              <div>
                <motion.h2
                  variants={childVariants}
                  className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
                >
                  Featured Movies
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredMovies.slice(0, 2).map((movie) => (
                    <motion.div key={movie.id} variants={childVariants}>
                      <MovieCard movie={movie} featured />
                    </motion.div>
                  ))}
                </div>
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
