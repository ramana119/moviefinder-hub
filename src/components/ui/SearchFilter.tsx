
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

interface FilterOptions {
  genres: string[];
  languages: string[];
  formats: string[];
}

const SearchFilter = ({ onSearch, onFilter }: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    languages: [],
    formats: [],
  });

  const genres = ["Action", "Adventure", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"];
  const languages = ["English", "Spanish", "French", "Hindi", "Korean"];
  const formats = ["2D", "3D", "IMAX", "4DX"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    setFilters((prev) => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return {
        ...prev,
        [category]: currentFilters
      };
    });
  };

  const applyFilters = () => {
    onFilter(filters);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      genres: [],
      languages: [],
      formats: [],
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4 mb-10">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for movies, theaters, etc."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {Object.values(filters).some(arr => arr.length > 0) && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {Object.values(filters).reduce((total, arr) => total + arr.length, 0)}
            </span>
          )}
        </Button>
        <Button type="submit">Search</Button>
      </form>

      {filtersOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 border-t pt-4"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-900">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 h-auto p-1"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleFilter("genres", genre)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.genres.includes(genre)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleFilter("languages", language)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.languages.includes(language)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Formats</h4>
              <div className="flex flex-wrap gap-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleFilter("formats", format)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.formats.includes(format)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setFiltersOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchFilter;
