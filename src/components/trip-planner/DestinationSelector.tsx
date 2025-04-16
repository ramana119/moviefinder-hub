
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Destination } from '@/types';

interface DestinationSelectorProps {
  destinations: Destination[];
  selectedDestinations: string[];
  onSelectDestination: (id: string) => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({ 
  destinations, 
  selectedDestinations, 
  onSelectDestination 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {destinations.map(destination => (
        <Card 
          key={destination.id}
          className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
            selectedDestinations.includes(destination.id) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectDestination(destination.id)}
        >
          <CardContent className="p-0">
            <div className="relative h-40">
              <img
                src={destination.images?.[0] || destination.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                alt={destination.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                }}
              />
              <div className="absolute top-2 left-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-white drop-shadow-md" />
                <span className="text-sm text-white font-semibold drop-shadow-md">
                  {destination.city}, {destination.state}
                </span>
              </div>
              {selectedDestinations.includes(destination.id) && (
                <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{destination.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{destination.description}</p>
              {destination.crowdData && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {Object.values(destination.crowdData).reduce((a, b) => a + b, 0) / Object.values(destination.crowdData).length < 50 ? 'Low crowds' : 
                     Object.values(destination.crowdData).reduce((a, b) => a + b, 0) / Object.values(destination.crowdData).length < 75 ? 'Moderate crowds' : 'High crowds'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DestinationSelector;
