
import { CrowdLevel } from '../types';

// Format price to currency
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Get CSS class based on crowd level
export const getCrowdLevelBgClass = (level: CrowdLevel) => {
  switch(level) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
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
