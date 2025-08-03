// Global application types and interfaces

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ka' | 'ru';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  units: UnitSettings;
}

export interface NotificationSettings {
  dailyGoal: boolean;
  coinEarned: boolean;
  achievements: boolean;
  weeklyReport: boolean;
  push: boolean;
  email: boolean;
}

export interface PrivacySettings {
  shareProgress: boolean;
  showInLeaderboard: boolean;
  allowFriendRequests: boolean;
}

export interface UnitSettings {
  distance: 'km' | 'miles';
  weight: 'kg' | 'lbs';
  temperature: 'celsius' | 'fahrenheit';
}

// Step tracking types
export interface StepData {
  steps: number;
  coins: number;
  distance: number;
  calories: number;
  lastUpdated: Date;
  source: 'manual' | 'device' | 'samsung_health' | 'google_fit';
}

export interface DailyStepRecord extends StepData {
  date: string; // YYYY-MM-DD format
  goalReached: boolean;
  streakDay: number;
}

export interface WeeklyStepSummary {
  weekStart: string; // YYYY-MM-DD format
  totalSteps: number;
  totalCoins: number;
  totalDistance: number;
  totalCalories: number;
  dailyRecords: DailyStepRecord[];
  averageSteps: number;
  goalDaysReached: number;
}

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  reward: AchievementReward;
  achieved: boolean;
  achievedAt?: Date;
  progress: number;
  isHidden: boolean;
}

export type AchievementCategory = 
  | 'steps'
  | 'distance'
  | 'coins'
  | 'streak'
  | 'social'
  | 'special';

export interface AchievementRequirement {
  type: 'steps' | 'distance' | 'coins' | 'days' | 'custom';
  value: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'alltime';
}

export interface AchievementReward {
  coins?: number;
  badge?: string;
  title?: string;
  discount?: MarketplaceDiscount;
}

// Marketplace types
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: MarketplaceCategory;
  vendor: Vendor;
  coinPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  availability: ItemAvailability;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  expiresAt?: Date;
  termsAndConditions?: string;
}

export type MarketplaceCategory = 
  | 'food'
  | 'fitness'
  | 'wellness'
  | 'shopping'
  | 'entertainment'
  | 'education';

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  rating?: number;
  isVerified: boolean;
  location?: VendorLocation;
}

export interface VendorLocation {
  city: string;
  country: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ItemAvailability {
  inStock: boolean;
  quantity?: number;
  validUntil?: Date;
  location?: 'online' | 'physical' | 'both';
}

export interface MarketplaceDiscount {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  validUntil: Date;
  usageLimit?: number;
  usedCount?: number;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: Date;
  metadata?: TransactionMetadata;
}

export type TransactionType = 
  | 'coin_earned'
  | 'coin_spent'
  | 'coin_bonus'
  | 'coin_penalty';

export interface TransactionMetadata {
  steps?: number;
  achievementId?: string;
  marketplaceItemId?: string;
  source?: string;
  [key: string]: any;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  count?: number;
  badge?: string;
  disabled?: boolean;
  description?: string;
  children?: NavigationItem[];
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
  options?: FormFieldOption[];
  disabled?: boolean;
  helperText?: string;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'date'
  | 'file';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  radius: number;
}

// Device and sensor types
export interface DeviceInfo {
  platform: string;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsMotion: boolean;
  supportsGeolocation: boolean;
  battery?: BatteryInfo;
}

export interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime?: number;
  dischargingTime?: number;
}

export interface MotionData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  timestamp: number;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  category: AnalyticsCategory;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  properties?: Record<string, any>;
}

export type AnalyticsCategory = 
  | 'user'
  | 'navigation'
  | 'engagement'
  | 'conversion'
  | 'error'
  | 'performance';

// Error types
export interface AppError {
  name: string;
  message: string;
  code?: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

// State management types
export interface AppState {
  user: UserState;
  steps: StepsState;
  marketplace: MarketplaceState;
  achievements: AchievementsState;
  ui: UIState;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface StepsState {
  current: StepData;
  history: DailyStepRecord[];
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
}

export interface MarketplaceState {
  items: MarketplaceItem[];
  categories: MarketplaceCategory[];
  vendors: Vendor[];
  userTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface AchievementsState {
  achievements: Achievement[];
  unlockedCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  theme: ThemeConfig;
  activeTab: string;
  isMenuOpen: boolean;
  notifications: NotificationState[];
  modals: ModalState[];
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoClose: boolean;
  duration?: number;
  timestamp: Date;
}

export interface ModalState {
  id: string;
  component: string;
  props?: Record<string, any>;
  isOpen: boolean;
  onClose?: () => void;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event handler types
export type EventHandler<T = void> = (event?: T) => void;
export type AsyncEventHandler<T = void> = (event?: T) => Promise<void>;

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface LoadingProps {
  isLoading?: boolean;
  loadingText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ErrorProps {
  error?: string | null;
  onRetry?: () => void;
  retryText?: string;
}

// Hook return types
export interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UseLocalStorage<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// Constants
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  STEPS: '/steps',
  ACHIEVEMENTS: '/achievements',
  MARKETPLACE: '/marketplace',
  TRANSACTIONS: '/transactions'
} as const;

export const STORAGE_KEYS = {
  USER: 'bolta_user',
  STEPS: 'bolta_steps',
  THEME: 'bolta_theme',
  SETTINGS: 'bolta_settings'
} as const;

export const QUERY_KEYS = {
  USER: ['user'],
  STEPS: ['steps'],
  ACHIEVEMENTS: ['achievements'],
  MARKETPLACE: ['marketplace'],
  TRANSACTIONS: ['transactions']
} as const;