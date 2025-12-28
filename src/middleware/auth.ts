import type { Request, Response, NextFunction } from 'express';
import config from '../config';
import type { ApiResponse } from '../types';

/**
 * API Key Authentication Middleware
 * 
 * Validates the API key from the Authorization header or X-API-Key header
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const apiKey = extractApiKey(req);

  if (!apiKey) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication required',
      error: {
        code: 'AUTH_MISSING',
        details: 'API key is required. Provide it via Authorization header (Bearer token) or X-API-Key header.',
      },
    };
    res.status(401).json(response);
    return;
  }

  // Constant-time comparison to prevent timing attacks
  if (!secureCompare(apiKey, config.apiKey)) {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid API key',
      error: {
        code: 'AUTH_INVALID',
        details: 'The provided API key is invalid.',
      },
    };
    res.status(401).json(response);
    return;
  }

  next();
}

/**
 * Extract API key from request headers
 */
function extractApiKey(req: Request): string | null {
  // Check X-API-Key header first
  const xApiKey = req.headers['x-api-key'];
  if (typeof xApiKey === 'string' && xApiKey.length > 0) {
    return xApiKey;
  }

  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string') {
    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token;
    }
  }

  return null;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
