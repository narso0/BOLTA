import { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { checkFirebaseConnection } from './lib/firebase';
import { User } from './types';

// Lazy load components for better performance
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Create query client with error handling
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Global loading component
const GlobalLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Loading Bolta</h2>
        <p className="text-sm text-muted-foreground">Preparing your fitness journey...</p>
      </div>
    </div>
  </div>
);

// Connection error component
const ConnectionError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center space-y-6 max-w-md">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Connection Error</h1>
        <p className="text-muted-foreground">
          Unable to connect to our services. Please check your internet connection and try again.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Route wrapper with authentication check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, this would check authentication state
  // For now, we'll just pass through
  return <>{children}</>;
};

// Main App component
const App = () => {
  const [queryClient] = useState(() => createQueryClient());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check Firebase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkFirebaseConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  // Handle retry connection
  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      const connected = await checkFirebaseConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Retry connection failed:', error);
      setIsConnected(false);
    } finally {
      setIsRetrying(false);
    }
  };

  // Show loading while checking connection
  if (isConnected === null) {
    return <GlobalLoader />;
  }

  // Show connection error if Firebase is not accessible
  if (!isConnected) {
    return <ConnectionError onRetry={handleRetryConnection} />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Suspense fallback={<GlobalLoader />}>
                <Routes>
                  {/* Main application route */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Future routes can be added here */}
                  {/* 
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/marketplace" 
                    element={
                      <ProtectedRoute>
                        <MarketplacePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/achievements" 
                    element={
                      <ProtectedRoute>
                        <AchievementsPage />
                      </ProtectedRoute>
                    } 
                  />
                  */}
                  
                  {/* Redirect old routes */}
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  
                  {/* 404 fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
          
          {/* Global notifications */}
          <Toaster />
          <Sonner 
            position="top-right"
            closeButton
            richColors
            expand={false}
            visibleToasts={4}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;