export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class ExternalAPIError extends AppError {
  constructor(service: string, originalError: any) {
    super(
      `External API error from ${service}`,
      'EXTERNAL_API_ERROR',
      502,
      { service, originalError }
    );
    this.name = 'ExternalAPIError';
  }
}

// Error handler for API routes
export function handleAPIError(error: unknown): {
  status: number;
  body: { error: string; code: string; details?: any };
} {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        error: error.message,
        code: error.code,
        details: error.details
      }
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    };
  }

  return {
    status: 500,
    body: {
      error: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR'
    }
  };
}

// Async error wrapper for API routes
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      const { status, body } = handleAPIError(error);
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }) as T;
}

// Retry logic for external APIs
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = (error) => true
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError;
} 