
export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  bookings?: string[];
  profileComplete?: boolean;
  isPremium?: boolean;
  premiumPurchaseDate?: string;
  refundPercentage?: number;
  withdrawalDate?: string;
  profileData?: {
    address?: string;
    phone?: string;
    phoneNumber?: string;
    dob?: string;
    preferredDestinations?: string[];
    travelFrequency?: string;
  };
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'bookings' | 'profileComplete'>) => Promise<void>;
  logout: () => void;
  completeProfile: (profileData: User['profileData']) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  cancelPremium: () => Promise<void>;
  withdrawPremium: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
