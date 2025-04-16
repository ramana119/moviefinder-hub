
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bus, Train, Plane, Car } from 'lucide-react';
import { TransportType } from '@/types/transport';
import TransportOptionCard from '../TransportOptionCard';

interface TransportTypeSelectorProps {
  transportType: 'bus' | 'train' | 'flight' | 'car';
  setTransportType: (type: 'bus' | 'train' | 'flight' | 'car') => void;
  sleepTransport: boolean;
  setSleepTransport: (value: boolean) => void;
  relevantTransports: TransportType[];
  selectedTransport: string | null;
  handleSelectTransport: (id: string) => void;
  suggestedTransport: any;
  isPremium: boolean;
}

const TransportTypeSelector: React.FC<TransportTypeSelectorProps> = ({
  transportType,
  setTransportType,
  sleepTransport,
  setSleepTransport,
  relevantTransports,
  selectedTransport,
  handleSelectTransport,
  suggestedTransport,
  isPremium
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="transportType">Transport Type</Label>
        <div className="grid grid-cols-4 gap-4">
          <Button
            variant={transportType === 'bus' ? 'default' : 'outline'}
            onClick={() => setTransportType('bus')}
            className="flex flex-col h-auto py-4"
          >
            <Bus className="h-6 w-6 mb-2" />
            <span>Bus</span>
          </Button>
          <Button
            variant={transportType === 'train' ? 'default' : 'outline'}
            onClick={() => setTransportType('train')}
            className="flex flex-col h-auto py-4"
          >
            <Train className="h-6 w-6 mb-2" />
            <span>Train</span>
          </Button>
          <Button
            variant={transportType === 'flight' ? 'default' : 'outline'}
            onClick={() => setTransportType('flight')}
            className="flex flex-col h-auto py-4"
          >
            <Plane className="h-6 w-6 mb-2" />
            <span>Flight</span>
          </Button>
          <Button
            variant={transportType === 'car' ? 'default' : 'outline'}
            onClick={() => setTransportType('car')}
            className="flex flex-col h-auto py-4"
          >
            <Car className="h-6 w-6 mb-2" />
            <span>Car</span>
          </Button>
        </div>
      </div>
      
      {suggestedTransport && (
        <Card className="bg-muted border-0">
          <CardContent className="p-4">
            <p className="text-sm">
              <span className="font-medium">Recommendation:</span> We suggest traveling by{' '}
              <span className="font-medium capitalize">{suggestedTransport.recommendedType}</span>{' '}
              for your selected destinations.
            </p>
            {isPremium && suggestedTransport.premiumAdvantages && (
              <div className="mt-2">
                <p className="text-sm font-medium">Premium Benefits:</p>
                <ul className="mt-1 text-xs space-y-1">
                  {suggestedTransport.premiumAdvantages.map((benefit: string, i: number) => (
                    <li key={i} className="flex">
                      <span className="mr-2">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Transport Options</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sleepTransport"
              checked={sleepTransport}
              onCheckedChange={(checked) => setSleepTransport(!!checked)}
            />
            <label
              htmlFor="sleepTransport"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include overnight travel
            </label>
          </div>
        </div>
        
        {relevantTransports.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {relevantTransports.slice(0, 4).map(transport => (
              <TransportOptionCard
                key={transport.id}
                transport={transport}
                isSelected={selectedTransport === transport.id}
                onSelect={handleSelectTransport}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No transport options available for the selected type.
            Please select a different transport type.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransportTypeSelector;
