
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransportType } from '../types';

interface TransportOptionCardProps {
  transport: TransportType;
  onSelect: (transportId: string) => void;
  isSelected: boolean;
}

const TransportOptionCard: React.FC<TransportOptionCardProps> = ({ transport, onSelect, isSelected }) => {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${isSelected ? 'border-2 border-primary' : ''}`}
      onClick={() => onSelect(transport.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{transport.name || transport.type}</h3>
            <p className="text-sm text-gray-500">{transport.operator || 'Standard Service'}</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary">₹{transport.pricePerPerson}</Badge>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <p>Type: {transport.type}</p>
          <p>Travel Time: {transport.travelTime || 'Unknown'} hours</p>
        </div>
        <div className="mt-3">
          {transport.amenities.map((amenity, index) => (
            <Badge key={index} variant="outline" className="mr-1 text-xs">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportOptionCard;
