# 📧 Email Microservice

A generic, backend-only email sending service designed for frontend-only websites (React, Vue, static sites, etc.).

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🚀 **One backend → Many frontends** - Deploy once, use from any frontend
- 🔒 **Secure by default** - API key authentication, rate limiting, CORS
- ⚙️ **Configuration-driven** - All settings via environment variables
- 📧 **Full email support** - To/CC/BCC, HTML, plain text, attachments
- 🐳 **Docker-ready** - Easy deployment with Docker Compose
- 🔌 **Any SMTP provider** - Gmail, SendGrid, Mailgun, Amazon SES, etc.
- 🛡️ **No database required** - Completely stateless

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Frontend Examples](#-frontend-examples)
- [Deployment](#-deployment)
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

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All protected endpoints require authentication via one of:

- **Header:** `X-API-Key: your-api-key`
- **Header:** `Authorization: Bearer your-api-key`

---

### Endpoints

#### `GET /health`

Health check endpoint (no authentication required).

**Response:**
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "healthy",
    "smtp": {
      "configured": true,
      "connected": true
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600
  }
}
```

---

#### `GET /api/email/test`

Test API authentication.

**Headers:**
```
X-API-Key: your-api-key
```

**Response:**
```json
{
  "success": true,
  "message": "Email API is working. Authentication successful."
}
```

---

#### `POST /api/email/send`

Send an email.

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | string \| string[] \| EmailAddress \| EmailAddress[] | **Yes** | Recipient(s) |
| `cc` | string \| string[] \| EmailAddress \| EmailAddress[] | No | CC recipient(s) |
| `bcc` | string \| string[] \| EmailAddress \| EmailAddress[] | No | BCC recipient(s) |
| `subject` | string | **Yes** | Email subject |
| `text` | string | **Yes*** | Plain text body |
| `html` | string | **Yes*** | HTML body |
| `replyTo` | string \| EmailAddress | No | Reply-to address |
| `attachments` | Attachment[] | No | File attachments |

> *Either `text` or `html` is required

**EmailAddress Object:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Attachment Object:**
```json
{
  "filename": "document.pdf",
  "content": "base64-encoded-content",
  "contentType": "application/pdf"
}
```

**Example Request:**
```json
{
  "to": [
    "user1@example.com",
    { "email": "user2@example.com", "name": "Jane Doe" }
  ],
  "cc": "manager@example.com",
  "subject": "Monthly Report",
  "html": "<h1>Report</h1><p>Please find the attached report.</p>",
  "text": "Report\n\nPlease find the attached report.",
  "replyTo": "support@example.com",
  "attachments": [
    {
      "filename": "report.pdf",
      "content": "JVBERi0xLjQKJeLjz9MKMyAwIG9...",
      "contentType": "application/pdf"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "<abc123@smtp.example.com>",
    "accepted": ["user1@example.com", "user2@example.com"],
    "rejected": []
  }
}
```

---

## 🌐 Frontend Examples

### JavaScript (Fetch)

```javascript
async function sendEmail(data) {
  const response = await fetch('https://your-api.com/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your-api-key'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}

// Usage
sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello!',
  html: '<h1>Hello World</h1>'
}).then(result => console.log(result));
```

### React (with axios)

```jsx
import axios from 'axios';

const emailApi = axios.create({
  baseURL: 'https://your-api.com',
  headers: {
    'X-API-Key': process.env.REACT_APP_EMAIL_API_KEY
  }
});

export async function sendContactForm(name, email, message) {
  const response = await emailApi.post('/api/email/send', {
    to: 'contact@yoursite.com',
    subject: `Contact Form: ${name}`,
    replyTo: email,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  });
  
  return response.data;
}
```

### Vue.js

```javascript
// emailService.js
const API_URL = import.meta.env.VITE_EMAIL_API_URL;
const API_KEY = import.meta.env.VITE_EMAIL_API_KEY;

export async function sendEmail(emailData) {
  const response = await fetch(`${API_URL}/api/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send email');
  }

  return response.json();
}
```

### Sending Attachments

```javascript
// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
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

## 🚢 Deployment

### Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Manual Deployment

```bash
# Install dependencies
npm ci --only=production

# Build
npm run build

# Start
NODE_ENV=production node dist/index.js
```

### Behind Reverse Proxy (nginx)

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    location /email/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## ❌ Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_MISSING` | 401 | API key not provided |
| `AUTH_INVALID` | 401 | Invalid API key |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_EMAIL` | 400 | Invalid email address format |
| `MISSING_BODY_CONTENT` | 400 | Neither text nor HTML body provided |
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

## 🔒 Security

### Best Practices

1. **Use strong API keys** - Generate with `openssl rand -hex 32`
2. **Restrict CORS origins** - Don't use `*` in production
3. **Use HTTPS** - Always deploy behind SSL/TLS
4. **Monitor rate limits** - Adjust based on your needs
5. **Rotate credentials** - Regularly update SMTP passwords

### Rate Limiting

The service implements two levels of rate limiting:

- **Global:** All endpoints (configurable)
- **Email endpoint:** Half the global rate (stricter)

### Input Sanitization

- Email addresses are validated
- HTML content is sanitized (removes scripts, event handlers)
- Attachment sizes are limited
- Request body size is limited to 25MB

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ for frontend developers By [Ali Bin Zulfiqar](https://alibinzulfiqar.live)
</p>
