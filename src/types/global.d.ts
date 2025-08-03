interface DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
  acceleration?: DeviceAcceleration | null;
  accelerationIncludingGravity?: DeviceAcceleration | null;
  rotationRate?: DeviceRotationRate | null;
  interval?: number;
}

interface DeviceAcceleration {
  x: number | null;
  y: number | null;
  z: number | null;
}

interface DeviceRotationRate {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface Window {
  webapis?: {
    HealthService?: any;
  };
  DeviceMotionEvent?: {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
}

// Add any other global type definitions you might need