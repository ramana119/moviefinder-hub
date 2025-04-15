
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { HotelType, Destination } from '../types';

interface HotelCardProps {
  hotel: HotelType;
  destination: Destination | null;
  isSelected?: boolean;
  onSelect?: (hotelId: string) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ 
  hotel, 
  destination, 
  isSelected = false, 
  onSelect 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(hotel.id);
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect ? handleClick : undefined}
    >
      <CardContent className="p-0">
        <div className="relative h-40">
          <img
            src={hotel.image || hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute bottom-2 left-2 text-white">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm">{hotel.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span>
              {hotel.location?.address || (destination ? `${destination.city}, ${destination.state}` : 'Unknown location')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">₹{hotel.pricePerPerson} per person</span>
            <Badge variant="outline">{hotel.type}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
