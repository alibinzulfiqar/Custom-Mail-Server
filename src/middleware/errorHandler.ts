import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiResponse } from '../types';
import config from '../config';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error codes reference
 */
export const ErrorCodes = {
  // Authentication errors (401)
  AUTH_MISSING: 'AUTH_MISSING',
  AUTH_INVALID: 'AUTH_INVALID',

  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL: 'INVALID_EMAIL',
  MISSING_BODY_CONTENT: 'MISSING_BODY_CONTENT',
  ATTACHMENT_TOO_LARGE: 'ATTACHMENT_TOO_LARGE',
  INVALID_ATTACHMENT: 'INVALID_ATTACHMENT',

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EMAIL_RATE_LIMIT_EXCEEDED: 'EMAIL_RATE_LIMIT_EXCEEDED',

  // SMTP errors (500/502)
  SMTP_CONNECTION_ERROR: 'SMTP_CONNECTION_ERROR',
  SMTP_AUTH_ERROR: 'SMTP_AUTH_ERROR',
  SMTP_SEND_ERROR: 'SMTP_SEND_ERROR',

  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        details: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
      },
    };
    res.status(400).json(response);
    return;
  }

  // Handle custom application errors
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      error: {
        code: err.code,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid JSON in request body',
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        details: 'The request body contains invalid JSON.',
      },
    };
    res.status(400).json(response);
    return;
  }

  // Handle all other errors
  const response: ApiResponse = {
    success: false,
    message: config.nodeEnv === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      details: config.nodeEnv === 'production' 
        ? undefined 
        : err.stack,
    },
  };
  res.status(500).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiResponse = {
    success: false,
    message: 'Endpoint not found',
    error: {
      code: 'NOT_FOUND',
      details: `The endpoint ${req.method} ${req.path} does not exist.`,
    },
  };
  res.status(404).json(response);
}
