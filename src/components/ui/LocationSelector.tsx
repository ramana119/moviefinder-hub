
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

// Sample cities data
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata"
];

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCities(
        cities.filter(city => 
          city.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities);
    }
  }, [searchQuery]);

  const handleSelectCity = (city: string) => {
    onLocationChange(city);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-md">
          <MapPin className="h-4 w-4" />
          {selectedLocation || "Select Location"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select your location</DialogTitle>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for a city..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
          {filteredCities.map((city) => (
            <motion.button
              key={city}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg text-left transition-colors ${
                city === selectedLocation
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleSelectCity(city)}
            >
              {city}
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
