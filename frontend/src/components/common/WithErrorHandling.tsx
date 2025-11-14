import React, { ComponentType, useState } from 'react';
import { StandardizedError } from 'utils/error-utils';
import ErrorDisplay from 'components/ErrorDisplay';

interface WithErrorHandlingProps {
  error?: StandardizedError | null;
  setError: (error: StandardizedError | null) => void;
  clearError: () => void;
}

/**
 * Higher-order component that adds error handling capabilities to components
 * @param WrappedComponent - The component to enhance with error handling
 * @param options - Configuration options
 */
export const withErrorHandling = <P extends object>(
  WrappedComponent: ComponentType<P & WithErrorHandlingProps>,
  options: {
    showDetailsByDefault?: boolean;
    errorVariant?: 'standard' | 'compact' | 'expanded';
    displayInline?: boolean;
  } = {}
) => {
  // Default options
  const {
    showDetailsByDefault = false,
    errorVariant = 'standard',
    displayInline = false
  } = options;
  
  // Create the enhanced component
  const WithErrorHandling = (props: Omit<P, keyof WithErrorHandlingProps>) => {
    const [error, setError] = useState<StandardizedError | null>(null);
    
    // Function to clear the error
    const clearError = () => setError(null);
    
    // Handle retry action
    const handleRetry = () => {
      clearError();
      // Additional retry logic can be added here
    };
    
    // Create the props for the wrapped component
    const enhancedProps = {
      ...props as P,
      error,
      setError,
      clearError
    };
    
    return (
      <>
        {error && (
          <ErrorDisplay
            error={error}
            showDetails={showDetailsByDefault}
            onRetry={handleRetry}
            onDismiss={clearError}
            inline={displayInline}
            variant={errorVariant}
          />
        )}
        <WrappedComponent {...enhancedProps} />
      </>
    );
  };
  
  // For better debugging
  WithErrorHandling.displayName = `WithErrorHandling(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;
  
  return WithErrorHandling;
};

export default withErrorHandling;