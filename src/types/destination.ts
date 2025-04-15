
export interface Destination {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  rating: number;
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  attractions?: string[];
  photography?: boolean;
  crowdData?: CrowdData;
  image?: string;
  images: string[];
  price?: number | {
    adult: number;
    child: number;
    foreigner?: number;
    includes?: string[];
  };
  tags?: string[];
  openingHours?: string;
  bestTimeToVisit?: string;
}

export type CrowdLevel = 'low' | 'medium' | 'high';

export interface CrowdData {
  [time: string]: number;
}

export interface DestinationFilters {
  crowdLevel: CrowdLevel | null;
  state: string | null;
  minPrice: number;
  maxPrice: number;
}

export interface DestinationContextType {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  getDestinationById: (id: string) => Destination | undefined;
  getCurrentCrowdLevel?: (crowdData?: CrowdData) => CrowdLevel;
  getBestTimeToVisit?: (crowdData?: CrowdData) => string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  filters?: DestinationFilters;
  setFilters?: (filters: Partial<DestinationFilters>) => void;
  clearFilters?: () => void;
  filteredDestinations?: Destination[];
}
