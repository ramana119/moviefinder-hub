
import { TransportType } from '../types';

export const transports: TransportType[] = [
  {
    id: 'transport_001',
    name: 'Standard Bus',
    type: 'bus',
    pricePerPerson: 300,
    travelTime: 8,
    amenities: ['Air conditioning', 'Comfortable seating'],
    busClass: 'standard',
    seatType: 'regular'
  },
  {
    id: 'transport_002',
    name: 'Luxury Bus',
    type: 'bus',
    pricePerPerson: 600,
    travelTime: 8,
    amenities: ['Air conditioning', 'Reclining seats', 'TV', 'Snacks', 'Charging points'],
    busClass: 'luxury',
    seatType: 'sleeper'
  },
  {
    id: 'transport_003',
    name: 'Passenger Train',
    type: 'train',
    pricePerPerson: 400,
    travelTime: 6,
    amenities: ['Air conditioning', 'Comfortable seating', 'Food service'],
    class: 'Second Class',
    berthOption: 'sleeper'
  },
  {
    id: 'transport_004',
    name: 'Express Train',
    type: 'train',
    pricePerPerson: 800,
    travelTime: 4,
    amenities: ['Air conditioning', 'Comfortable seating', 'Food service', 'Charging points', 'Faster service'],
    class: 'First Class',
    berthOption: 'AC'
  },
  {
    id: 'transport_005',
    name: 'Economy Flight',
    type: 'flight',
    pricePerPerson: 2500,
    travelTime: 1.5,
    amenities: ['Air conditioning', 'Basic meal'],
    cabinClass: 'economy',
    baggageAllowance: '15kg'
  },
  {
    id: 'transport_006',
    name: 'Business Flight',
    type: 'flight',
    pricePerPerson: 5000,
    travelTime: 1.5,
    amenities: ['Air conditioning', 'Premium meal', 'Extra legroom', 'Priority boarding'],
    cabinClass: 'business',
    baggageAllowance: '30kg'
  },
  {
    id: 'transport_007',
    name: 'Standard Car',
    type: 'car',
    pricePerPerson: 700,
    travelTime: 10,
    amenities: ['Air conditioning', 'Comfortable seating', 'Flexible schedule'],
    carType: 'sedan',
    transmission: 'manual'
  },
  {
    id: 'transport_008',
    name: 'Premium Car',
    type: 'car',
    pricePerPerson: 1400,
    travelTime: 10,
    amenities: ['Air conditioning', 'Luxury vehicle', 'Comfortable seating', 'Refreshments', 'Flexible schedule'],
    carType: 'suv',
    transmission: 'automatic'
  }
];
