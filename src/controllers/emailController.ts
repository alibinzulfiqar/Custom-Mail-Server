import type { Request, Response, NextFunction } from 'express';
import { emailService } from '../services/emailService';
import { validateSendEmailRequest, sanitizeHtml } from '../validators/emailValidator';
import type { ApiResponse, EmailSendResult, HealthCheckResult, SendEmailRequest } from '../types';

/**
 * POST /api/email/send
 * Send an email
 */
export async function sendEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = validateSendEmailRequest(req.body);

    // Sanitize HTML if present
    const emailRequest = {
      ...validatedData,
      html: validatedData.html ? sanitizeHtml(validatedData.html) : undefined,
    } as SendEmailRequest;

    // Send email
    const result = await emailService.sendEmail(emailRequest);

    const response: ApiResponse<EmailSendResult> = {
      success: true,
      message: 'Email sent successfully',
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /health
 * Health check endpoint
 */
export async function healthCheck(
  _req: Request,
  res: Response
): Promise<void> {
  const smtpConnected = await emailService.verifyConnection();

  const health: HealthCheckResult = {
    status: smtpConnected ? 'healthy' : 'unhealthy',
    smtp: {
      configured: true,
      connected: smtpConnected,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  const statusCode = smtpConnected ? 200 : 503;

  const response: ApiResponse<HealthCheckResult> = {
    success: smtpConnected,
    message: smtpConnected ? 'Service is healthy' : 'Service is degraded',
    data: health,
  };

  res.status(statusCode).json(response);
}

/**
 * GET /api/email/test
 * Test endpoint to verify API is working (no email sent)
 */
export function testEndpoint(
  _req: Request,
  res: Response
): void {
  const response: ApiResponse = {
    success: true,
    message: 'Email API is working. Authentication successful.',
  };

  res.status(200).json(response);
}
