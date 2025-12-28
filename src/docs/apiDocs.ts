/**
 * API Documentation Setup with Swagger
 */
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { join } from 'path';
import type { Express } from 'express';

// Custom Swagger UI options
const swaggerOptions: swaggerUi.SwaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 30px 0 }
    .swagger-ui .info .title { font-size: 2.5em }
    .swagger-ui .scheme-container { background: #1e293b; padding: 15px; border-radius: 8px; }
  `,
  customSiteTitle: 'Email Microservice API Docs',
  customfavIcon: 'https://cdn-icons-png.flaticon.com/512/561/561127.png',
};

/**
 * Setup Swagger documentation routes
 */
export function setupSwaggerDocs(app: Express): void {
  try {
    // Load OpenAPI spec
    const specPath = join(__dirname, 'openapi.yaml');
    const specFile = readFileSync(specPath, 'utf8');
    const swaggerDocument = parse(specFile);

    // Serve Swagger UI
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

    // Serve raw OpenAPI spec
    app.get('/docs/openapi.yaml', (_req, res) => {
      res.setHeader('Content-Type', 'text/yaml');
      res.send(specFile);
    });

    app.get('/docs/openapi.json', (_req, res) => {
      res.json(swaggerDocument);
    });

    console.log('📚 API Documentation available at /docs');
  } catch (error) {
    console.error('Failed to load OpenAPI spec:', error);
  }
}

/**
 * Get simple HTML docs (fallback)
 */
export function getApiDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Microservice API</title>
  <style>
    body { font-family: system-ui; background: #0f172a; color: #f1f5f9; padding: 2rem; text-align: center; }
    h1 { color: #6366f1; }
    a { color: #a855f7; }
  </style>
</head>
<body>
  <h1>📧 Email Microservice API</h1>
  <p>View the <a href="/docs">API Documentation</a></p>
</body>
</html>`;
}
