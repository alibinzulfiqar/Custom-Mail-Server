import rateLimit from 'express-rate-limit';
import config from '../config';
import type { ApiResponse } from '../types';

/**
 * Rate Limiter Middleware
 * 
 * Prevents abuse by limiting requests per IP address
 */
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      details: `You have exceeded the ${config.rateLimit.maxRequests} requests in ${config.rateLimit.windowMs / 1000} seconds limit.`,
    },
  } as ApiResponse,
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use X-Forwarded-For if behind a proxy, otherwise use IP
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/health';
  },
});

/**
 * Stricter rate limiter for email sending endpoint
 * More restrictive to prevent email abuse
 */
export const emailRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: Math.max(1, Math.floor(config.rateLimit.maxRequests / 2)), // Half the normal rate
  message: {
    success: false,
    message: 'Email rate limit exceeded',
    error: {
      code: 'EMAIL_RATE_LIMIT_EXCEEDED',
      details: 'You are sending emails too frequently. Please wait before trying again.',
    },
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});
