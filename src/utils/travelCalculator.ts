
/**
 * Utility to calculate travel details based on transport type and distance
 */
export const calculateTravelDetails = (distanceKm: number, transportType: 'bus' | 'train' | 'flight' | 'car') => {
  // Default values in case the switch falls through
  let speed = 60;      // km/h
  let costPerKm = 3;   // in rupees
  let bestFor = 'Flexible travel with multiple stops';
  let overnightOption = false;
  let estimatedTime = 0;
  let estimatedCost = 0;
  let amenities: string[] = [];

  switch(transportType) {
    case 'bus':
      speed = 50; // km/h
      costPerKm = 1.5; // in rupees
      bestFor = 'Short to medium distances (50-300km)';
      overnightOption = true;
      amenities = ['Air conditioning', 'Reclining seats', 'Entertainment system'];
      break;
    case 'train':
      speed = 80; // km/h
      costPerKm = 2; // in rupees
      bestFor = 'Medium to long distances (100-800km)';
      overnightOption = true;
      amenities = ['Sleeping berths', 'Food service', 'More space to move'];
      break;
    case 'flight':
      speed = 500; // km/h
      costPerKm = 8; // in rupees
      bestFor = 'Long distances (500km+)';
      overnightOption = false;
      amenities = ['Fast travel', 'Meals on board', 'Entertainment options'];
      break;
    case 'car':
      speed = 60; // km/h
      costPerKm = 3; // in rupees
      bestFor = 'Flexible travel with multiple stops';
      overnightOption = false;
      amenities = ['Privacy', 'Flexibility', 'Door-to-door service'];
      break;
  }

  // Calculate estimated time and cost
  estimatedTime = distanceKm / speed;
  estimatedCost = distanceKm * costPerKm;

  // Format time as hours and minutes
  const hours = Math.floor(estimatedTime);
  const minutes = Math.round((estimatedTime - hours) * 60);
  const formattedTime = hours > 0 
    ? `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`
    : `${minutes} min`;

  return {
    speed,
    costPerKm,
    bestFor,
    overnightOption,
    amenities,
    estimatedTime,
    formattedTime,
    estimatedCost,
    totalDistance: distanceKm
  };
};

/**
 * Utility to get transport type amenities
 */
export const getTransportTypeAmenities = (transportType: 'bus' | 'train' | 'flight' | 'car', isOvernight: boolean = false) => {
  const baseAmenities = {
    bus: ['Air conditioning', 'Reclining seats', 'Entertainment system'],
    train: ['Sleeping berths', 'Food service', 'More space to move'],
    flight: ['Fast travel', 'Meals on board', 'Entertainment options'],
    car: ['Privacy', 'Flexibility', 'Door-to-door service']
  };
  
  const overnightAmenities = {
    bus: ['Sleeper seats', 'Blankets', 'Night travel time saving'],
    train: ['Private cabins', 'Berths', '24-hour service'],
    flight: ['Red-eye options', 'Night arrival', 'Time zone crossing'],
    car: ['Multiple drivers', 'Rest stops', 'Hotel packages']
  };
  
  return isOvernight 
    ? [...baseAmenities[transportType], ...overnightAmenities[transportType]]
    : baseAmenities[transportType];
};

/**
 * Calculate feasibility of a multi-destination trip
 */
export const calculateTripFeasibility = (
  destinations: { id: string; name: string; distance?: number }[],
  transportType: 'bus' | 'train' | 'flight' | 'car',
  numberOfDays: number
) => {
  if (!destinations || destinations.length === 0) {
    return {
      feasible: false,
      daysNeeded: 0,
      reason: "No destinations selected"
    };
  }

  // Calculate total distance (assuming destinations array has distances between each point)
  let totalDistance = 0;
  for (let i = 0; i < destinations.length - 1; i++) {
    totalDistance += destinations[i].distance || 100; // Default to 100km if not provided
  }

  // Get travel details
  const travelDetails = calculateTravelDetails(totalDistance, transportType);
  
  // Calculate days needed for travel (assuming 8 hours of travel per day)
  const travelDays = Math.ceil(travelDetails.estimatedTime / 8);
  
  // Assume minimum 1 day per destination for sightseeing
  const sightseeingDays = destinations.length;
  
  // Total days needed
  const daysNeeded = travelDays + sightseeingDays;
  
  // Check if feasible
  const feasible = numberOfDays >= daysNeeded;
  
  return {
    feasible,
    daysNeeded,
    daysShort: feasible ? 0 : daysNeeded - numberOfDays,
    breakdown: {
      travelDays,
      sightseeingDays,
      totalDistance
    },
    travelDetails
  };
};
