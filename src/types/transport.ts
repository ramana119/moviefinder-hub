
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
  transportClass?: string;  // Added for bus transport type
  cabinClass?: string;      // Added for flight transport type
  busClass?: string;        // Added for bus transport type
  carType?: string;         // Added for car transport type
}
