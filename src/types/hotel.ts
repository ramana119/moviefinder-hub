
export interface HotelType {
  id: string;
  name: string;
  destinationId: string;
  type: 'budget' | 'standard' | 'luxury';
  pricePerNight?: number;
  pricePerPerson: number;
  rating: number;
  imageUrl?: string;
  image?: string;
  amenities: string[];
  location?: {
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
    distanceFromCenter: number;
    proximityScore: number;
    nearbyAttractions?: Array<{ name: string; distance: number; }>;
  };
  checkInTime?: string;
  checkOutTime?: string;
  contact?: string;
}
