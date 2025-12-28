# 📧 Email Microservice

A generic, backend-only email sending service designed for frontend-only websites (React, Vue, static sites, etc.).

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## ✨ Features

- 🚀 **One backend → Many frontends** - Deploy once, use from any frontend
- 🔒 **Secure by default** - API key authentication, rate limiting, CORS
- ⚙️ **Configuration-driven** - All settings via environment variables
- 📧 **Full email support** - To/CC/BCC, HTML, plain text, attachments
- 🐳 **Docker-ready** - Easy deployment with Docker Compose
- 🔌 **Any SMTP provider** - Gmail, SendGrid, Mailgun, Amazon SES, etc.
- 🛡️ **No database required** - Completely stateless
- 📚 **Swagger API Docs** - Interactive API documentation at `/docs`

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Frontend Examples](#-frontend-examples)
- [Deployment](#-deployment)
  - [Railway](#-railway-recommended)
  - [Render](#-render)
  - [Fly.io](#-flyio)
  - [DigitalOcean App Platform](#-digitalocean-app-platform)
  - [Heroku](#-heroku)
  - [AWS (EC2/ECS)](#-aws)
  - [Google Cloud Run](#-google-cloud-run)
  - [Docker](#-docker)
  - [VPS Manual Deployment](#-vps-manual-deployment)
- [Error Codes](#-error-codes)
- [Security](#-security)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Docker
- SMTP credentials from any email provider

### Option 1: Local Development

```bash
# Clone the repository
git clone <repository-url>
cd email-microservice

# Install dependencies
npm install

# Copy environment example and configure
cp .env.example .env
# Edit .env with your SMTP credentials

# Start development server
npm run dev
```

### Option 2: Docker

```bash
# Copy environment example and configure
cp .env.example .env
# Edit .env with your SMTP credentials

# Build and run
docker-compose up -d
```

### Test the Service

```bash
# Health check
curl http://localhost:3000/health

# Test authentication
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/email/test

# Send a test email
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "Hello from Email Microservice!"
  }'
```

### View API Documentation

Visit `http://localhost:3000/docs` for interactive Swagger documentation.

## ⚙️ Configuration

All configuration is done via environment variables. Copy `.env.example` to `.env` and customize:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `API_KEY` | **Yes** | - | API key for authentication (min 16 chars) |
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed origins |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `10` | Max requests per window |
| `SMTP_HOST` | **Yes** | - | SMTP server hostname |
| `SMTP_PORT` | No | `587` | SMTP server port |
| `SMTP_SECURE` | No | `false` | Use SSL (true for port 465) |
| `SMTP_USER` | **Yes** | - | SMTP username |
| `SMTP_PASS` | **Yes** | - | SMTP password |
| `SMTP_FROM_EMAIL` | **Yes** | - | Default sender email |
| `SMTP_FROM_NAME` | No | `Email Service` | Default sender name |
| `MAX_ATTACHMENT_SIZE_MB` | No | `10` | Max attachment size (MB) |

### SMTP Provider Examples

<details>
<summary><strong>Gmail</strong></summary>

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```
> ⚠️ Requires [App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled
</details>

<details>
<summary><strong>SendGrid</strong></summary>

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```
</details>

<details>
<summary><strong>Mailgun</strong></summary>

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```
</details>

<details>
<summary><strong>Amazon SES</strong></summary>

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```
</details>

<details>
<summary><strong>Zoho Mail</strong></summary>

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@zoho.com
SMTP_PASS=your-password
```
</details>

<details>
<summary><strong>Outlook/Office 365</strong></summary>

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```
</details>

---

## 📚 API Documentation

### Interactive Docs

Visit `/docs` on your deployed service for interactive Swagger UI documentation.

### OpenAPI Spec

- **Swagger UI:** `GET /docs`
- **OpenAPI YAML:** `GET /docs/openapi.yaml`
- **OpenAPI JSON:** `GET /docs/openapi.json`

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Health check |
| `GET` | `/docs` | ❌ | API documentation |
| `GET` | `/api/email/test` | ✅ | Test authentication |
| `POST` | `/api/email/send` | ✅ | Send email |

### Authentication

All protected endpoints require an API key via:
- **Header:** `X-API-Key: your-api-key`
- **Header:** `Authorization: Bearer your-api-key`

---

## 🌐 Frontend Examples

### JavaScript (Fetch)

```javascript
const EMAIL_API_URL = 'https://your-email-service.com';
const EMAIL_API_KEY = 'your-api-key';

async function sendEmail(data) {
  const response = await fetch(`${EMAIL_API_URL}/api/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': EMAIL_API_KEY
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}

// Usage
sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello!',
  html: '<h1>Hello World</h1>',
  text: 'Hello World'
}).then(console.log);
```

### React Contact Form

```jsx
import { useState } from 'react';

const API_URL = process.env.REACT_APP_EMAIL_API_URL;
const API_KEY = process.env.REACT_APP_EMAIL_API_KEY;

export function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.target);
    
    try {
      const response = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          to: 'contact@yoursite.com',
          subject: `Contact: ${formData.get('subject')}`,
          replyTo: formData.get('email'),
          html: `
            <h2>New Contact Form</h2>
            <p><strong>Name:</strong> ${formData.get('name')}</p>
            <p><strong>Email:</strong> ${formData.get('email')}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.get('message')}</p>
          `,
          text: `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nMessage: ${formData.get('message')}`
        })
      });

      const result = await response.json();
      setStatus(result.success ? 'success' : 'error');
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Your Name" required />
      <input name="email" type="email" placeholder="Your Email" required />
      <input name="subject" placeholder="Subject" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p>Message sent!</p>}
      {status === 'error' && <p>Failed to send. Try again.</p>}
    </form>
  );
}
```

### Vue.js

```javascript
// composables/useEmail.js
const API_URL = import.meta.env.VITE_EMAIL_API_URL;
const API_KEY = import.meta.env.VITE_EMAIL_API_KEY;

export function useEmail() {
  async function sendEmail(data) {
    const response = await fetch(`${API_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  return { sendEmail };
}
```

### With Attachments

```javascript
// Convert file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
}

// Send email with attachment
async function sendWithAttachment(file) {
  const base64Content = await fileToBase64(file);
  
  await sendEmail({
    to: 'recipient@example.com',
    subject: 'Document Attached',
    text: 'Please see the attached document.',
    attachments: [{
      filename: file.name,
      content: base64Content,
      contentType: file.type
    }]
  });
}
```

---

## 🚢 Deployment

### ⚡ Railway (Recommended)

Railway offers the simplest deployment experience with automatic builds.

#### One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

#### Manual Deploy

1. **Create account** at [railway.app](https://railway.app)

2. **Create new project** → "Deploy from GitHub repo"

3. **Connect your repository**

4. **Add environment variables** in Settings → Variables:
   ```
   API_KEY=your-secure-api-key-min-16-chars
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=My Email Service
   CORS_ORIGINS=https://yourfrontend.com
   NODE_ENV=production
   ```

5. **Deploy** - Railway auto-detects Node.js and runs `npm run build && npm start`

6. **Get your URL** from the Deployments tab (e.g., `https://email-service-production.up.railway.app`)

#### railway.json (Optional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

---

### 🎨 Render

Render provides free tier with automatic SSL.

1. **Create account** at [render.com](https://render.com)

2. **New** → **Web Service** → Connect GitHub repo

3. **Configure:**
   - **Name:** `email-microservice`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   ```
   API_KEY=your-secure-api-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   NODE_ENV=production
   ```

5. **Create Web Service**

#### render.yaml (Blueprint)
```yaml
services:
  - type: web
    name: email-microservice
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: API_KEY
        sync: false
      - key: SMTP_HOST
        sync: false
      - key: SMTP_PORT
        value: "587"
      - key: SMTP_SECURE
        value: "false"
      - key: SMTP_USER
        sync: false
      - key: SMTP_PASS
        sync: false
      - key: SMTP_FROM_EMAIL
        sync: false
      - key: SMTP_FROM_NAME
        value: "Email Service"
```

---

### 🪁 Fly.io

Fly.io offers global edge deployment with generous free tier.

1. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Create fly.toml:**
   ```toml
   app = "email-microservice"
   primary_region = "iad"

   [build]
     builder = "heroku/buildpacks:20"

   [env]
     PORT = "8080"
     NODE_ENV = "production"

   [http_service]
     internal_port = 8080
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0

   [[services]]
     http_checks = []
     internal_port = 8080
     protocol = "tcp"

     [[services.ports]]
       handlers = ["http"]
       port = 80

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443

     [[services.tcp_checks]]
       grace_period = "1s"
       interval = "15s"
       restart_limit = 0
       timeout = "2s"
   ```

4. **Launch app:**
   ```bash
   fly launch
   ```

5. **Set secrets:**
   ```bash
   fly secrets set API_KEY="your-secure-api-key" \
     SMTP_HOST="smtp.gmail.com" \
     SMTP_PORT="587" \
     SMTP_SECURE="false" \
     SMTP_USER="your-email@gmail.com" \
     SMTP_PASS="your-app-password" \
     SMTP_FROM_EMAIL="your-email@gmail.com" \
     SMTP_FROM_NAME="Email Service"
   ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

---

### 🌊 DigitalOcean App Platform

1. **Create account** at [digitalocean.com](https://digitalocean.com)

2. **Apps** → **Create App** → **GitHub**

3. **Configure:**
   - **Source:** Your GitHub repo
   - **Branch:** `main`
   - **Type:** Web Service
   - **Build Command:** `npm install && npm run build`
   - **Run Command:** `npm start`

4. **Add Environment Variables**

5. **Choose plan** and **Create Resources**

#### app.yaml (App Spec)
```yaml
name: email-microservice
services:
  - name: api
    github:
      repo: your-username/email-microservice
      branch: main
    build_command: npm install && npm run build
    run_command: npm start
    http_port: 3000
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /
    health_check:
      http_path: /health
    envs:
      - key: NODE_ENV
        value: "production"
      - key: API_KEY
        type: SECRET
      - key: SMTP_HOST
        type: SECRET
      - key: SMTP_PORT
        value: "587"
      - key: SMTP_USER
        type: SECRET
      - key: SMTP_PASS
        type: SECRET
      - key: SMTP_FROM_EMAIL
        type: SECRET
```

---

### 🟣 Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create email-microservice
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set \
     API_KEY="your-secure-api-key" \
     SMTP_HOST="smtp.gmail.com" \
     SMTP_PORT="587" \
     SMTP_SECURE="false" \
     SMTP_USER="your-email@gmail.com" \
     SMTP_PASS="your-app-password" \
     SMTP_FROM_EMAIL="your-email@gmail.com" \
     SMTP_FROM_NAME="Email Service" \
     NODE_ENV="production"
   ```

5. **Create Procfile:**
   ```
   web: npm start
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

---

### ☁️ AWS

#### Option A: AWS App Runner (Easiest)

1. Go to **AWS App Runner** console
2. **Create service** → **Source code repository**
3. Connect GitHub and select repo
4. Configure build:
   - **Runtime:** Node.js 18
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Port:** `3000`
5. Add environment variables
6. Create & deploy

#### Option B: EC2 with Docker

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Clone and deploy
git clone https://github.com/your-repo/email-microservice.git
cd email-microservice

# Create .env file
cp .env.example .env
nano .env  # Edit with your values

# Run with Docker
docker-compose up -d
```

#### Option C: AWS ECS (Production)

Use the provided `Dockerfile` with ECS Fargate:

1. Push image to **ECR**
2. Create **ECS Cluster**
3. Create **Task Definition** with environment variables
4. Create **Service** with load balancer

---

### 🌤️ Google Cloud Run

1. **Install gcloud CLI** and authenticate

2. **Build and push:**
   ```bash
   # Build
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/email-microservice

   # Deploy
   gcloud run deploy email-microservice \
     --image gcr.io/YOUR_PROJECT_ID/email-microservice \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NODE_ENV=production" \
     --set-secrets="API_KEY=api-key:latest,SMTP_HOST=smtp-host:latest,SMTP_USER=smtp-user:latest,SMTP_PASS=smtp-pass:latest,SMTP_FROM_EMAIL=smtp-from:latest"
   ```

---

### 🐳 Docker

#### Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/your-repo/email-microservice.git
cd email-microservice

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Docker Run

```bash
# Build image
docker build -t email-microservice .

# Run container
docker run -d \
  --name email-service \
  -p 3000:3000 \
  -e API_KEY="your-secure-api-key" \
  -e SMTP_HOST="smtp.gmail.com" \
  -e SMTP_PORT="587" \
  -e SMTP_SECURE="false" \
  -e SMTP_USER="your-email@gmail.com" \
  -e SMTP_PASS="your-app-password" \
  -e SMTP_FROM_EMAIL="your-email@gmail.com" \
  -e NODE_ENV="production" \
  email-microservice
```

---

### 🖥️ VPS Manual Deployment

#### Ubuntu/Debian

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/email-microservice.git
cd email-microservice

# Install dependencies and build
npm ci --only=production
npm run build

# Create .env file
cp .env.example .env
nano .env  # Edit with your values

# Start with PM2
pm2 start dist/index.js --name email-service
pm2 save
pm2 startup
```

#### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## ⚠️ Important Notes

### Why Not Vercel/Netlify?

**Vercel** and **Netlify** are optimized for serverless/edge functions and static sites. This email microservice is a **long-running Node.js server** that:

- Maintains SMTP connection pools
- Requires persistent process for rate limiting
- Uses WebSocket-like connections for SMTP

**Recommended alternatives:**
- ✅ **Railway** - Best DX, automatic deploys
- ✅ **Render** - Free tier available
- ✅ **Fly.io** - Global edge deployment
- ✅ **DigitalOcean** - Affordable, reliable

### Production Checklist

- [ ] Generate strong API key: `openssl rand -hex 32`
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to specific origins (not `*`)
- [ ] Use HTTPS (all platforms above provide free SSL)
- [ ] Set appropriate rate limits
- [ ] Monitor logs for errors
- [ ] Set up health check monitoring

---

## ❌ Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_MISSING` | 401 | API key not provided |
| `AUTH_INVALID` | 401 | Invalid API key |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_EMAIL` | 400 | Invalid email address format |
| `ATTACHMENT_TOO_LARGE` | 400 | Attachment exceeds size limit |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `EMAIL_RATE_LIMIT_EXCEEDED` | 429 | Email sending rate limit |
| `SMTP_CONNECTION_ERROR` | 502 | Cannot connect to SMTP server |
| `SMTP_AUTH_ERROR` | 502 | SMTP authentication failed |
| `SMTP_SEND_ERROR` | 500 | Failed to send email |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

**Error Response Format:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details (if available)"
  }
}
```

---

## 🔒 Security

### Best Practices

1. **Use strong API keys** - Generate with `openssl rand -hex 32`
2. **Restrict CORS origins** - Don't use `*` in production
3. **Use HTTPS** - Always deploy behind SSL/TLS
4. **Monitor rate limits** - Adjust based on your needs
5. **Rotate credentials** - Regularly update SMTP passwords

### Rate Limiting

The service implements two levels of rate limiting:

- **Global:** All endpoints (configurable via `RATE_LIMIT_MAX_REQUESTS`)
- **Email endpoint:** Half the global rate (stricter to prevent abuse)

### Input Sanitization

- Email addresses are validated
- HTML content is sanitized (removes scripts, event handlers)
- Attachment sizes are limited
- Request body size is limited to 25MB

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ for frontend developers<br>
  By <a href="https://www.alibinzulfiqar.live">Ali Bin Zulfiqar</a>
</p>
