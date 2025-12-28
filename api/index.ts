import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from '../src/config';
import emailRoutes from '../src/routes/emailRoutes';
import { healthCheck } from '../src/controllers/emailController';
import { rateLimiter, errorHandler, notFoundHandler } from '../src/middleware';
import { setupSwaggerDocs } from '../src/docs/apiDocs';

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security headers - adjusted for Swagger UI with CDN
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://cdn-icons-png.flaticon.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
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
  maxAge: 86400,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '25mb' }));
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

export default app;
