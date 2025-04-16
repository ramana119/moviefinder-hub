
/**
 * Utility to calculate travel details based on transport type and distance
 */
export const calculateTravelDetails = (distanceKm: number, transportType: 'bus' | 'train' | 'flight' | 'car') => {
  switch(transportType) {
    case 'bus':
      return {
        speed: 50, // km/h
        costPerKm: 1.5, // in rupees
        bestFor: 'Short to medium distances (50-300km)',
        overnightOption: true
      };
    case 'train':
      return {
        speed: 80, // km/h
        costPerKm: 2, // in rupees
        bestFor: 'Medium to long distances (100-800km)',
        overnightOption: true
      };
    case 'flight':
      return {
        speed: 500, // km/h
        costPerKm: 8, // in rupees
        bestFor: 'Long distances (500km+)',
        overnightOption: false
      };
    case 'car':
      return {
        speed: 60, // km/h
        costPerKm: 3, // in rupees
        bestFor: 'Flexible travel with multiple stops',
        overnightOption: false
      };
    default:
      return {
        speed: 60, // km/h
        costPerKm: 3, // in rupees
        bestFor: 'Flexible travel with multiple stops',
        overnightOption: false
      };
  }
};
