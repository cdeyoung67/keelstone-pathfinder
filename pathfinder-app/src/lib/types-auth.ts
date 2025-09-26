// Authentication and User Management Types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  door: 'christian' | 'secular';
  avatar?: string;
  
  // Profile information
  dateJoined: Date;
  lastActive: Date;
  timezone?: string;
  
  // Preferences
  emailNotifications: boolean;
  weeklyDigest: boolean;
  communitySharing: boolean;
  
  // Subscription/Plan info
  plan: 'free' | 'premium';
  planExpires?: Date;
  
  // Progress tracking
  completedPrograms: string[];
  currentProgram?: string;
  totalQuotes: number;
  totalTestimonies: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  door: 'christian' | 'secular';
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
}

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  
  // Social auth (future)
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsed: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

// Authentication flow states
export type AuthModalState = 'closed' | 'login' | 'signup' | 'forgot-password' | 'verify-email';

export interface AuthModalProps {
  isOpen: boolean;
  initialState?: AuthModalState;
  onClose: () => void;
  onSuccess?: (user: User) => void;
}
