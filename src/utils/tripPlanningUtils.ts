
// Get transport amenities based on type and whether it's overnight
export const getTransportAmenities = (type: string, isOvernight: boolean) => {
  const baseAmenities = {
    bus: ['Air conditioning', 'Reclining seats', 'Entertainment system', 'Onboard washroom'],
    train: ['Sleeping berths', 'Food service', 'Washroom', 'Power outlets'],
    flight: ['Meals', 'Entertainment system', 'Beverage service', 'Reading materials'],
    car: ['Air conditioning', 'Audio system', 'Privacy', 'Flexible stops']
  };
  
  const overnightAmenities = {
    bus: ['Sleeper seats', 'Blankets', 'Pillows', 'Night travel time saving'],
    train: ['Private cabins', 'Berths', 'Bedding', '24-hour service'],
    flight: ['Red-eye options', 'Night kits', 'Full recline seats', 'Quiet cabin'],
    car: ['Rest stops included', 'Hotel package', 'Split driving', 'Safe night parking']
  };
  
  // Handle unknown types gracefully
  const transportType = ['bus', 'train', 'flight', 'car'].includes(type) ? type : 'car';
  
  if (isOvernight) {
    return [
      ...(baseAmenities[transportType as keyof typeof baseAmenities] || []),
      ...(overnightAmenities[transportType as keyof typeof overnightAmenities] || [])
    ];
  }
  
  return baseAmenities[transportType as keyof typeof baseAmenities] || [];
};
