import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StepData {
  steps: number;
  coins: number;
  distance: number;
}

export const useStepCounter = () => {
  const [stepData, setStepData] = useState<StepData>({
    steps: 0,
    coins: 0,
    distance: 0
  });
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const lastStepCount = useRef(0);
  const motionEventRef = useRef<DeviceMotionEvent | null>(null);
  const { toast } = useToast();

  // Calculate distance from steps (average step length ~0.7 meters)
  const calculateDistance = (steps: number) => {
    return Math.round((steps * 0.7) / 1000 * 100) / 100; // km with 2 decimal places
  };

  // Calculate coins from steps (1000 steps = 1 coin)
  const calculateCoins = (steps: number) => {
    return Math.floor(steps / 1000);
  };

  // Samsung Health integration
  const requestSamsungHealth = async () => {
    try {
      // Samsung Health API for Samsung devices
      const win = window as any;
      if (win.webapis && win.webapis.HealthService) {
        const healthService = win.webapis.HealthService;
        const stepCounter = healthService.getStepCountData();
        return stepCounter.dailySteps || 0;
      }
    } catch (error) {
      console.log('Samsung Health not available, using fallback');
    }
    return null;
  };

  // Fallback motion detection
  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    if (!isTracking) return;
    
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    const magnitude = Math.sqrt(x! * x! + y! * y! + z! * z!);
    
    // Detect step pattern (threshold lowered for better sensitivity)
    if (magnitude > 8 && magnitude < 20) {
      const currentTime = Date.now();
      const lastMotionTime = motionEventRef.current ? 
        (motionEventRef.current as any).timestamp || currentTime - 500 : currentTime - 500;
      
      // Prevent too frequent step detection (min 300ms between steps)
      if (currentTime - lastMotionTime > 300) {
        incrementSteps();
        motionEventRef.current = event;
      }
    }
  };

  const incrementSteps = () => {
    setStepData(prev => {
      const newSteps = prev.steps + 1;
      const newCoins = calculateCoins(newSteps);
      const newDistance = calculateDistance(newSteps);
      
      // Show coin notification when earning new coin
      if (newCoins > prev.coins) {
        toast({
          title: "🎉 Coin Earned!",
          description: `You've earned ${newCoins - prev.coins} Boltacoin${newCoins - prev.coins > 1 ? 's' : ''}!`,
          duration: 3000,
        });
      }
      
      return {
        steps: newSteps,
        coins: newCoins,
        distance: newDistance
      };
    });
  };

  const requestPermission = async () => {
    try {
      // First try Samsung Health
      const samsungSteps = await requestSamsungHealth();
      if (samsungSteps !== null) {
        setStepData({
          steps: samsungSteps,
          coins: calculateCoins(samsungSteps),
          distance: calculateDistance(samsungSteps)
        });
        setPermissionGranted(true);
        setIsTracking(true);
        return;
      }

      // Fallback to device motion
      if (typeof DeviceMotionEvent !== 'undefined') {
        const DeviceMotionEventAny = DeviceMotionEvent as any;
        if (typeof DeviceMotionEventAny.requestPermission === 'function') {
          const permission = await DeviceMotionEventAny.requestPermission();
          if (permission === 'granted') {
            setPermissionGranted(true);
            setIsTracking(true);
          }
        } else {
          // Android or older browsers - permission not required
          setPermissionGranted(true);
          setIsTracking(true);
        }
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

// In src/hooks/useStepCounter.ts, add this at the top of useEffect:
useEffect(() => {
  // Skip on desktop/non-mobile devices
  if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
    console.log('DeviceMotion not supported, skipping step tracking');
    setStepData({ steps: 1250, coins: 1, distance: 0.88 }); // Demo data
    return;
  }
  requestPermission();
}, []);

  useEffect(() => {
    // Auto-start tracking immediately
    requestPermission();
  }, []);

  useEffect(() => {
    if (isTracking && permissionGranted) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      
      return () => {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      };
    }
  }, [isTracking, permissionGranted]);

  // Sync with Samsung Health every 10 seconds
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(async () => {
      const samsungSteps = await requestSamsungHealth();
      if (samsungSteps !== null && samsungSteps !== lastStepCount.current) {
        lastStepCount.current = samsungSteps;
        setStepData({
          steps: samsungSteps,
          coins: calculateCoins(samsungSteps),
          distance: calculateDistance(samsungSteps)
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isTracking]);

  return {
    stepData,
    isTracking,
    permissionGranted,
    requestPermission
  };
};