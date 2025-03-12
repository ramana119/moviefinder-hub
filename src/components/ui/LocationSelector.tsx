
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Indian states and their major cities
const indianStates = {
  "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"]
};

// Flatten states and cities for search
const allCities = Object.values(indianStates).flat();

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(allCities);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "all") {
      if (searchQuery) {
        setFilteredCities(
          allCities.filter(city => 
            city.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredCities(allCities);
      }
    } else if (activeTab === "states" && selectedState) {
      const stateCities = indianStates[selectedState as keyof typeof indianStates] || [];
      if (searchQuery) {
        setFilteredCities(
          stateCities.filter(city => 
            city.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredCities(stateCities);
      }
    }
  }, [searchQuery, activeTab, selectedState]);

  const handleSelectCity = (city: string) => {
    onLocationChange(city);
    setIsOpen(false);
  };

  const handleSelectState = (state: string) => {
    setSelectedState(state);
    setActiveTab("states");
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
          <DialogTitle>Select your city</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="all">All Cities</TabsTrigger>
            <TabsTrigger value="states">By State</TabsTrigger>
          </TabsList>
          
          <div className="relative my-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for a city..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TabsContent value="all" className="mt-2">
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
          </TabsContent>
          
          <TabsContent value="states" className="mt-2">
            {!selectedState ? (
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {Object.keys(indianStates).map((state) => (
                  <motion.button
                    key={state}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-lg text-left transition-colors bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleSelectState(state)}
                  >
                    {state}
                  </motion.button>
                ))}
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedState(null)}
                  className="mb-3"
                >
                  Back to States
                </Button>
                <h3 className="text-lg font-medium mb-2">{selectedState}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[250px] overflow-y-auto">
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
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
