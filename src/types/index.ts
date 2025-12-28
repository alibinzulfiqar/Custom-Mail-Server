// Type definitions for the email microservice

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface Attachment {
  filename: string;
  content: string; // Base64 encoded
  contentType?: string;
}

export interface SendEmailRequest {
  to: string | string[] | EmailAddress | EmailAddress[];
  cc?: string | string[] | EmailAddress | EmailAddress[];
  bcc?: string | string[] | EmailAddress | EmailAddress[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
  replyTo?: string | EmailAddress;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

export interface EmailSendResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  smtp: {
    configured: boolean;
    connected?: boolean;
  };
  timestamp: string;
  uptime: number;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    email: string;
    name: string;
  };
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiKey: string;
  corsOrigins: string[];
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  smtp: SMTPConfig;
  maxAttachmentSize: number; // in bytes
}
