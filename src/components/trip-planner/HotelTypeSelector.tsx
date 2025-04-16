
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Hotel } from 'lucide-react';
import { Destination } from '@/types';
import HotelCard from '../HotelCard';

interface HotelTypeSelectorProps {
  hotelType: 'budget' | 'standard' | 'luxury';
  handleSelectHotelType: (type: 'budget' | 'standard' | 'luxury') => void;
  travelStyle: 'base-hotel' | 'mobile';
  setTravelStyle: (style: 'base-hotel' | 'mobile') => void;
  selectedDestinations: string[];
  filteredHotels: any[];
  getDestinationById: (id: string) => Destination | undefined;
}

const HotelTypeSelector: React.FC<HotelTypeSelectorProps> = ({
  hotelType,
  handleSelectHotelType,
  travelStyle,
  setTravelStyle,
  selectedDestinations,
  filteredHotels,
  getDestinationById
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hotelType">Hotel Type</Label>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={hotelType === 'budget' ? 'default' : 'outline'}
            onClick={() => handleSelectHotelType('budget')}
            className="flex flex-col h-auto py-4"
          >
            <Hotel className="h-6 w-6 mb-2" />
            <span>Budget</span>
            <span className="text-xs mt-1">Economic</span>
          </Button>
          <Button
            variant={hotelType === 'standard' ? 'default' : 'outline'}
            onClick={() => handleSelectHotelType('standard')}
            className="flex flex-col h-auto py-4"
          >
            <Hotel className="h-6 w-6 mb-2" />
            <span>Standard</span>
            <span className="text-xs mt-1">Comfortable</span>
          </Button>
          <Button
            variant={hotelType === 'luxury' ? 'default' : 'outline'}
            onClick={() => handleSelectHotelType('luxury')}
            className="flex flex-col h-auto py-4"
          >
            <Hotel className="h-6 w-6 mb-2" />
            <span>Luxury</span>
            <span className="text-xs mt-1">Premium</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Travel Style</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={travelStyle === 'base-hotel' ? 'default' : 'outline'}
            onClick={() => setTravelStyle('base-hotel')}
            className="flex flex-col h-auto py-4"
          >
            <Hotel className="h-6 w-6 mb-2" />
            <span>Base Hotel</span>
            <span className="text-xs mt-1">Stay at one location</span>
          </Button>
          <Button
            variant={travelStyle === 'mobile' ? 'default' : 'outline'}
            onClick={() => setTravelStyle('mobile')}
            className="flex flex-col h-auto py-4"
          >
            <Hotel className="h-6 w-6 mb-2" />
            <span>Multi-Hotel</span>
            <span className="text-xs mt-1">Stay at multiple locations</span>
          </Button>
        </div>
      </div>

      {selectedDestinations.length > 0 && (
        <div className="space-y-2">
          <Label>Available Hotels</Label>
          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredHotels.slice(0, 4).map(hotel => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  destination={getDestinationById(hotel.destinationId)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hotels available for the selected destinations and type.
              Please select different destinations or hotel type.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelTypeSelector;
