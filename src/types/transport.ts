
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
}

export type BusType = 'standard' | 'luxury' | 'sleeper' | 'volvo';
export type TrainType = 'general' | 'sleeper' | 'ac-chair' | 'ac-sleeper';
export type FlightType = 'economy' | 'business' | 'first-class';
export type CarType = 'hatchback' | 'sedan' | 'suv' | 'luxury';
