import React, { FC } from 'react';
import { Alert, AlertTitle, Box, Typography, Paper, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StandardizedError, ErrorType } from 'utils/error-utils';

interface ErrorDisplayProps {
  error: StandardizedError;
  showDetails?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  inline?: boolean;
  variant?: 'standard' | 'compact' | 'expanded';
}

/**
 * A component for displaying user-friendly error messages
 */
const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  showDetails = false,
  onRetry,
  onDismiss,
  inline = false,
  variant = 'standard'
}) => {
  const { t } = useTranslation();
  
  // Map error types to severity for the Alert component
  const getAlertSeverity = (type: ErrorType) => {
    switch (type) {
      case ErrorType.VALIDATION:
        return 'warning';
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return 'error';
      case ErrorType.NOT_FOUND:
        return 'info';
      case ErrorType.BUSINESS_LOGIC:
        return 'warning';
      case ErrorType.SERVER:
      case ErrorType.NETWORK:
      case ErrorType.UNKNOWN:
      default:
        return 'error';
    }
  };
  
  // Get error icon based on type
  const getErrorIcon = (type: ErrorType) => {
    // You could return custom icons here if needed
    return undefined; // Let Alert use default icons
  };
  
  // Get title based on error type
  const getErrorTitle = (type: ErrorType) => {
    switch (type) {
      case ErrorType.VALIDATION:
        return t('message:errorTypes.validation');
      case ErrorType.AUTHENTICATION:
        return t('message:errorTypes.authentication');
      case ErrorType.AUTHORIZATION:
        return t('message:errorTypes.authorization');
      case ErrorType.NOT_FOUND:
        return t('message:errorTypes.notFound');
      case ErrorType.BUSINESS_LOGIC:
        return t('message:errorTypes.businessLogic');
      case ErrorType.SERVER:
        return t('message:errorTypes.server');
      case ErrorType.NETWORK:
        return t('message:errorTypes.network');
      case ErrorType.UNKNOWN:
      default:
        return t('message:errorTypes.unknown');
    }
  };
  
  if (variant === 'compact') {
    return (
      <Alert 
        severity={getAlertSeverity(error.type)}
        icon={getErrorIcon(error.type)}
        onClose={onDismiss}
        sx={{ width: inline ? 'auto' : '100%' }}
      >
        {error.message}
      </Alert>
    );
  }
  
  if (variant === 'expanded') {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          width: inline ? 'auto' : '100%',
          backgroundColor: theme => 
            theme.palette[getAlertSeverity(error.type)].light
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {getErrorTitle(error.type)}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {error.message}
        </Typography>
        
        {showDetails && error.details && error.details.length > 0 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('errorDetails')}:
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                pl: 2,
                listStyleType: 'disc'
              }}
            >
              {error.details.map((detail, index) => (
                <Typography 
                  component="li" 
                  variant="body2" 
                  key={`error-detail-${index}`}
                >
                  {detail.message}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
        
        {(onRetry || onDismiss) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            {onRetry && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={onRetry}
                size="small"
              >
                {t('retry')}
              </Button>
            )}
            
            {onDismiss && (
              <Button 
                variant="outlined" 
                onClick={onDismiss}
                size="small"
              >
                {t('dismiss')}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    );
  }
  
  // Default 'standard' variant
  return (
    <Alert 
      severity={getAlertSeverity(error.type)}
      icon={getErrorIcon(error.type)}
      onClose={onDismiss}
      sx={{ width: inline ? 'auto' : '100%' }}
    >
      <AlertTitle>{getErrorTitle(error.type)}</AlertTitle>
      {error.message}
      
      {showDetails && error.details && error.details.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Box 
            component="ul" 
            sx={{ 
              pl: 2,
              listStyleType: 'disc'
            }}
          >
            {error.details.map((detail, index) => (
              <Typography 
                component="li" 
                variant="body2" 
                key={`error-detail-${index}`}
              >
                {detail.message}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
      
      {onRetry && (
        <Box sx={{ mt: 1 }}>
          <Button 
            size="small"
            onClick={onRetry}
            color={getAlertSeverity(error.type)}
            variant="outlined"
          >
            {t('retry')}
          </Button>
        </Box>
      )}
    </Alert>
  );
};

export default ErrorDisplay;