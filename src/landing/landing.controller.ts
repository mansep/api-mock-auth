import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class LandingController {
  @Get()
  @Header('Content-Type', 'text/html')
  getLanding(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock API Server</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e0e0e0;
            min-height: 100vh;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Hero Section */
        .hero {
            text-align: center;
            padding: 80px 20px 60px;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: #a0a0a0;
            max-width: 600px;
            margin: 0 auto 40px;
        }
        
        .btn-group {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #00d9ff, #00ff88);
            color: #1a1a2e;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 40px rgba(0, 217, 255, 0.3);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        /* Features Section */
        .features {
            padding: 60px 20px;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 50px;
            color: #fff;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px;
            transition: all 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(0, 217, 255, 0.3);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .feature-card h3 {
            font-size: 1.25rem;
            color: #fff;
            margin-bottom: 10px;
        }
        
        .feature-card p {
            color: #a0a0a0;
            font-size: 0.95rem;
        }
        
        /* Endpoints Section */
        .endpoints {
            padding: 60px 20px;
            background: rgba(0, 0, 0, 0.2);
        }
        
        .endpoints h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 50px;
            color: #fff;
        }
        
        .endpoint-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        
        .endpoint-group {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 25px;
        }
        
        .endpoint-group h3 {
            color: #00d9ff;
            font-size: 1.1rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .endpoint {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .endpoint:last-child {
            border-bottom: none;
        }
        
        .method {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            min-width: 55px;
            text-align: center;
        }
        
        .method.get { background: #10b981; color: #fff; }
        .method.post { background: #f59e0b; color: #fff; }
        .method.put { background: #3b82f6; color: #fff; }
        .method.patch { background: #8b5cf6; color: #fff; }
        .method.delete { background: #ef4444; color: #fff; }
        
        .endpoint code {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            color: #e0e0e0;
        }
        
        /* Auth Section */
        .auth-section {
            padding: 60px 20px;
        }
        
        .auth-section h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 50px;
            color: #fff;
        }
        
        .auth-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .auth-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 25px;
        }
        
        .auth-card h4 {
            color: #00ff88;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .auth-card code {
            display: block;
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 8px;
            font-size: 0.85rem;
            color: #a0a0a0;
            overflow-x: auto;
            white-space: pre;
        }
        
        /* Footer */
        footer {
            text-align: center;
            padding: 40px 20px;
            color: #666;
            font-size: 0.9rem;
        }
        
        footer a {
            color: #00d9ff;
            text-decoration: none;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            .hero p {
                font-size: 1rem;
            }
            .btn {
                padding: 14px 24px;
                font-size: 1rem;
            }
            .endpoint-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero Section -->
        <section class="hero">
            <h1>🚀 Mock API Server</h1>
            <p>Complete Mock API with OAuth 2.0, API Key and Basic Auth for integration testing and development.</p>
            <div class="btn-group">
                <a href="/api-docs" class="btn btn-primary">
                    📚 View Swagger UI
                </a>
                <a href="/oauth/.well-known/oauth-authorization-server" class="btn btn-secondary">
                    🔧 OAuth Metadata
                </a>
            </div>
        </section>
        
        <!-- Features Section -->
        <section class="features">
            <h2>✨ Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔐</div>
                    <h3>Full OAuth 2.0</h3>
                    <p>Support for client_credentials, password, authorization_code and refresh_token grant types.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔑</div>
                    <h3>Multiple Auth Methods</h3>
                    <p>Authentication via JWT Bearer, API Key (X-API-Key) and HTTP Basic Auth.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📦</div>
                    <h3>Full CRUD Operations</h3>
                    <p>Complete GET, POST, PUT, PATCH, DELETE operations with in-memory persistence.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📄</div>
                    <h3>Pagination & Search</h3>
                    <p>Paginated endpoints with sorting, filtering, and search capabilities.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📤</div>
                    <h3>File Upload</h3>
                    <p>Mock file upload endpoints returning CDN-like URLs for testing.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🛡️</div>
                    <h3>JWT Tokens</h3>
                    <p>Real JWT tokens with expiration, refresh tokens and revocation.</p>
                </div>
            </div>
        </section>
        
        <!-- Endpoints Section -->
        <section class="endpoints">
            <h2>📡 Available Endpoints</h2>
            <div class="endpoint-grid">
                <div class="endpoint-group">
                    <h3>🔐 OAuth 2.0</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/oauth/authorize</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/oauth/token</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/oauth/introspect</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/oauth/revoke</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/oauth/.well-known/oauth-authorization-server</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>� Users (CRUD)</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/users</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/users/paginated</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/users/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/users</code>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <code>/api/users/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method patch">PATCH</span>
                        <code>/api/users/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DEL</span>
                        <code>/api/users/:id</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>📦 Products (CRUD)</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/products</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/products/paginated</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/products/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/products</code>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <code>/api/products/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method patch">PATCH</span>
                        <code>/api/products/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DEL</span>
                        <code>/api/products/:id</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>🛒 Sales (CRUD)</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/sales</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/sales/paginated</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/sales/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/sales</code>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <code>/api/sales/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method patch">PATCH</span>
                        <code>/api/sales/:id</code>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DEL</span>
                        <code>/api/sales/:id</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>📤 File Upload</h3>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/upload/single</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/upload/multiple</code>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/upload/image</code>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Auth Section -->
        <section class="auth-section">
            <h2>🔑 Authentication Methods</h2>
            <div class="auth-cards">
                <div class="auth-card">
                    <h4>JWT Bearer Token</h4>
                    <code>Authorization: Bearer &lt;access_token&gt;</code>
                </div>
                <div class="auth-card">
                    <h4>API Key</h4>
                    <code>X-API-Key: api-key-123456</code>
                </div>
                <div class="auth-card">
                    <h4>Basic Auth</h4>
                    <code>Authorization: Basic &lt;base64(user:pass)&gt;

Valid credentials:
  • admin:admin123
  • user:user123</code>
                </div>
                <div class="auth-card">
                    <h4>OAuth Client Credentials</h4>
                    <code>POST /oauth/token
{
  "grant_type": "client_credentials",
  "client_id": "client123",
  "client_secret": "secret123"
}</code>
                </div>
            </div>
        </section>
    </div>
    
    <footer>
        <p>Mock API Server v1.0.0 | <a href="/api-docs">Swagger Documentation</a></p>
        <p style="margin-top: 10px; font-size: 0.85rem;">Built by <a href="https://aldemi.tech" style="color: #00ff88;">Aldemi Tech</a> 🚀</p>
    </footer>
</body>
</html>
    `;
  }
}
