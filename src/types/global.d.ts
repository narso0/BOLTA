interface DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface Window {
  webapis?: {
    HealthService?: any;
  };
}

// Add any other global type definitions you might need