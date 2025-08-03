// Mobile app types for Bolta Fitness

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface StepData {
  steps: number;
  coins: number;
  distance: number;
  calories: number;
  lastUpdated: Date;
  source: 'manual' | 'device' | 'health_kit' | 'google_fit';
}

export interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export type RootStackParamList = {
  Main: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Marketplace: undefined;
  Profile: undefined;
};