import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Enhanced TypeScript interfaces
interface StepData {
  steps: number;
  coins: number;
  distance: number;
  calories: number;
  lastUpdated: Date;
}

interface MotionData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  timestamp: number;
}

interface SamsungHealthAPI {
  getStepCountData: () => Promise<{ dailySteps: number }>;
}

interface WebAPIs {
  HealthService?: SamsungHealthAPI;
}

// Constants
const STEP_DETECTION_THRESHOLD = { MIN: 8, MAX: 20 };
const MIN_STEP_INTERVAL = 300; // milliseconds
const STEP_LENGTH_METERS = 0.7;
const STEPS_PER_COIN = 1000;
const CALORIES_PER_STEP = 0.04; // Average calories burned per step
const SAMSUNG_HEALTH_SYNC_INTERVAL = 10000; // 10 seconds
const STORAGE_KEY = 'bolta_step_data';

export const useStepCounter = () => {
  const [stepData, setStepData] = useState<StepData>({
    steps: 0,
    coins: 0,
    distance: 0,
    calories: 0,
    lastUpdated: new Date()
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const lastStepCount = useRef(0);
  const lastMotionTime = useRef(0);
  const motionBuffer = useRef<MotionData[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Utility functions
  const calculateDistance = useCallback((steps: number): number => {
    return Math.round((steps * STEP_LENGTH_METERS) / 1000 * 100) / 100; // km with 2 decimal places
  }, []);

  const calculateCoins = useCallback((steps: number): number => {
    return Math.floor(steps / STEPS_PER_COIN);
  }, []);

  const calculateCalories = useCallback((steps: number): number => {
    return Math.round(steps * CALORIES_PER_STEP);
  }, []);

  // Load persisted data
  const loadPersistedData = useCallback((): StepData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if data is from today
        const storedDate = new Date(parsed.lastUpdated);
        const today = new Date();
        const isToday = storedDate.toDateString() === today.toDateString();
        
        if (isToday) {
          return {
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted step data:', error);
    }
    return null;
  }, []);

  // Persist data
  const persistData = useCallback((data: StepData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist step data:', error);
    }
  }, []);

  // Enhanced Samsung Health integration
  const requestSamsungHealth = useCallback(async (): Promise<number | null> => {
    try {
      const win = window as Window & { webapis?: WebAPIs };
      if (win.webapis?.HealthService) {
        const healthService = win.webapis.HealthService;
        const result = await healthService.getStepCountData();
        return result.dailySteps || 0;
      }
    } catch (error) {
      console.log('Samsung Health not available:', error);
      setError('Samsung Health integration failed');
    }
    return null;
  }, []);

  // Enhanced motion detection with smoothing
  const processMotionData = useCallback((acceleration: DeviceAcceleration) => {
    const { x = 0, y = 0, z = 0 } = acceleration;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const timestamp = Date.now();

    // Add to motion buffer for smoothing
    motionBuffer.current.push({ x, y, z, magnitude, timestamp });
    
    // Keep only last 10 readings (for smoothing)
    if (motionBuffer.current.length > 10) {
      motionBuffer.current.shift();
    }

    // Calculate smoothed magnitude
    const smoothedMagnitude = motionBuffer.current.reduce((sum, data) => sum + data.magnitude, 0) / motionBuffer.current.length;
    
    // Detect step pattern with improved algorithm
    if (
      smoothedMagnitude > STEP_DETECTION_THRESHOLD.MIN && 
      smoothedMagnitude < STEP_DETECTION_THRESHOLD.MAX &&
      timestamp - lastMotionTime.current > MIN_STEP_INTERVAL
    ) {
      lastMotionTime.current = timestamp;
      incrementSteps();
    }
  }, []);

  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    if (!isTracking || !event.accelerationIncludingGravity) return;
    
    try {
      processMotionData(event.accelerationIncludingGravity);
    } catch (error) {
      console.error('Motion processing error:', error);
      setError('Motion detection failed');
    }
  }, [isTracking, processMotionData]);

  const incrementSteps = useCallback(() => {
    setStepData(prev => {
      const newSteps = prev.steps + 1;
      const newCoins = calculateCoins(newSteps);
      const newDistance = calculateDistance(newSteps);
      const newCalories = calculateCalories(newSteps);
      const newData: StepData = {
        steps: newSteps,
        coins: newCoins,
        distance: newDistance,
        calories: newCalories,
        lastUpdated: new Date()
      };
      
      // Show coin notification when earning new coin
      if (newCoins > prev.coins) {
        const coinsEarned = newCoins - prev.coins;
        toast({
          title: "🎉 Coin Earned!",
          description: `You've earned ${coinsEarned} Boltacoin${coinsEarned > 1 ? 's' : ''}!`,
          duration: 3000,
        });
      }
      
      // Persist data
      persistData(newData);
      
      return newData;
    });
  }, [calculateCoins, calculateDistance, calculateCalories, toast, persistData]);

  const updateStepsFromExternal = useCallback((steps: number) => {
    setStepData(prev => {
      const newCoins = calculateCoins(steps);
      const newDistance = calculateDistance(steps);
      const newCalories = calculateCalories(steps);
      const newData: StepData = {
        steps,
        coins: newCoins,
        distance: newDistance,
        calories: newCalories,
        lastUpdated: new Date()
      };
      
      // Show coin notification for significant increases
      if (newCoins > prev.coins) {
        const coinsEarned = newCoins - prev.coins;
        toast({
          title: "🎉 Progress Synced!",
          description: `Earned ${coinsEarned} Boltacoin${coinsEarned > 1 ? 's' : ''} from your activity!`,
          duration: 3000,
        });
      }
      
      persistData(newData);
      return newData;
    });
  }, [calculateCoins, calculateDistance, calculateCalories, toast, persistData]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      // First try Samsung Health
      const samsungSteps = await requestSamsungHealth();
      if (samsungSteps !== null) {
        updateStepsFromExternal(samsungSteps);
        setPermissionGranted(true);
        setIsTracking(true);
        return true;
      }

      // Fallback to device motion
      if (typeof DeviceMotionEvent !== 'undefined') {
        const DeviceMotionEventAny = DeviceMotionEvent as any;
        if (typeof DeviceMotionEventAny.requestPermission === 'function') {
          const permission = await DeviceMotionEventAny.requestPermission();
          if (permission === 'granted') {
            setPermissionGranted(true);
            setIsTracking(true);
            return true;
          } else {
            setError('Motion permission denied');
            return false;
          }
        } else {
          // Android or older browsers - permission not required
          setPermissionGranted(true);
          setIsTracking(true);
          return true;
        }
      } else {
        setError('Device motion not supported');
        return false;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setError('Failed to request permissions');
      return false;
    }
  }, [requestSamsungHealth, updateStepsFromExternal]);

  const startTracking = useCallback(async () => {
    if (!isInitialized) return;
    
    const success = await requestPermission();
    if (!success) {
      // Set demo data for non-mobile or when permissions fail
      setStepData(prev => ({
        ...prev,
        steps: 1250,
        coins: 1,
        distance: 0.88,
        calories: 50,
        lastUpdated: new Date()
      }));
    }
  }, [isInitialized, requestPermission]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }, []);

  const resetDailyData = useCallback(() => {
    const newData: StepData = {
      steps: 0,
      coins: 0,
      distance: 0,
      calories: 0,
      lastUpdated: new Date()
    };
    setStepData(newData);
    persistData(newData);
  }, [persistData]);

  // Initialize
  useEffect(() => {
    const persistedData = loadPersistedData();
    if (persistedData) {
      setStepData(persistedData);
    }
    setIsInitialized(true);
  }, [loadPersistedData]);

  // Start tracking when initialized
  useEffect(() => {
    if (isInitialized) {
      startTracking();
    }
  }, [isInitialized, startTracking]);

  // Device motion event listener
  useEffect(() => {
    if (isTracking && permissionGranted) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      
      return () => {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      };
    }
  }, [isTracking, permissionGranted, handleDeviceMotion]);

  // Samsung Health sync interval
  useEffect(() => {
    if (!isTracking) return;
    
    syncIntervalRef.current = setInterval(async () => {
      const samsungSteps = await requestSamsungHealth();
      if (samsungSteps !== null && samsungSteps !== lastStepCount.current) {
        lastStepCount.current = samsungSteps;
        updateStepsFromExternal(samsungSteps);
      }
    }, SAMSUNG_HEALTH_SYNC_INTERVAL);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isTracking, requestSamsungHealth, updateStepsFromExternal]);

  // Daily reset check
  useEffect(() => {
    const checkDailyReset = () => {
      const lastUpdate = stepData.lastUpdated;
      const now = new Date();
      
      if (lastUpdate.toDateString() !== now.toDateString()) {
        resetDailyData();
      }
    };

    // Check on mount and every hour
    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [stepData.lastUpdated, resetDailyData]);

  return {
    stepData,
    isTracking,
    permissionGranted,
    error,
    isInitialized,
    requestPermission,
    startTracking,
    stopTracking,
    resetDailyData
  } as const;
};