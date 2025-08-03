import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Set initial value
    checkIsMobile();
    
    // Listen for changes
    mediaQuery.addEventListener("change", checkIsMobile);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", checkIsMobile);
    };
  }, []);

  return isMobile;
}

export { useMobile };
export default useMobile;