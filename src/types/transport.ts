
export interface TransportType {
  id: string;
  name?: string;
  type: 'bus' | 'train' | 'flight' | 'car';
  pricePerPerson: number;
  travelTime?: number;
  amenities: string[];
  busClass?: string;
  seatType?: string;
  class?: string;
  berthOption?: string;
  cabinClass?: string;
  baggageAllowance?: string;
  carType?: string;
  transmission?: string;
  operator?: string;
  airline?: string;
  rentalCompany?: string;
  estimatedDuration?: string;
  transportClass?: string; // Added for data compatibility
  departureTime?: string; // Added for data compatibility
  arrivalTime?: string; // Added for data compatibility
  totalSeats?: number; // Added for data compatibility
  availableSeats?: number; // Added for data compatibility
  rating?: number; // Added for data compatibility
}

export type BusType = 'standard' | 'luxury' | 'sleeper' | 'volvo';
export type TrainType = 'general' | 'sleeper' | 'ac-chair' | 'ac-sleeper';
export type FlightType = 'economy' | 'business' | 'first-class';
export type CarType = 'hatchback' | 'sedan' | 'suv' | 'luxury';
