/**
 * API Documentation HTML Generator
 */
export function getApiDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Microservice API Documentation</title>
  <style>
    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --bg: #0f172a;
      --bg-card: #1e293b;
      --bg-code: #334155;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --border: #334155;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 3rem;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary), #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    header p {
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 0.5rem;
    }
    
    .badge-get { background: var(--success); color: white; }
    .badge-post { background: var(--primary); color: white; }
    .badge-public { background: var(--bg-code); color: var(--text-muted); }
    .badge-private { background: var(--warning); color: black; }
    
    .section {
      margin-bottom: 3rem;
    }
    
    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary);
      display: inline-block;
    }
    
    .card {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border);
    }
    
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .endpoint-path {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 1.1rem;
      color: var(--primary);
    }
    
    .endpoint-desc {
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    
    pre {
      background: var(--bg-code);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
      margin: 1rem 0;
    }
    
    code {
      font-family: 'Monaco', 'Menlo', monospace;
      background: var(--bg-code);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    
    th, td {
      text-align: left;
      padding: 0.75rem;
      border-bottom: 1px solid var(--border);
    }
    
    th {
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
    }
    
    .required {
      color: var(--error);
      font-weight: bold;
    }
    
    .type {
      color: var(--primary);
      font-family: monospace;
    }
    
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    
    .tab {
      padding: 0.5rem 1rem;
      cursor: pointer;
      color: var(--text-muted);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    
    .tab:hover, .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .error-code {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: var(--bg-code);
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }
    
    .error-code code {
      min-width: 200px;
    }
    
    .status-code {
      font-weight: bold;
      min-width: 40px;
    }
    
    .status-2xx { color: var(--success); }
    .status-4xx { color: var(--warning); }
    .status-5xx { color: var(--error); }
    
    footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      margin-top: 3rem;
    }
    
    .copy-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s;
    }
    
    .copy-btn:hover {
      background: var(--primary-dark);
    }
    
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      header h1 { font-size: 1.75rem; }
      .endpoint-header { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📧 Email Microservice API</h1>
      <p>A generic, backend-only email sending service for frontend applications</p>
    </header>
    
    <div class="section">
      <h2>🔐 Authentication</h2>
      <div class="card">
        <p>All protected endpoints require an API key. Include it in your request using one of these methods:</p>
        <table>
          <tr>
            <th>Method</th>
            <th>Header</th>
            <th>Example</th>
          </tr>
          <tr>
            <td>API Key Header</td>
            <td><code>X-API-Key</code></td>
            <td><code>X-API-Key: your-api-key</code></td>
          </tr>
          <tr>
            <td>Bearer Token</td>
            <td><code>Authorization</code></td>
            <td><code>Authorization: Bearer your-api-key</code></td>
          </tr>
        </table>
      </div>
    </div>
    
    <div class="section">
      <h2>📡 Endpoints</h2>
      
      <!-- Health Check -->
      <div class="card">
        <div class="endpoint-header">
          <span class="badge badge-get">GET</span>
          <span class="badge badge-public">Public</span>
          <span class="endpoint-path">/health</span>
        </div>
        <p class="endpoint-desc">Check service health and SMTP connection status.</p>
        
        <h4>Response</h4>
        <pre>{
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
}</pre>
      </div>
      
      <!-- Test Auth -->
      <div class="card">
        <div class="endpoint-header">
          <span class="badge badge-get">GET</span>
          <span class="badge badge-private">Protected</span>
          <span class="endpoint-path">/api/email/test</span>
        </div>
        <p class="endpoint-desc">Test API key authentication without sending an email.</p>
        
        <h4>Response</h4>
        <pre>{
  "success": true,
  "message": "Email API is working. Authentication successful."
}</pre>
      </div>
      
      <!-- Send Email -->
      <div class="card">
        <div class="endpoint-header">
          <span class="badge badge-post">POST</span>
          <span class="badge badge-private">Protected</span>
          <span class="endpoint-path">/api/email/send</span>
        </div>
        <p class="endpoint-desc">Send an email with optional attachments.</p>
        
        <h4>Request Body</h4>
        <table>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><code>to</code></td>
            <td class="type">string | string[] | EmailAddress | EmailAddress[]</td>
            <td class="required">Yes</td>
            <td>Recipient email address(es)</td>
          </tr>
          <tr>
            <td><code>cc</code></td>
            <td class="type">string | string[] | EmailAddress | EmailAddress[]</td>
            <td>No</td>
            <td>CC recipient(s)</td>
          </tr>
          <tr>
            <td><code>bcc</code></td>
            <td class="type">string | string[] | EmailAddress | EmailAddress[]</td>
            <td>No</td>
            <td>BCC recipient(s)</td>
          </tr>
          <tr>
            <td><code>subject</code></td>
            <td class="type">string</td>
            <td class="required">Yes</td>
            <td>Email subject line</td>
          </tr>
          <tr>
            <td><code>text</code></td>
            <td class="type">string</td>
            <td>*</td>
            <td>Plain text body</td>
          </tr>
          <tr>
            <td><code>html</code></td>
            <td class="type">string</td>
            <td>*</td>
            <td>HTML body</td>
          </tr>
          <tr>
            <td><code>replyTo</code></td>
            <td class="type">string | EmailAddress</td>
            <td>No</td>
            <td>Reply-to address</td>
          </tr>
          <tr>
            <td><code>attachments</code></td>
            <td class="type">Attachment[]</td>
            <td>No</td>
            <td>File attachments (base64)</td>
          </tr>
        </table>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">* Either <code>text</code> or <code>html</code> is required</p>
        
        <h4 style="margin-top: 1.5rem;">Type Definitions</h4>
        <pre>// EmailAddress
{
  "email": "user@example.com",
  "name": "John Doe"  // optional
}

// Attachment
{
  "filename": "document.pdf",
  "content": "base64-encoded-content",
  "contentType": "application/pdf"  // optional
}</pre>
        
        <h4 style="margin-top: 1.5rem;">Example Request</h4>
        <pre>{
  "to": [
    "user1@example.com",
    { "email": "user2@example.com", "name": "Jane Doe" }
  ],
  "cc": "manager@example.com",
  "subject": "Monthly Report",
  "html": "&lt;h1&gt;Report&lt;/h1&gt;&lt;p&gt;Please find the attached report.&lt;/p&gt;",
  "text": "Report\\n\\nPlease find the attached report.",
  "replyTo": "support@example.com",
  "attachments": [
    {
      "filename": "report.pdf",
      "content": "JVBERi0xLjQKJeLjz9M...",
      "contentType": "application/pdf"
    }
  ]
}</pre>
        
        <h4 style="margin-top: 1.5rem;">Success Response</h4>
        <pre>{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "&lt;abc123@smtp.example.com&gt;",
    "accepted": ["user1@example.com", "user2@example.com"],
    "rejected": []
  }
}</pre>
      </div>
    </div>
    
    <div class="section">
      <h2>💻 Code Examples</h2>
      <div class="card">
        <div class="tabs">
          <div class="tab active" onclick="showTab('js')">JavaScript</div>
          <div class="tab" onclick="showTab('curl')">cURL</div>
          <div class="tab" onclick="showTab('python')">Python</div>
        </div>
        
        <div id="tab-js" class="tab-content active">
          <pre>// Using fetch
async function sendEmail(data) {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your-api-key'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}

// Send email
sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello!',
  html: '&lt;h1&gt;Hello World&lt;/h1&gt;'
}).then(console.log);</pre>
        </div>
        
        <div id="tab-curl" class="tab-content">
          <pre>curl -X POST http://localhost:3000/api/email/send \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "Hello from the API!",
    "html": "&lt;h1&gt;Hello&lt;/h1&gt;&lt;p&gt;From the API!&lt;/p&gt;"
  }'</pre>
        </div>
        
        <div id="tab-python" class="tab-content">
          <pre>import requests

