
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Star, Users, Hotel, Bus, Car, Train, Plane } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';
import { Destination, GuideType } from '@/types';

interface TripCostBreakdownProps {
  selectedDestinations: string[];
  startDate?: Date;
  numberOfDays: number;
  numberOfPeople: number;
  hotelType: 'budget' | 'standard' | 'luxury';
  travelStyle: 'base-hotel' | 'mobile';
  transportType: 'bus' | 'train' | 'flight' | 'car';
  sleepTransport: boolean;
  selectedGuides: string[];
  guides: GuideType[];
  costBreakdown: {
    destinationsCost: number;
    hotelsCost: number;
    transportCost: number;
    guidesCost: number;
  };
  totalCost: number;
  isPlanning: boolean;
  isFeasible: boolean;
  getDestinationById: (id: string) => Destination | undefined;
  onSubmit: () => void;
}

const TripCostBreakdown: React.FC<TripCostBreakdownProps> = ({
  selectedDestinations,
  startDate,
  numberOfDays,
  numberOfPeople,
  hotelType,
  travelStyle,
  transportType,
  sleepTransport,
  selectedGuides,
  guides,
  costBreakdown,
  totalCost,
  isPlanning,
  isFeasible,
  getDestinationById,
  onSubmit
}) => {
  const getTravelIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'train': return <Train className="h-4 w-4" />;
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Not selected';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getEndDate = (startDate?: Date, days = 1) => {
    if (!startDate) return 'Not selected';
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1);
    return formatDate(endDate);
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Trip Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Destinations</h4>
          {selectedDestinations.length > 0 ? (
            <div className="max-h-40 overflow-y-auto pr-2">
              {selectedDestinations.map((destinationId) => {
                const destination = getDestinationById(destinationId);
                return destination ? (
                  <div className="flex items-center gap-3 mb-3" key={destination.id}>
                    <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                      <img 
                        src={destination.images?.[0] || destination.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                        alt={destination.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{destination.name}</h4>
                      <p className="text-sm text-muted-foreground">{destination.city}, {destination.state}</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No destinations selected</p>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Dates</h4>
          {startDate ? (
            <p className="text-sm">
              {formatDate(startDate)} - {getEndDate(startDate, numberOfDays)}
              <span className="text-xs text-muted-foreground ml-2">
                ({numberOfDays} {numberOfDays === 1 ? 'day' : 'days'})
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No dates selected</p>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">People</h4>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <p className="text-sm">{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</p>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Hotel</h4>
          <div className="flex items-center">
            <Hotel className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <p className="text-sm capitalize">{hotelType} ({travelStyle === 'base-hotel' ? 'Base Hotel' : 'Multi-Hotel'})</p>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Transport</h4>
          <div className="flex items-center">
            {getTravelIcon(transportType)}
            <p className="text-sm ml-1.5 capitalize">{transportType}</p>
            {sleepTransport && (
              <span className="text-xs ml-2 bg-muted px-2 py-0.5 rounded-full">Overnight</span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Guides</h4>
          {selectedGuides.length > 0 ? (
            <div>
              {selectedGuides.map((guideId) => {
                const guide = guides.find(g => g.id === guideId);
                return guide ? (
                  <div key={guide.id} className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                      <img 
                        src={guide.imageUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                        alt={guide.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{guide.name}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < (guide.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No guides selected</p>
          )}
        </div>

        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="text-sm flex justify-between">
            <span>Destinations:</span>
            <span>{formatPrice(costBreakdown.destinationsCost)}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span>Hotels ({numberOfDays} {numberOfDays === 1 ? 'night' : 'nights'}):</span>
            <span>{formatPrice(costBreakdown.hotelsCost)}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span>Transport:</span>
            <span>{formatPrice(costBreakdown.transportCost)}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span>Guides:</span>
            <span>{formatPrice(costBreakdown.guidesCost)}</span>
          </div>
          <div className="pt-2 border-t flex justify-between items-center text-lg font-bold">
            <span>Total Cost:</span>
            <span>{formatPrice(totalCost)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          className="w-full" 
          onClick={onSubmit} 
          disabled={isPlanning || selectedDestinations.length === 0}
        >
          {isPlanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Planning...
            </>
          ) : (
            'Create Trip Plan'
          )}
        </Button>
        {!isFeasible && (
          <p className="text-sm text-amber-600">
            ⚠️ This trip may not be feasible with current days. Consider adding more days.
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default TripCostBreakdown;
