import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import emailRoutes from './routes/emailRoutes';
import { healthCheck } from './controllers/emailController';
import { rateLimiter, errorHandler, notFoundHandler } from './middleware';
import { emailService } from './services/emailService';
import { setupSwaggerDocs } from './docs/apiDocs';

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security headers - adjusted for Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://cdn-icons-png.flaticon.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: config.corsOrigins.includes('*') 
    ? '*' 
    : (origin, callback) => {
        if (!origin || config.corsOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '25mb' })); // Support attachments
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Global rate limiting
app.use(rateLimiter);

// Routes
app.get('/health', healthCheck);
app.use('/api/email', emailRoutes);

// Setup Swagger API Documentation
setupSwaggerDocs(app);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Email Microservice API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      docs: 'GET /docs',
      sendEmail: 'POST /api/email/send',
      testAuth: 'GET /api/email/test',
    },
    documentation: 'Visit /docs for interactive API documentation',
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email Microservice');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📬 SMTP Host: ${config.smtp.host}:${config.smtp.port}`);
  console.log(`📨 From: ${config.smtp.from.name} <${config.smtp.from.email}>`);
  console.log(`🔒 CORS Origins: ${config.corsOrigins.join(', ')}`);
  console.log(`⏱️  Rate Limit: ${config.rateLimit.maxRequests} req/${config.rateLimit.windowMs / 1000}s`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Verify SMTP connection on startup
  emailService.verifyConnection().then((connected) => {
    if (connected) {
      console.log('✅ SMTP connection verified');
    } else {
      console.warn('⚠️  SMTP connection could not be verified');
    }
  });
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    await emailService.close();
    console.log('SMTP connections closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
