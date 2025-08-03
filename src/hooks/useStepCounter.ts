import { useState, useEffect, useRef, useCallback } from 'react';
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
    source: 'web'
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(true); // Web doesn't need sensor permissions
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Utility functions
  const calculateDistance = useCallback((steps: number): number => {
    return Math.round((steps * STEP_LENGTH_METERS) / 1000 * 100) / 100; // km with 2 decimal places
  }, []);

  const calculateCalories = useCallback((steps: number): number => {
    return Math.round(steps * CALORIES_PER_STEP * 100) / 100;
  }, []);

  const calculateCoins = useCallback((steps: number): number => {
    return Math.floor(steps / STEPS_PER_COIN);
  }, []);

  // Storage functions for web (using localStorage instead of AsyncStorage)
  const saveStepData = useCallback(async (data: StepData): Promise<void> => {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: data.lastUpdated.toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save step data:', error);
    }
  }, []);

  const loadStepData = useCallback(async (): Promise<StepData | null> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        };
      }
    } catch (error) {
      console.error('Failed to load step data:', error);
    }
    return null;
  }, []);

  // Check if it's a new day and reset if needed
  const checkAndResetDaily = useCallback((data: StepData): StepData => {
    const now = new Date();
    const lastUpdate = new Date(data.lastUpdated);
    
    // Check if it's a new day (different date)
    const isNewDay = now.toDateString() !== lastUpdate.toDateString();
    
    if (isNewDay) {
      console.log('New day detected, resetting step count');
      return {
        steps: 0,
        coins: data.coins, // Keep accumulated coins
        distance: 0,
        calories: 0,
        lastUpdated: now,
        source: data.source
      };
    }
    
    return data;
  }, []);

  // Update step data with new steps
  const updateStepData = useCallback((newSteps: number, source: StepData['source'] = 'web') => {
    setStepData(prevData => {
      const totalSteps = prevData.steps + newSteps;
      const distance = calculateDistance(totalSteps);
      const calories = calculateCalories(totalSteps);
      const coins = calculateCoins(totalSteps);
      
      const newData: StepData = {
        steps: totalSteps,
        coins: prevData.coins + (coins - calculateCoins(prevData.steps)), // Only add new coins
        distance,
        calories,
        lastUpdated: new Date(),
        source
      };
      
      // Save to localStorage
      saveStepData(newData);
      
      return newData;
    });
  }, [calculateDistance, calculateCalories, calculateCoins, saveStepData]);

  // Manual step addition (for web interface)
  const addSteps = useCallback((steps: number) => {
    updateStepData(steps, 'manual');
  }, [updateStepData]);

  // Simulate step tracking (for demo purposes on web)
  const startSimulation = useCallback(() => {
    if (simulationInterval.current) return;
    
    simulationInterval.current = setInterval(() => {
      // Simulate 1-3 steps every few seconds for demo
      const randomSteps = Math.floor(Math.random() * 3) + 1;
      updateStepData(randomSteps, 'simulated');
    }, 5000); // Every 5 seconds
  }, [updateStepData]);

  const stopSimulation = useCallback(() => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
  }, []);

  // Web doesn't need motion permissions
  const requestPermissions = useCallback(async (): Promise<void> => {
    setPermissionGranted(true);
    setError(null);
  }, []);

  // Start tracking (web version uses simulation)
  const startTracking = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsTracking(true);
      
      // Start simulation for demo purposes
      startSimulation();
      
      console.log('Step tracking started (web simulation)');
    } catch (error) {
      console.error('Failed to start tracking:', error);
      setError('Failed to start step tracking');
      setIsTracking(false);
    }
  }, [startSimulation]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    stopSimulation();
    console.log('Step tracking stopped');
  }, [stopSimulation]);

  // Reset daily data
  const resetDaily = useCallback(() => {
    const resetData: StepData = {
      steps: 0,
      coins: stepData.coins, // Keep accumulated coins
      distance: 0,
      calories: 0,
      lastUpdated: new Date(),
      source: 'web'
    };
    
    setStepData(resetData);
    saveStepData(resetData);
  }, [stepData.coins, saveStepData]);

  // Initialize hook
  useEffect(() => {
    const initializeStepCounter = async () => {
      try {
        setError(null);
        
        // Load saved data
        const savedData = await loadStepData();
        
        if (savedData) {
          // Check if we need to reset for new day
          const checkedData = checkAndResetDaily(savedData);
          setStepData(checkedData);
          
          // Save if data was reset
          if (checkedData !== savedData) {
            await saveStepData(checkedData);
          }
        }
        
        setPermissionGranted(true);
        setIsInitialized(true);
        
        console.log('Step counter initialized for web');
      } catch (error) {
        console.error('Failed to initialize step counter:', error);
        setError('Failed to initialize step tracking');
        setIsInitialized(true);
      }
    };

    initializeStepCounter();
  }, [loadStepData, checkAndResetDaily, saveStepData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, [stopSimulation]);

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