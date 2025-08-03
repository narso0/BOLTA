import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceMotion } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StepData, SensorData } from '../types';

// Constants
const STEP_DETECTION_THRESHOLD = { MIN: 8, MAX: 20 };
const MIN_STEP_INTERVAL = 300; // milliseconds
const STEP_LENGTH_METERS = 0.7;
const STEPS_PER_COIN = 1000;
const CALORIES_PER_STEP = 0.04;
const STORAGE_KEY = 'bolta_step_data';

interface UseStepCounterReturn {
  stepData: StepData;
  isTracking: boolean;
  permissionGranted: boolean;
  error: string | null;
  isInitialized: boolean;
  requestPermissions: () => Promise<void>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  addSteps: (steps: number) => void;
  resetDaily: () => void;
}

export const useStepCounter = (): UseStepCounterReturn => {
  const [stepData, setStepData] = useState<StepData>({
    steps: 0,
    coins: 0,
    distance: 0,
    calories: 0,
    lastUpdated: new Date(),
    source: 'device'
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const lastMotionTime = useRef(0);
  const motionBuffer = useRef<SensorData[]>([]);
  const subscription = useRef<any>(null);

  // Utility functions
  const calculateDistance = useCallback((steps: number): number => {
    return Math.round((steps * STEP_LENGTH_METERS) / 1000 * 100) / 100;
  }, []);

  const calculateCoins = useCallback((steps: number): number => {
    return Math.floor(steps / STEPS_PER_COIN);
  }, []);

  const calculateCalories = useCallback((steps: number): number => {
    return Math.round(steps * CALORIES_PER_STEP);
  }, []);

  // Load persisted data
  const loadPersistedData = useCallback(async (): Promise<StepData | null> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedDate = new Date(parsed.lastUpdated);
        const today = new Date();
        
        if (storedDate.toDateString() === today.toDateString()) {
          return {
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated)
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to load persisted step data:', error);
      return null;
    }
  }, []);

  // Save data to storage
  const saveData = useCallback(async (data: StepData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save step data:', error);
    }
  }, []);

  // Update step data
  const updateStepData = useCallback((newSteps: number, source: StepData['source'] = 'device') => {
    const now = new Date();
    const distance = calculateDistance(newSteps);
    const coins = calculateCoins(newSteps);
    const calories = calculateCalories(newSteps);

    const newData: StepData = {
      steps: newSteps,
      coins,
      distance,
      calories,
      lastUpdated: now,
      source
    };

    setStepData(newData);
    saveData(newData);
  }, [calculateDistance, calculateCoins, calculateCalories, saveData]);

  // Step detection algorithm
  const detectStep = useCallback((sensorData: SensorData) => {
    const { x, y, z, timestamp } = sensorData;
    
    // Add to motion buffer
    motionBuffer.current.push({ x, y, z, timestamp });
    
    // Keep only last 10 readings
    if (motionBuffer.current.length > 10) {
      motionBuffer.current.shift();
    }
    
    // Check for step pattern
    if (motionBuffer.current.length >= 3) {
      const recent = motionBuffer.current.slice(-3);
      const magnitudes = recent.map(r => Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z));
      
      // Simple peak detection
      if (magnitudes[1] > magnitudes[0] && 
          magnitudes[1] > magnitudes[2] && 
          magnitudes[1] > STEP_DETECTION_THRESHOLD.MIN &&
          magnitudes[1] < STEP_DETECTION_THRESHOLD.MAX &&
          timestamp - lastMotionTime.current > MIN_STEP_INTERVAL) {
        
        lastMotionTime.current = timestamp;
        return true;
      }
    }
    
    return false;
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async () => {
    try {
      setError(null);
      
      const motionPermission = await DeviceMotion.requestPermissionsAsync();
      if (!motionPermission.granted) {
        throw new Error('Motion sensor permission denied');
      }

      setPermissionGranted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission request failed';
      setError(errorMessage);
      setPermissionGranted(false);
    }
  }, []);

  // Start step tracking
  const startTracking = useCallback(async () => {
    if (!permissionGranted) {
      await requestPermissions();
      if (!permissionGranted) return;
    }

    try {
      setError(null);
      
      const isAvailable = await DeviceMotion.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Device motion sensor not available');
      }

      DeviceMotion.setUpdateInterval(100);

      subscription.current = DeviceMotion.addListener((motionData) => {
        if (motionData && motionData.acceleration) {
          const sensorData: SensorData = {
            x: motionData.acceleration.x || 0,
            y: motionData.acceleration.y || 0,
            z: motionData.acceleration.z || 0,
            timestamp: Date.now()
          };

          if (detectStep(sensorData)) {
            const newStepCount = stepData.steps + 1;
            updateStepData(newStepCount);
          }
        }
      });

      setIsTracking(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start tracking';
      setError(errorMessage);
      setIsTracking(false);
    }
  }, [permissionGranted, requestPermissions, stepData.steps, detectStep, updateStepData]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    setIsTracking(false);
  }, []);

  // Add steps manually
  const addSteps = useCallback((steps: number) => {
    const newStepCount = stepData.steps + steps;
    updateStepData(newStepCount, 'manual');
  }, [stepData.steps, updateStepData]);

  // Reset daily data
  const resetDaily = useCallback(() => {
    updateStepData(0);
  }, [updateStepData]);

  // Initialize hook
  useEffect(() => {
    const initialize = async () => {
      try {
        const persistedData = await loadPersistedData();
        if (persistedData) {
          setStepData(persistedData);
        }

        const motionPermission = await DeviceMotion.getPermissionsAsync();
        setPermissionGranted(motionPermission.granted);

        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize step counter:', err);
        setError('Initialization failed');
        setIsInitialized(true);
      }
    };

    initialize();
  }, [loadPersistedData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    stepData,
    isTracking,
    permissionGranted,
    error,
    isInitialized,
    requestPermissions,
    startTracking,
    stopTracking,
    addSteps,
    resetDaily
  };
};