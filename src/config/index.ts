import { z } from 'zod';
import type { AppConfig } from '../types';

// Environment variable schema with validation
const envSchema = z.object({
  // Server
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Authentication
  API_KEY: z.string().min(16, 'API_KEY must be at least 16 characters'),

  // CORS
  CORS_ORIGINS: z.string().default('*'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform(Number), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z.string().default('10').transform(Number),

  // SMTP Configuration
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_SECURE: z.string().default('false').transform((v) => v === 'true'),
  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),

  // Sender defaults
  SMTP_FROM_EMAIL: z.string().email('SMTP_FROM_EMAIL must be a valid email'),
  SMTP_FROM_NAME: z.string().default('Email Service'),

  // Limits
  MAX_ATTACHMENT_SIZE_MB: z.string().default('10').transform(Number),
});

function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment configuration:');
    parsed.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  const env = parsed.data;

  // Parse CORS origins
  const corsOrigins = env.CORS_ORIGINS === '*' 
    ? ['*'] 
    : env.CORS_ORIGINS.split(',').map((origin) => origin.trim());

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    apiKey: env.API_KEY,
    corsOrigins,
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      from: {
        email: env.SMTP_FROM_EMAIL,
        name: env.SMTP_FROM_NAME,
      },
    },
    maxAttachmentSize: env.MAX_ATTACHMENT_SIZE_MB * 1024 * 1024, // Convert to bytes
  };
}

export const config = loadConfig();
export default config;
