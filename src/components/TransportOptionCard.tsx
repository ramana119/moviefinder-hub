
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Bus, Train, Plane, Car } from 'lucide-react';
import { TransportType } from '../types/transport';
import { formatPrice } from '../utils/helpers';

interface TransportOptionCardProps {
  transport: TransportType;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

const TransportOptionCard: React.FC<TransportOptionCardProps> = ({ 
  transport, 
  isSelected = false, 
  onSelect 
}) => {
  const getIcon = () => {
    switch (transport.type) {
      case 'bus': return <Bus className="h-5 w-5" />;
      case 'train': return <Train className="h-5 w-5" />;
      case 'flight': return <Plane className="h-5 w-5" />;
      case 'car': return <Car className="h-5 w-5" />;
      default: return <Bus className="h-5 w-5" />;
    }
  };

  const handleClick = () => {
    onSelect(transport.id);
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium">
              {transport.name || `${transport.type.charAt(0).toUpperCase() + transport.type.slice(1)}`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {transport.transportClass || transport.cabinClass || transport.busClass || transport.carType || ''}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <p className="font-medium">{formatPrice(transport.pricePerPerson)}</p>
          <p className="text-xs text-muted-foreground">per person</p>
          
          {isSelected && (
            <div className="mt-1 flex items-center text-primary">
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Selected</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportOptionCard;
