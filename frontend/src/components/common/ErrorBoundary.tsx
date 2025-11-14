import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Typography, Button, Container, Box, Paper } from '@mui/material';
import { withTranslation, WithTranslation } from 'react-i18next';
import MainStore from 'MainStore';

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in its child component tree.
 * It logs the errors and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log the error to your analytics or logging service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReportError = (): void => {
    // Implement error reporting logic here
    const { error, errorInfo } = this.state;
    
    // You could send this error to your backend API
    // Example: sendErrorToBackend(error, errorInfo);
    
    // Show a success message to the user
    MainStore.setSnackbar(this.props.t('errorReported'), 'success');
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, t } = this.props;

    if (hasError) {
      // You can render a custom fallback UI
      if (fallback) {
        return fallback;
      }

      return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" color="error" gutterBottom>
              {t('message:somethingWentWrong')}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {t('message:errorBoundaryMessage')}
            </Typography>
            
            {error && (
              <Box sx={{ 
                my: 3, 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                overflowX: 'auto'
              }}>
                <Typography variant="body2" component="pre">
                  {error.toString()}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleReset}
              >
                {t('tryAgain')}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => window.location.reload()}
              >
                {t('refreshPage')}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={this.handleReportError}
              >
                {t('reportError')}
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary);