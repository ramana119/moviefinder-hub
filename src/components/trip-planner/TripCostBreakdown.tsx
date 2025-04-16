
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Star, Users, Hotel, Bus, Car, Train, Plane, Calendar, Clock, Info } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';
import { Destination, GuideType } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  // Calculate hotel display info
  const getHotelInfo = () => {
    if (selectedDestinations.length === 1) {
      return `${hotelType} (Single Hotel)`;
    } else {
      return travelStyle === 'base-hotel' 
        ? `${hotelType} (Base Hotel)`
        : `${hotelType} (Multiple Hotels - ${selectedDestinations.length} locations)`;
    }
  };

  // Get tooltip info for costs
  const getHotelTooltip = () => {
    if (selectedDestinations.length === 1) {
      return `${hotelType} hotel for ${numberOfDays} nights`;
    } else if (travelStyle === 'base-hotel') {
      return `One ${hotelType} hotel near all destinations for ${numberOfDays} nights`;
    } else {
      return `Multiple ${hotelType} hotels (one in each destination) for ${numberOfDays} nights. Includes 15% premium for multi-destination coordination.`;
    }
  };

  const getTransportTooltip = () => {
    if (selectedDestinations.length === 1) {
      return `${transportType} transportation within ${getDestinationById(selectedDestinations[0])?.name || 'destination'}`;
    } else {
      return `${transportType} transportation between ${selectedDestinations.length} destinations`;
    }
  };

  return (
    <TooltipProvider>
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Trip Summary</span>
            {selectedDestinations.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {selectedDestinations.length} {selectedDestinations.length === 1 ? 'destination' : 'destinations'}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Destinations</h4>
            {selectedDestinations.length > 0 ? (
              <div className="max-h-36 overflow-y-auto pr-2 space-y-2">
                {selectedDestinations.map((destinationId) => {
                  const destination = getDestinationById(destinationId);
                  return destination ? (
                    <div className="flex items-center gap-3" key={destination.id}>
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
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
                        <p className="text-sm font-medium">{destination.name}</p>
                        <p className="text-xs text-muted-foreground">{destination.city}, {destination.state}</p>
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
            <h4 className="text-sm font-medium">Trip Details</h4>
            <div className="space-y-2 bg-gray-50 rounded-md p-3">
              {startDate ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <p className="text-sm">Dates</p>
                  </div>
                  <p className="text-sm">
                    {formatDate(startDate)} - {getEndDate(startDate, numberOfDays)}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <p className="text-sm">Dates</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Not selected</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <p className="text-sm">Duration</p>
                </div>
                <p className="text-sm">{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <p className="text-sm">People</p>
                </div>
                <p className="text-sm">{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium">Accommodation & Transport</h4>
            <div className="space-y-2 bg-gray-50 rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Hotel className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <p className="text-sm">Hotel</p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <p className="text-sm capitalize">{getHotelInfo()}</p>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-60">{getHotelTooltip()}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getTravelIcon(transportType)}
                  <p className="text-sm ml-1.5">Transport</p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <p className="text-sm capitalize">{transportType}</p>
                      {sleepTransport && (
                        <span className="text-xs ml-2 bg-muted px-2 py-0.5 rounded-full">Overnight</span>
                      )}
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-60">{getTransportTooltip()}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium">
              Guides
              <span className="text-xs ml-1 text-muted-foreground">
                ({selectedGuides.length} selected)
              </span>
            </h4>
            {selectedGuides.length > 0 ? (
              <div className="space-y-2">
                {selectedGuides.map((guideId) => {
                  const guide = guides.find(g => g.id === guideId);
                  return guide ? (
                    <div key={guide.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted overflow-hidden">
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
                      <div className="text-right text-sm">
                        {formatPrice(guide.pricePerDay)} <span className="text-xs text-muted-foreground">/ day</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No guides selected</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Cost Breakdown</h4>
            <div className="space-y-1.5">
              <div className="text-sm flex justify-between">
                <span>Destinations:</span>
                <span>{formatPrice(costBreakdown.destinationsCost)}</span>
              </div>
              <div className="text-sm flex justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <span>Hotels ({numberOfDays} nights):</span>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {travelStyle === 'mobile' && selectedDestinations.length > 1 
                        ? 'Multiple hotels with 15% coordination fee' 
                        : `${hotelType} hotel(s) for ${numberOfDays} nights`}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <span>{formatPrice(costBreakdown.hotelsCost)}</span>
              </div>
              <div className="text-sm flex justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <span>Transport:</span>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {selectedDestinations.length > 1 
                        ? `${transportType} between ${selectedDestinations.length} destinations` 
                        : `Local ${transportType} transportation`}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <span>{formatPrice(costBreakdown.transportCost)}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span>Guides ({selectedGuides.length}):</span>
                <span>{formatPrice(costBreakdown.guidesCost)}</span>
              </div>
              <Separator className="my-2" />
              <div className="pt-1 flex justify-between items-center text-lg font-bold">
                <span>Total Cost:</span>
                <span>{formatPrice(totalCost)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-right">
                For {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}, {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            className="w-full" 
            onClick={onSubmit} 
            disabled={isPlanning || selectedDestinations.length === 0 || !startDate}
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
          {!startDate && selectedDestinations.length > 0 && (
            <p className="text-xs text-amber-600">
              Please select a start date to continue
            </p>
          )}
          {!isFeasible && (
            <p className="text-xs text-amber-600">
              ⚠️ This trip may not be feasible with current days. Consider adding more days.
            </p>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default TripCostBreakdown;
