import i18n from 'i18next';

// Error type definitions
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  NOT_FOUND = 'NOT_FOUND',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorDetail {
  code: string;
  message: string;
  params?: string[];
}

export interface StandardizedError {
  type: ErrorType;
  message: string;
  details?: ErrorDetail[];
  originalError?: any;
  status?: number;
}

// Map HTTP status codes to error types
const statusToErrorType = {
  400: ErrorType.VALIDATION,
  401: ErrorType.AUTHENTICATION,
  403: ErrorType.AUTHORIZATION,
  404: ErrorType.NOT_FOUND,
  422: ErrorType.BUSINESS_LOGIC,
  500: ErrorType.SERVER,
  502: ErrorType.SERVER,
  503: ErrorType.SERVER,
  504: ErrorType.SERVER
};

/**
 * Standardizes error objects from various sources into a consistent format
 */
export function standardizeError(error: any): StandardizedError {
  // Default error structure
  const standardError: StandardizedError = {
    type: ErrorType.UNKNOWN,
    message: i18n.t('message:error.unexpectedError', 'An unexpected error occurred'),
    originalError: error
  };

  // Handle Axios errors
  if (error?.response) {
    const status = error.response.status;
    standardError.status = status;
    standardError.type = statusToErrorType[status] || ErrorType.UNKNOWN;

    // Try to extract error message from response
    if (error.response.data) {
      const responseData = error.response.data;

      // Handle error response formats
      if (responseData.errors && Array.isArray(responseData.errors)) {
        // Our standard API error format
        standardError.details = responseData.errors.map(err => parseErrorDetail(err));
        standardError.message = standardError.details[0]?.message || getDefaultMessageForType(standardError.type);
      } else if (responseData.message) {
        // Simple error message format
        standardError.message = responseData.message;
      } else if (typeof responseData === 'string') {
        // Plain string error
        standardError.message = responseData;
      }
    }
  } else if (error?.request) {
    // Network error (no response received)
    standardError.type = ErrorType.NETWORK;
    standardError.message = i18n.t('message:error.networkError', 'Network error. Please check your connection.');
  } else if (error instanceof Error) {
    // JavaScript Error object
    standardError.message = error.message;
  }

  return standardError;
}

/**
 * Parse error detail from API response
 */
function parseErrorDetail(errorItem: any): ErrorDetail {
  if (typeof errorItem === 'string') {
    return {
      code: 'ERROR',
      message: errorItem
    };
  }

  if (errorItem.details && Array.isArray(errorItem.details)) {
    return {
      code: errorItem.details[0]?.code || 'ERROR',
      message: errorItem.details[0]?.message || errorItem.source || 'Unknown error',
      params: errorItem.details[0]?.params
    };
  }

  return {
    code: errorItem.code || 'ERROR',
    message: errorItem.message || errorItem.source || 'Unknown error',
    params: errorItem.params
  };
}

/**
 * Get a user-friendly message based on error type
 */
export function getDefaultMessageForType(type: ErrorType): string {
  switch (type) {
    case ErrorType.VALIDATION:
      return i18n.t('message:error.validationError', 'Please check your input and try again.');
    case ErrorType.AUTHENTICATION:
      return i18n.t('message:error.authenticationError', 'Your session has expired. Please log in again.');
    case ErrorType.AUTHORIZATION:
      return i18n.t('message:error.authorizationError', 'You do not have permission to perform this action.');
    case ErrorType.NOT_FOUND:
      return i18n.t('message:error.notFoundError', 'The requested resource was not found.');
    case ErrorType.BUSINESS_LOGIC:
      return i18n.t('message:error.businessLogicError', 'The operation could not be completed.');
    case ErrorType.SERVER:
      return i18n.t('message:error.serverError', 'Server error. Please try again later.');
    case ErrorType.NETWORK:
      return i18n.t('message:error.networkError', 'Network error. Please check your connection.');
    case ErrorType.UNKNOWN:
    default:
      return i18n.t('message:error.unexpectedError', 'An unexpected error occurred.');
  }
}

/**
 * Get a user-friendly error message from a standardized error
 */
export function getUserFriendlyErrorMessage(error: StandardizedError): string {
  if (error.message) {
    return error.message;
  }
  
  return getDefaultMessageForType(error.type);
}

/**
 * Log error to console in development and to monitoring service in production
 */
export function logError(error: StandardizedError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  } else {
    // Send to error monitoring service (e.g., Sentry)
    // Example: Sentry.captureException(error.originalError || error);
    
    // You can also log to your own backend
    // Example: sendErrorToLoggingService(error, context);
  }
}