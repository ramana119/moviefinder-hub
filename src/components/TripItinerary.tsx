import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Bus, 
  Train, 
  Plane, 
  Car, 
  ArrowRight, 
  Info, 
  MapPin, 
  Hotel, 
  Clock, 
  AlertTriangle, 
  Coffee,
  Wifi,
  Utensils,
  Droplet,
  Tv,
  Plug,
  Star,
  Sun,
  Moon,
  Cloud,
  Umbrella
} from 'lucide-react';
import { TripItineraryDay } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTripPlanning } from '../context/TripPlanningContext';
import { getTransportAmenities } from '../utils/tripPlanningUtils';

interface TripItineraryProps {
  itinerary: TripItineraryDay[];
  transportType: 'bus' | 'train' | 'flight' | 'car';
  isPremium?: boolean;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ 
  itinerary, 
  transportType = 'car',
  isPremium = false
}) => {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [groupedItinerary, setGroupedItinerary] = useState<any[]>([]);
  
  useEffect(() => {
    if (!itinerary || itinerary.length === 0) return;
    
    const grouped = [];
    let currentGroup: any = {
      destinationId: itinerary[0].destinationId,
      destinationName: itinerary[0].destinationName,
      days: [itinerary[0].day],
      startDate: itinerary[0].date,
      endDate: itinerary[0].date,
      activities: [...itinerary[0].activities],
      isTransitDay: itinerary[0].isTransitDay,
      detailedSchedule: itinerary[0].detailedSchedule,
      hotels: itinerary[0].hotels,
      departureTime: itinerary[0].departureTime,
      arrivalTime: itinerary[0].arrivalTime,
      transportDetails: itinerary[0].transportDetails,
      freshUpStops: itinerary[0].freshUpStops
    };
    
    for (let i = 1; i < itinerary.length; i++) {
      const day = itinerary[i];
      
      if (day.destinationId === currentGroup.destinationId && !day.isTransitDay && !currentGroup.isTransitDay) {
        currentGroup.days.push(day.day);
        currentGroup.endDate = day.date;
        
        day.activities.forEach(activity => {
          if (!currentGroup.activities.includes(activity)) {
            currentGroup.activities.push(activity);
          }
        });
      } 
      else {
        grouped.push(currentGroup);
        currentGroup = {
          destinationId: day.destinationId,
          destinationName: day.destinationName,
          days: [day.day],
          startDate: day.date,
          endDate: day.date,
          activities: [...day.activities],
          isTransitDay: day.isTransitDay,
          detailedSchedule: day.detailedSchedule,
          hotels: day.hotels,
          departureTime: day.departureTime,
          arrivalTime: day.arrivalTime,
          transportDetails: day.transportDetails,
          freshUpStops: day.freshUpStops
        };
      }
    }
    
    grouped.push(currentGroup);
    setGroupedItinerary(grouped);
  }, [itinerary]);
  
  const calculateTravelDetails = (type: string) => {
    switch(type) {
      case 'bus':
        return {
          speed: '50 km/h',
          cost: '₹1.5/km',
          advantages: ['Economical', 'Multiple stops', 'No parking needed'],
          overnight: 'Sleeper available for long routes',
          icon: <Bus className="h-5 w-5" />
        };
      case 'train':
        return {
          speed: '80 km/h',
          cost: '₹2/km',
          advantages: ['Comfortable', 'Scenic views', 'No traffic'],
          overnight: 'Sleeper/AC options available',
          icon: <Train className="h-5 w-5" />
        };
      case 'flight':
        return {
          speed: '500 km/h',
          cost: '₹8/km',
          advantages: ['Fastest option', 'Best for long distances', 'Time-saving'],
          overnight: 'Red-eye flights available',
          icon: <Plane className="h-5 w-5" />
        };
      case 'car':
        return {
          speed: '60 km/h',
          cost: '₹3/km',
          advantages: ['Flexible schedule', 'Door-to-door convenience', 'Privacy'],
          overnight: 'Not recommended, find hotels',
          icon: <Car className="h-5 w-5" />
        };
      default:
        return {
          speed: '60 km/h',
          cost: '₹3/km',
          advantages: ['Flexible schedule', 'Door-to-door convenience', 'Privacy'],
          overnight: 'Not recommended, find hotels',
          icon: <Car className="h-5 w-5" />
        };
    }
  };

  const generateDailyPremiumInsights = (destinationName: string, day: number) => {
    const hash = (destinationName.charCodeAt(0) * 31 + day * 17) % 1000;
    
    const startHour = 8 + (hash % 4);
    const duration = 1 + (hash % 3) * 0.5;
    let endHour = startHour + duration;
    
    const startTimeMin = (hash % 2 === 0) ? '00' : '30';
    const startTimeFormatted = `${startHour}:${startTimeMin}`;
    
    const endHourWhole = Math.floor(endHour);
    const endMinutes = (endHour - endHourWhole) * 60;
    const endTimeFormatted = `${endHourWhole}:${endMinutes === 0 ? '00' : '30'}`;
    
    const bestTimeDisplay = `${startTimeFormatted} - ${endTimeFormatted} ${startHour < 12 ? 'AM' : 'PM'}`;
    
    const crowdPercent = 20 + (hash % 60);
    
    const secretTips = [
      `Ask for the ${destinationName.split(' ')[0]} special at local cafes`,
      `The ${['north', 'south', 'east', 'west'][hash % 4]} entrance has shorter lines`,
      `Free ${['guided tour', 'wifi', 'map', 'snack'][hash % 4]} available near main gate`,
      `Best photo spot: ${['sunrise', 'sunset', 'golden hour', 'blue hour'][hash % 4]} at ${['main gate', 'east side', 'west garden', 'viewpoint'][hash % 4]}`,
      `${['Local guide', 'Hotel concierge', 'Tourist info', 'Park ranger'][hash % 4]} knows hidden gems`
    ];
    
    return {
      bestTime: `Least crowds at ${bestTimeDisplay}`,
      secretTip: secretTips[hash % secretTips.length],
      crowdPrediction: Array.from({ length: 4 }).map((_, i) => ({
        time: `${9 + i * 3}:00 ${i < 2 ? 'AM' : 'PM'}`,
        level: ['low', 'medium', 'high', 'peak'][(hash + i) % 4] as 'low' | 'medium' | 'high',
        percentage: 20 + (hash + i * 10) % 60
      }))
    };
  };

  const renderHotelInfo = (hotelData: any) => {
    if (typeof hotelData === 'string' || !hotelData) {
      return (
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Hotel info unavailable</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="border rounded-lg p-3 bg-gray-50">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">{hotelData.name || "Hotel"}</p>
            {hotelData.location && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{hotelData.location.distanceFromCenter?.toFixed(1) || "0"} km from center</span>
              </div>
            )}
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < (hotelData.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              ₹{hotelData.pricePerPerson || hotelData.pricePerNight || 0}/person
            </div>
            {hotelData.checkInTime && (
              <div className="text-xs text-gray-500 mt-1">
                {hotelData.checkInTime} - {hotelData.checkOutTime}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {hotelData.amenities && hotelData.amenities.slice(0, 4).map((amenity: string, i: number) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderCrowdLevel = (level: string, percentage: number) => {
    let color = 'text-green-600';
    let icon = <Sun className="h-4 w-4" />;
    
    if (percentage > 60) {
      color = 'text-red-600';
      icon = <Umbrella className="h-4 w-4" />;
    } else if (percentage > 30) {
      color = 'text-amber-600';
      icon = <Cloud className="h-4 w-4" />;
    }
    
    return (
      <span className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span>{level} ({percentage}%)</span>
      </span>
    );
  };

  const hasTransitDays = itinerary.some(day => day.isTransitDay);

  const findBaseHotel = () => {
    if (!groupedItinerary.length) return null;
    
    const maxDaysGroup = groupedItinerary.reduce((max, group) => 
      max.days.length > group.days.length ? max : group, groupedItinerary[0]);
    
    return maxDaysGroup.days.length > 1 ? maxDaysGroup.destinationName : null;
  };

  const baseHotel = findBaseHotel();
  const travelDetails = calculateTravelDetails(transportType);

  const hasReturnDay = groupedItinerary.some(group => 
    group.isTransitDay && group.destinationName.toLowerCase().includes('return') || 
    group.destinationName.toLowerCase().includes('home'));
  
  const renderReturnDay = () => {
    if (hasReturnDay || !groupedItinerary.length) return null;
    
    const lastDay = itinerary[itinerary.length - 1];
    const returnDate = new Date(lastDay.date);
    returnDate.setDate(returnDate.getDate() + 1);
    
    return (
      <Card className="overflow-hidden border-blue-200 bg-blue-50 mt-4">
        <CardContent className="p-0">
          <div className="p-4 bg-blue-100/50">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Day {lastDay.day + 1}: Return Home</h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                Return Journey
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {format(returnDate, 'PPP')}
            </p>
          </div>
          <div className="p-4 border-t">
            <div className="space-y-3">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      {travelDetails.icon}
                    </div>
                    <div>
                      <p className="font-medium">Return Journey</p>
                      <p className="text-sm text-gray-500">
                        Best return timing for crowd-free travel
                      </p>
                    </div>
                  </div>
                </div>
                {isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-3">
                    <p className="text-sm font-medium text-amber-800">Premium Travel Advice</p>
                    <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc pl-4">
                      <li>Early morning departures typically have less traffic</li>
                      <li>Consider a mid-week return for fewer crowds</li>
                      <li>Plan for buffer time in case of delays</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No itinerary available for this trip.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Trip Overview</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{itinerary.length} days</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm">
              {new Set(itinerary.map(day => day.destinationId)).size} destinations
            </span>
          </div>
          <div className="flex items-center gap-1">
            {travelDetails.icon}
            <span className="text-sm capitalize">{transportType} travel</span>
          </div>
          
          {baseHotel && (
            <div className="flex items-center gap-1">
              <Hotel className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Base: {baseHotel}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-blue-100">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <h4 className="text-xs uppercase text-gray-500 font-semibold">Transport Details</h4>
              <div className="mt-1 flex items-center gap-2">
                {travelDetails.icon}
                <span className="text-sm capitalize font-medium">{transportType}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <div className="grid grid-cols-[80px_1fr] gap-1 text-xs">
                  <span className="text-gray-500">Average Speed:</span>
                  <span>{travelDetails.speed}</span>
                  <span className="text-gray-500">Cost per km:</span>
                  <span>{travelDetails.cost}</span>
                  <span className="text-gray-500">Best for:</span>
                  <span>{travelDetails.advantages[0]}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <h4 className="text-xs uppercase text-gray-500 font-semibold">Amenities</h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {getTransportAmenities(transportType, hasTransitDays).map((amenity, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            
            {isPremium && (
              <div className="flex-1 min-w-[150px]">
                <h4 className="text-xs uppercase text-gray-500 font-semibold">Premium Insights</h4>
                <ul className="mt-1 text-xs space-y-1 text-gray-600">
                  <li className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" /> 
                    Best time to travel: Off-peak hours
                  </li>
                  <li className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" /> 
                    Crowd prediction: Moderate
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {groupedItinerary.map((group, index) => {
          const isLastGroupAtDestination = index === groupedItinerary.length - 1 || 
            groupedItinerary[index + 1].destinationId !== group.destinationId;
          
          const nextGroup = index < groupedItinerary.length - 1 ? 
            groupedItinerary[index + 1] : null;
          
          const premiumInsights = isPremium ? 
            generateDailyPremiumInsights(group.destinationName, group.days[0]) : null;
          
          return (
            <Card 
              key={`group-${index}`} 
              className={`overflow-hidden ${group.isTransitDay ? 'border-blue-200 bg-blue-50' : ''}`}
            >
              <CardContent className="p-0">
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${group.isTransitDay ? 'bg-blue-100/50' : 'bg-gray-50'}`}
                  onClick={() => setExpandedDays(prev => ({
                    ...prev,
                    [`group-${index}`]: !prev[`group-${index}`]
                  }))}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {group.days.length > 1 ? 
                          `Days ${group.days.join(', ')}: ${group.destinationName}` : 
                          `Day ${group.days[0]}: ${group.destinationName}`}
                      </h3>
                      {group.isTransitDay && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                          Transit
                        </Badge>
                      )}
                      {isLastGroupAtDestination && nextGroup && !group.isTransitDay && (
                        <div className="flex items-center text-xs text-gray-500">
                          <ArrowRight className="h-3 w-3 mx-1" />
                          <span>Next: {nextGroup.destinationName}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(group.startDate), 'PPP')}
                      {group.days.length > 1 && ` - ${format(new Date(group.endDate), 'PPP')}`}
                    </p>
                  </div>
                  <div>
                    {expandedDays[`group-${index}`] ? (
                      <span className="text-xs rounded-full bg-gray-200 px-2 py-1">Hide Details</span>
                    ) : (
                      <span className="text-xs rounded-full bg-gray-200 px-2 py-1">Show Details</span>
                    )}
                  </div>
                </div>
                
                {expandedDays[`group-${index}`] && (
                  <div className="p-4 border-t">
                    {group.isTransitDay ? (
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                {travelDetails.icon}
                              </div>
                              <div>
                                <p className="font-medium">Transit Journey</p>
                                <p className="text-sm text-gray-500">
                                  {group.destinationName}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50">
                              ~{group.transportDetails?.duration || '8 hours'}
                            </Badge>
                          </div>
                          
                          <div className="ml-4 pl-7 border-l-2 border-dashed border-blue-200 space-y-3">
                            <div className="relative">
                              <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-green-600" />
                              </div>
                              <p className="text-sm">
                                <span className="font-medium">Departure:</span> {group.departureTime || "8:00 AM"}
                              </p>
                            </div>
                            
                            {group.freshUpStops?.map((stop: any, i: number) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                                  <Coffee className="h-3 w-3 text-amber-600" />
                                </div>
                                <p className="text-sm">
                                  <span className="font-medium">{stop.time}:</span> {stop.location}
                                </p>
                              </div>
                            ))}
                            
                            <div className="relative">
                              <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-red-600" />
                              </div>
                              <p className="text-sm">
                                <span className="font-medium">Arrival:</span> {group.arrivalTime || "4:00 PM"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {isPremium && (
                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-3">
                            <p className="text-sm font-medium text-amber-800">Premium Travel Advice</p>
                            <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc pl-4">
                              <li>Recommended rest stops marked with local attractions</li>
                              <li>Best photo opportunities along the route</li>
                              <li>Traffic prediction: Light traffic expected</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Activities</h4>
                          <ul className="space-y-1 list-disc pl-5">
                            {group.activities.map((activity: string, i: number) => (
                              <li key={i} className="text-sm">
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {group.detailedSchedule && group.detailedSchedule.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Suggested Daily Schedule</h4>
                            <ul className="space-y-3">
                              {group.detailedSchedule.map((item: any, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-gray-500 min-w-[60px]">{item.time}</span>
                                  <div>
                                    <p>{item.activity}</p>
                                    {item.notes && (
                                      <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {group.hotels && group.hotels.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Recommended Hotel</h4>
                            {renderHotelInfo(group.hotels[0])}
                          </div>
                        )}
                        
                        {isPremium && premiumInsights && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                              Premium Insights for {group.destinationName}
                            </h4>
                            <p className="text-xs text-blue-700 mb-2">{premiumInsights.bestTime}</p>
                            <p className="text-xs text-blue-700 mb-2">{premiumInsights.secretTip}</p>
                            
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-blue-700">Crowd Prediction:</p>
                              {premiumInsights.crowdPrediction.map((pred: any, i: number) => (
                                <div key={i} className="flex justify-between text-xs text-blue-600">
                                  <span>{pred.time}</span>
                                  {renderCrowdLevel(pred.level, pred.percentage)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {isLastGroupAtDestination && nextGroup && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mt-3">
                            <p className="text-sm font-medium text-blue-800">Next Destination</p>
                            <p className="text-xs text-blue-700 mt-1">
                              Next you'll be heading to {nextGroup.destinationName}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {renderReturnDay()}
      </div>
    </div>
  );
};

export default TripItinerary;
