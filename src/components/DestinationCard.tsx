
import React from 'react';
import { Link } from 'react-router-dom';
import { Destination } from '../types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice, getBasePrice, getCrowdLevelBgClass } from '../utils/helpers';
import { useDestinations } from '../context/DestinationContext';
import { MapPin, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { getCurrentCrowdLevel, getBestTimeToVisit } = useDestinations();
  const currentCrowdLevel = getCurrentCrowdLevel && destination.crowdData ? getCurrentCrowdLevel(destination.crowdData) : 'medium';
  const bestTimeToVisit = getBestTimeToVisit && destination.crowdData ? getBestTimeToVisit(destination.crowdData) : 'Any time';
  
  const crowdLevelClass = getCrowdLevelBgClass(currentCrowdLevel);
  
  const cardStyles = {
    transform: 'translateY(0px)',
    transition: 'transform 0.3s ease-in-out',
  };
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px)';
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0px)';
  };

  return (
    <Link to={`/destinations/${destination.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <img
              src={destination.images[0] || ''}
              alt={destination.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h3 className="text-xl font-semibold truncate">{destination.name}</h3>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{destination.city}, {destination.state}</span>
                </div>
                
                {destination.rating && (
                  <div className="flex items-center bg-yellow-400/90 text-gray-900 px-1.5 py-0.5 rounded text-xs font-medium">
                    <Star className="h-3 w-3 mr-0.5 fill-current" />
                    {destination.rating}
                  </div>
                )}
              </div>
            </div>
            
            <Badge 
              className={`absolute top-2 right-2 ${crowdLevelClass}`}
              variant="outline"
            >
              {currentCrowdLevel === 'low' ? 'Low crowds' : 
               currentCrowdLevel === 'medium' ? 'Moderate crowds' : 
               'High crowds'}
            </Badge>
          </div>
          
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {destination.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {destination.tags && destination.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="text-sm border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best time to visit:</span>
                <span className="font-medium">{bestTimeToVisit}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-muted/30 p-4 flex justify-between items-center">
            <div className="font-bold text-lg">
              {formatPrice(destination.price || 0)}
            </div>
            
            <Button size="sm">View Details</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default DestinationCard;
