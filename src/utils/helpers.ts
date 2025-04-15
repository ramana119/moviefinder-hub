import { CrowdLevel } from '../types';

// Format price to currency
export const formatPrice = (price: number | { adult: number; child: number; foreigner?: number; includes?: string[] }): string => {
  // For complex price objects, use the adult price
  const numericPrice = typeof price === 'number' ? price : price.adult;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numericPrice);
};

// Get CSS class based on crowd level
export const getCrowdLevelBgClass = (level: string): string => {
  switch(level) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

// Get best time to visit based on crowd data
export const getBestTimeToVisit = (crowdData: Record<string, number> = {}) => {
  if (Object.keys(crowdData).length === 0) return 'Any time';
  
  let bestTime = '';
  let lowestCrowd = Infinity;
  
  for (const [time, crowdLevel] of Object.entries(crowdData)) {
    if (typeof crowdLevel === 'number' && crowdLevel < lowestCrowd) {
      lowestCrowd = crowdLevel;
      bestTime = time;
    }
  }
  
  if (!bestTime) return 'Any time';
  
  // Format time for display
  const [hours] = bestTime.split(':').map(Number);
  return hours === 0 ? '12 AM' : 
         hours === 12 ? '12 PM' : 
         hours > 12 ? `${hours - 12} PM` : 
         `${hours} AM`;
};

// Get current crowd level based on crowd data
export const getCurrentCrowdLevel = (crowdData: Record<string, number> = {}): CrowdLevel => {
  if (Object.keys(crowdData).length === 0) return 'medium';
  
  const now = new Date();
  const currentHour = now.getHours();
  const timeKey = `${currentHour}:00`;
  
  // Get the crowd level for the current hour
  const crowdLevel = crowdData[timeKey];
  
  if (typeof crowdLevel !== 'number') return 'medium';
  
  if (crowdLevel <= 40) return 'low';
  if (crowdLevel <= 70) return 'medium';
  return 'high';
};

// Generate initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Get the base price from either a number or price object
export const getBasePrice = (price: number | { adult: number; child: number; foreigner?: number; includes?: string[] }): number => {
  return typeof price === 'number' ? price : price.adult;
};
