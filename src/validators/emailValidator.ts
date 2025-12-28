import { z } from 'zod';
import config from '../config';

/**
 * Email address validation regex
 * More permissive than strict RFC 5322 but catches most invalid emails
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a single email address
 */
const emailString = z.string().regex(emailRegex, 'Invalid email address format');

/**
 * Email address schema (string or object with email/name)
 */
const emailAddress = z.union([
  emailString,
  z.object({
    email: emailString,
    name: z.string().max(100).optional(),
  }),
]);

/**
 * Recipients schema (single or array)
 */
const recipients = z.union([
  emailAddress,
  z.array(emailAddress).min(1).max(50),
]);

/**
 * Attachment schema with size validation
 */
const attachment = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long')
    .regex(/^[^<>:"/\\|?*]+$/, 'Filename contains invalid characters'),
  content: z
    .string()
    .min(1, 'Attachment content is required')
    .refine(
      (val) => {
        // Check if it's valid base64
        try {
          const decoded = Buffer.from(val, 'base64');
          return decoded.length <= config.maxAttachmentSize;
        } catch {
          return false;
        }
      },
      {
        message: `Attachment must be valid base64 and not exceed ${config.maxAttachmentSize / 1024 / 1024}MB`,
      }
    ),
  contentType: z.string().max(100).optional(),
});

/**
 * Send email request validation schema
 */
export const sendEmailSchema = z
  .object({
    to: recipients,
    cc: recipients.optional(),
    bcc: recipients.optional(),
    subject: z
      .string()
      .min(1, 'Subject is required')
      .max(998, 'Subject is too long'), // RFC 5322 line limit
    text: z.string().max(1000000).optional(), // ~1MB text limit
    html: z.string().max(2000000).optional(), // ~2MB HTML limit
    attachments: z.array(attachment).max(10).optional(),
    replyTo: emailAddress.optional(),
  })
  .refine(
    (data) => data.text || data.html,
    {
      message: 'Either text or html body is required',
      path: ['text'],
    }
  );

/**
 * Sanitize HTML content (basic XSS prevention for email)
 * Note: Email clients have their own sanitization, but this adds a layer
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  
  // Remove data: URLs (can be used for XSS)
  sanitized = sanitized.replace(/data\s*:/gi, '');

  return sanitized;
}

/**
 * Validate request body against schema
 */
export function validateSendEmailRequest(body: unknown) {
  return sendEmailSchema.parse(body);
}

export type ValidatedSendEmailRequest = z.infer<typeof sendEmailSchema>;
