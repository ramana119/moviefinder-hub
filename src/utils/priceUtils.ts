
export const createPrice = (basePrice: number): number => {
  // Apply any price modifiers, discounts, or calculations here
  return basePrice;
};

// Hotel pricing multipliers based on type
export const getHotelTypeMultiplier = (hotelType: 'budget' | 'standard' | 'luxury'): number => {
  switch (hotelType) {
    case 'budget':
      return 0.7;
    case 'standard':
      return 1.0;
    case 'luxury':
      return 1.8;
    default:
      return 1.0;
  }
};

// Transport pricing multipliers based on type
export const getTransportTypeMultiplier = (transportType: 'bus' | 'train' | 'flight' | 'car'): number => {
  switch (transportType) {
    case 'bus':
      return 0.6;
    case 'train':
      return 1.0;
    case 'flight':
      return 2.2;
    case 'car':
      return 0.8;
    default:
      return 1.0;
  }
};

// Calculate per-day cost for a specific hotel type
export const calculateHotelCostPerDay = (
  hotelType: 'budget' | 'standard' | 'luxury', 
  baseCost: number = 2500
): number => {
  return baseCost * getHotelTypeMultiplier(hotelType);
};

// Calculate transport cost based on distance and type
export const calculateTransportCost = (
  transportType: 'bus' | 'train' | 'flight' | 'car',
  distanceKm: number,
  baseCostPerKm: number = 5
): number => {
  const baseDistanceCost = distanceKm * baseCostPerKm;
  return baseDistanceCost * getTransportTypeMultiplier(transportType);
};

// Calculate final price with all factors considered
export const calculateFinalPrice = (
  basePrice: number,
  hotelType: 'budget' | 'standard' | 'luxury',
  transportType: 'bus' | 'train' | 'flight' | 'car',
  numberOfDays: number,
  numberOfPeople: number
): number => {
  const hotelCost = calculateHotelCostPerDay(hotelType) * numberOfDays * numberOfPeople;
  const transportCost = calculateTransportCost(transportType, 300) * numberOfPeople;
  const baseActivityCost = basePrice * numberOfPeople;
  
  return hotelCost + transportCost + baseActivityCost;
};
