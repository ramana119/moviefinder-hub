
export interface TransportType {
  id: string;
  name: string;
  type: 'bus' | 'train' | 'flight' | 'car';
  pricePerPerson: number;
  image?: string;
  description?: string;
  company?: string;
  destinationId?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  amenities?: string[];
  transportClass?: string;  
  cabinClass?: string;      
  busClass?: string;        
  carType?: string;         
  // Add missing properties used in transports.ts
  travelTime?: number;
  operator?: string;
  totalSeats?: number;
  availableSeats?: number;
  rating?: number;
}
