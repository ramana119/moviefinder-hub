
export const getTransportAmenities = (type: string, isOvernight: boolean = false): string[] => {
  const baseAmenities = ['Air Conditioning', 'Comfortable Seating'];
  
  switch(type) {
    case 'bus':
      return isOvernight 
        ? [...baseAmenities, 'Sleeper Berths', 'Blankets', 'Reading Light', 'Toilet']
        : [...baseAmenities, 'Water Bottle', 'Entertainment System', 'Toilet'];
      
    case 'train':
      return isOvernight 
        ? [...baseAmenities, 'Sleeper Berths', 'Bedding', 'Reading Light', 'Charging Ports', 'Dining Car']
        : [...baseAmenities, 'Charging Ports', 'Food Service', 'Large Windows'];
    
    case 'flight':
      return [...baseAmenities, 'Meal Service', 'Entertainment System', 'Charging Ports', 'Baggage Allowance'];
      
    case 'car':
      return [...baseAmenities, 'GPS Navigation', 'Music System', 'Flexible Stops'];
      
    default:
      return baseAmenities;
  }
};

export const suggestAccommodation = (
  travelStyle: 'base-hotel' | 'mobile' = 'base-hotel',
  transportType: 'bus' | 'train' | 'flight' | 'car' = 'car',
  isPremium: boolean = false
): string[] => {
  if (travelStyle === 'mobile') {
    if (transportType === 'train' && isPremium) {
      return ['First Class Sleeper Cabins', 'Premium Overnight Trains'];
    }
    
    if (transportType === 'bus' && isPremium) {
      return ['Luxury Sleeper Coaches', 'Premium Overnight Buses'];
    }
    
    if (transportType === 'car') {
      return isPremium 
        ? ['Premium Roadside Hotels', 'Luxury Camper Vans'] 
        : ['Budget Roadside Hotels', 'Motels'];
    }
    
    return ['Different hotels at each destination'];
  }
  
  return isPremium 
    ? ['Luxury hotels', 'Premium resorts', 'Boutique accommodations'] 
    : ['Standard hotels', 'Budget-friendly options', 'Homestays'];
};

export const estimateDailyActivities = (
  destinationType: string | undefined,
  isPremium: boolean = false
): string[] => {
  const baseActivities = ['Local sightseeing', 'Cultural experiences'];
  
  const premiumActivities = isPremium 
    ? ['Private guided tours', 'Exclusive experiences', 'Priority access'] 
    : [];
  
  switch(destinationType) {
    case 'nature':
      return [...baseActivities, ...premiumActivities, 'Hiking', 'Wildlife spotting', 'Photography'];
    
    case 'beach':
    case 'ocean':
      return [...baseActivities, ...premiumActivities, 'Swimming', 'Water sports', 'Sunset viewing'];
    
    case 'city':
    case 'urban':
      return [...baseActivities, ...premiumActivities, 'Shopping', 'Museum visits', 'Local cuisine'];
    
    case 'mountains':
    case 'hiking':
      return [...baseActivities, ...premiumActivities, 'Trekking', 'Camping', 'Scenic viewpoints'];
    
    case 'history':
    case 'culture':
    case 'ancient':
      return [...baseActivities, ...premiumActivities, 'Monument visits', 'Historical tours', 'Traditional experiences'];
    
    default:
      return [...baseActivities, ...premiumActivities, 'Local exploration', 'Photography', 'Relaxation'];
  }
};
