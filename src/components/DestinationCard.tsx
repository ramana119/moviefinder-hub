
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { Destination, CrowdLevel } from '../types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useDestinations } from '../context/DestinationContext';

interface DestinationCardProps {
  destination: Destination;
}

// Function to get crowd level background class
const getCrowdLevelBgClass = (level: CrowdLevel) => {
  switch(level) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { getCurrentCrowdLevel, getBestTimeToVisit } = useDestinations();
  const crowdLevel = getCurrentCrowdLevel?.(destination.crowdData) || 'medium';
  const bestTimeToVisit = getBestTimeToVisit?.(destination.crowdData) || 'Any time';
  
  const crowdLevelText = {
    low: 'Low Crowd',
    medium: 'Moderate Crowd',
    high: 'High Crowd',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStartingPrice = () => {
    return `From ${formatPrice(destination.price || 0)}`;
  };

  return (
    <Link to={`/destinations/${destination.id}`} className="block hover:shadow-lg transition-shadow">
      <Card className="h-full border rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={destination.images?.[0] || destination.image || '/placeholder-image.jpg'}
            alt={destination.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <Badge 
            className={`absolute top-3 right-3 ${getCrowdLevelBgClass(crowdLevel)}`}
          >
            <Users className="w-3 h-3 mr-1" />
            {crowdLevelText[crowdLevel]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg leading-tight">{destination.name}</h3>
            <div className="flex items-center shrink-0">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm">{destination.rating || 4.5}</span>
            </div>
          </div>
          
          <div className="flex items-center mt-1 text-muted-foreground text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{destination.city || 'Unknown'}, {destination.state || 'Location'}</span>
          </div>
          
          <p className="mt-2 text-sm line-clamp-2 text-muted-foreground">
            {destination.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Best time</p>
              <p className="font-medium text-sm">{bestTimeToVisit}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="font-semibold text-primary">
                {getStartingPrice()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DestinationCard;
