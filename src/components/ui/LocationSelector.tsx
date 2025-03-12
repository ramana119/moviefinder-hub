
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

// List of major Indian cities
const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Visakhapatnam", "Bhopal", "Patna",
  "Ludhiana", "Agra", "Nashik", "Vadodara", "Faridabad",
  "Madurai", "Coimbatore", "Varanasi", "Surat", "Kochi",
  "Vijayawada", "Thiruvananthapuram", "Indore", "Mysore", "Guwahati",
  "Tiruchirappalli", "Amritsar", "Mangalore", "Hubli", "Jammu",
  "Dehradun", "Chandigarh", "Pondicherry", "Ranchi", "Raipur"
];

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(indianCities);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCities(
        indianCities.filter(city => 
          city.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCities(indianCities);
    }
  }, [searchQuery]);

  const handleSelectCity = (city: string) => {
    onLocationChange(city);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-md bg-primary/10 text-primary hover:bg-primary/20">
          <MapPin className="h-4 w-4" />
          {selectedLocation || "Select Location"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-indigo-700">Select your city</DialogTitle>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for a city..."
            className="pl-10 border-indigo-200 focus:border-indigo-400"
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
                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800"
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
