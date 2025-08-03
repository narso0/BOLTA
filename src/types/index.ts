// Mobile app types and interfaces for Bolta

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
  source: 'manual' | 'device' | 'health_kit' | 'google_fit';
}

export interface DailyStepRecord extends StepData {
  date: string; // YYYY-MM-DD format
  goalReached: boolean;
  streakDay: number;
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
  rating: number;
  reviewCount: number;
  tags: string[];
  expiresAt?: Date;
}

export type MarketplaceCategory = 'food' | 'equipment' | 'services' | 'supplements';

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  isVerified: boolean;
  rating: number;
  location: {
    city: string;
    country: string;
  };
}

export interface ItemAvailability {
  inStock: boolean;
  validUntil?: Date;
  limitPerUser?: number;
}

// Navigation types
export type RootStackParamList = {
  Intro: undefined;
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Marketplace: undefined;
  Profile: undefined;
};

// Device sensor types
export interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}