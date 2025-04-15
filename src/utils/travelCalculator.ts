
export interface TravelDetails {
  speed: number;
  costPerKm: number;
  overnightOption: boolean;
  bestFor: string;
}

export const calculateTravelDetails = (
  distanceKm: number, 
  transportType: 'bus' | 'train' | 'flight' | 'car'
): TravelDetails => {
  switch (transportType) {
    case 'bus':
      return {
        speed: 50,
        costPerKm: 1.5,
        overnightOption: true,
        bestFor: 'Economical travel for short to medium distances'
      };
    case 'train':
      return {
        speed: 80,
        costPerKm: 2,
        overnightOption: true,
        bestFor: 'Comfortable travel for medium to long distances'
      };
    case 'flight':
      return {
        speed: 500,
        costPerKm: 8,
        overnightOption: false,
        bestFor: 'Quick travel for long distances or time-sensitive trips'
      };
    case 'car':
      return {
        speed: 60,
        costPerKm: 3,
        overnightOption: false,
        bestFor: 'Flexible travel with door-to-door convenience'
      };
    default:
      return {
        speed: 60,
        costPerKm: 3,
        overnightOption: false,
        bestFor: 'Flexible travel with door-to-door convenience'
      };
  }
};

export const calculateTravelTime = (
  distanceKm: number, 
  transportType: 'bus' | 'train' | 'flight' | 'car'
): number => {
  const details = calculateTravelDetails(distanceKm, transportType);
  return distanceKm / details.speed;
};

export const calculateTravelCost = (
  distanceKm: number, 
  transportType: 'bus' | 'train' | 'flight' | 'car',
  numberOfPeople: number = 1
): number => {
  const details = calculateTravelDetails(distanceKm, transportType);
  return distanceKm * details.costPerKm * numberOfPeople;
};