response = requests.post(
    'http://localhost:3000/api/email/send',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key'
    },
    json={
        'to': 'recipient@example.com',
        'subject': 'Test Email',
        'text': 'Hello from Python!',
        'html': '&lt;h1&gt;Hello&lt;/h1&gt;&lt;p&gt;From Python!&lt;/p&gt;'
    }
)

print(response.json())</pre>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>❌ Error Codes</h2>
      <div class="card">
        <div class="error-code">
          <span class="status-code status-4xx">401</span>
          <code>AUTH_MISSING</code>
          <span>API key not provided</span>
        </div>
        <div class="error-code">
          <span class="status-code status-4xx">401</span>
          <code>AUTH_INVALID</code>
          <span>Invalid API key</span>
        </div>
        <div class="error-code">
          <span class="status-code status-4xx">400</span>
          <code>VALIDATION_ERROR</code>
          <span>Request validation failed</span>
        </div>
        <div class="error-code">
          <span class="status-code status-4xx">400</span>
          <code>INVALID_EMAIL</code>
          <span>Invalid email address format</span>
        </div>
        <div class="error-code">
          <span class="status-code status-4xx">400</span>
          <code>ATTACHMENT_TOO_LARGE</code>
          <span>Attachment exceeds size limit</span>
        </div>
        <div class="error-code">
          <span class="status-code status-4xx">429</span>
          <code>RATE_LIMIT_EXCEEDED</code>
          <span>Too many requests</span>
        </div>
        <div class="error-code">
          <span class="status-code status-5xx">502</span>
          <code>SMTP_CONNECTION_ERROR</code>
          <span>Cannot connect to SMTP server</span>
        </div>
        <div class="error-code">
          <span class="status-code status-5xx">502</span>
          <code>SMTP_AUTH_ERROR</code>
          <span>SMTP authentication failed</span>
        </div>
        <div class="error-code">
          <span class="status-code status-5xx">500</span>
          <code>SMTP_SEND_ERROR</code>
          <span>Failed to send email</span>
        </div>
        
        <h4 style="margin-top: 1.5rem;">Error Response Format</h4>
        <pre>{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details (if available)"
  }
}</pre>
      </div>
    </div>
    
    <footer>
      <p>📧 Email Microservice • Made with ❤️ for frontend developers</p>
    </footer>
  </div>
  
  <script>
    function showTab(tabId) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
      
      // Show selected tab
      document.getElementById('tab-' + tabId).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>`;
}
