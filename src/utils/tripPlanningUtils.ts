
// Get transport amenities based on type and whether it's overnight
export const getTransportAmenities = (type: string, isOvernight: boolean) => {
  const baseAmenities = {
    bus: ['Air conditioning', 'Reclining seats', 'Entertainment system', 'Onboard washroom', 'WiFi', 'USB charging'],
    train: ['Sleeping berths', 'Food service', 'Washroom', 'Power outlets', 'WiFi', 'Observation car', 'Dining car'],
    flight: ['Meals', 'Entertainment system', 'Beverage service', 'Reading materials', 'USB charging', 'WiFi access'],
    car: ['Air conditioning', 'Audio system', 'Privacy', 'Flexible stops', 'GPS navigation', 'Bluetooth connectivity']
  };
  
  const overnightAmenities = {
    bus: ['Sleeper seats', 'Blankets', 'Pillows', 'Night travel time saving', 'Reading lights', 'Quiet zone'],
    train: ['Private cabins', 'Berths', 'Bedding', '24-hour service', 'Shower facilities', 'Wake-up service'],
    flight: ['Red-eye options', 'Night kits', 'Full recline seats', 'Quiet cabin', 'Eye masks', 'Premium bedding'],
    car: ['Rest stops included', 'Hotel package', 'Split driving', 'Safe night parking', '24-hour assistance', 'Emergency support']
  };
  
  const premiumAmenities = {
    bus: ['Premium seating', 'Private section', 'Gourmet meals', 'Personal attendant', 'Priority boarding'],
    train: ['First-class cabin', 'Premium dining', 'Exclusive lounge', 'Concierge service', 'Priority disembarking'],
    flight: ['Business lounge', 'Priority check-in', 'Extra baggage', 'Premium meals', 'Chauffeur service'],
    car: ['Luxury vehicle', 'Professional driver', 'Refreshment bar', 'Privacy partition', 'Customized route']
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

// Get premium amenities for transport types
export const getPremiumTransportAmenities = (type: string) => {
  const premiumAmenities = {
    bus: ['Premium seating', 'Private section', 'Gourmet meals', 'Personal attendant', 'Priority boarding'],
    train: ['First-class cabin', 'Premium dining', 'Exclusive lounge', 'Concierge service', 'Priority disembarking'],
    flight: ['Business lounge', 'Priority check-in', 'Extra baggage', 'Premium meals', 'Chauffeur service'],
    car: ['Luxury vehicle', 'Professional driver', 'Refreshment bar', 'Privacy partition', 'Customized route']
  };
  
  // Handle unknown types gracefully
  const transportType = ['bus', 'train', 'flight', 'car'].includes(type) ? type : 'car';
  
  return premiumAmenities[transportType as keyof typeof premiumAmenities] || [];
};

// Get premium hotel amenities
export const getPremiumHotelAmenities = (hotelType: string) => {
  const premiumAmenities = {
    budget: ['Free breakfast', 'Priority check-in', 'Late checkout', 'Welcome drink'],
    standard: ['Room upgrade', 'Spa discount', 'Airport transfer', 'Welcome package', 'Concierge service'],
    luxury: ['Personal butler', 'Private pool access', 'Exclusive dining', 'VIP events access', 'Helicopter transfer']
  };
  
  const hotelCategory = ['budget', 'standard', 'luxury'].includes(hotelType) ? hotelType : 'standard';
  
  return premiumAmenities[hotelCategory as keyof typeof premiumAmenities] || [];
};

// Premium user benefits
export const getPremiumUserBenefits = () => {
  return [
    'Exclusive discounts on all bookings',
    'Premium transport and accommodation options',
    'Skip-the-line at popular attractions',
    'Dedicated travel concierge',
    'Free cancellation on most bookings',
    'Priority customer support',
    'Invitation to exclusive travel events',
    'Complimentary travel insurance',
    'Earn double rewards points',
    'Access to members-only deals'
  ];
};
