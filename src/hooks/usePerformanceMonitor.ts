import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

/**
 * Hook to monitor component performance
 * Useful for identifying performance bottlenecks
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - renderStartTime.current;

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current
      });

      // Warn about slow renders
      if (renderTime > 16) { // 60fps = 16.67ms per frame
        console.warn(`[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    }

    // Reset timer for next render
    renderStartTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current
  };
};

/**
 * Hook to measure and log API call performance
 */
export const useApiPerformance = () => {
  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Performance] ${operationName}: ${duration.toFixed(2)}ms`);
        
        if (duration > 1000) {
          console.warn(`[API Warning] ${operationName} took ${duration.toFixed(2)}ms`);
        }
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`[API Error] ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  };

  return { measureApiCall };
};