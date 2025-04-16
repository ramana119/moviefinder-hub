
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hotel, Star, MapPin } from 'lucide-react';
import { HotelType } from '../types/hotel';
import { Destination } from '../types/destination';
import { formatPrice } from '../utils/helpers';

interface HotelCardProps {
  hotel: HotelType;
  destination?: Destination | null;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
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
      className={`overflow-hidden transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
    >
      <div className="relative h-40">
        <img
          src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
          }}
        />
        <Badge 
          className="absolute top-2 right-2 capitalize" 
          variant={hotel.type === "luxury" ? "default" : hotel.type === "standard" ? "outline" : "secondary"}
        >
          {hotel.type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{hotel.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>
                {destination?.name || 
                 (hotel.location?.address ? hotel.location.address.split(',')[0] : 'Location unavailable')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatPrice(hotel.pricePerPerson)}</p>
            <p className="text-xs text-muted-foreground">per person/night</p>
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < hotel.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs ml-1 text-muted-foreground">({hotel.rating}/5)</span>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {hotel.amenities?.slice(0, 3).map((amenity, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities && hotel.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
