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
    <title>Mock API Server | Testing API</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon-cyan: #00fff9;
            --neon-magenta: #ff00ff;
            --neon-pink: #ff2a6d;
            --neon-yellow: #f9f002;
            --neon-green: #05ffa1;
            --neon-blue: #01c8ee;
            --dark-bg: #0a0a0f;
            --dark-surface: #12121a;
            --dark-card: #1a1a25;
            --text-primary: #ffffff;
            --text-secondary: #8888aa;
            --glow-cyan: 0 0 20px rgba(0, 255, 249, 0.5);
            --glow-magenta: 0 0 20px rgba(255, 0, 255, 0.5);
            --glow-pink: 0 0 20px rgba(255, 42, 109, 0.5);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Custom Scrollbar - Cyberpunk Style */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: var(--dark-bg);
            border-left: 1px solid var(--neon-cyan);
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--neon-cyan) 0%, var(--neon-magenta) 100%);
            border-radius: 0;
            border: 2px solid var(--dark-bg);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, var(--neon-magenta) 0%, var(--neon-pink) 100%);
            box-shadow: var(--glow-magenta);
        }
        ::-webkit-scrollbar-corner {
            background: var(--dark-bg);
        }

        body {
            font-family: 'Rajdhani', sans-serif;
            background: var(--dark-bg);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Animated Background Grid */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                linear-gradient(90deg, rgba(0, 255, 249, 0.03) 1px, transparent 1px),
                linear-gradient(rgba(0, 255, 249, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 0;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 1;
        }

        /* HERO SECTION */
        .hero {
            text-align: center;
            padding: 100px 20px 80px;
            position: relative;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 70%);
            pointer-events: none;
        }

        .glitch-wrapper {
            position: relative;
            display: inline-block;
        }

        .hero h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 4rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 8px;
            background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-pink));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: none;
            margin-bottom: 10px;
            animation: glitch 3s infinite;
        }

        @keyframes glitch {
            0%, 90%, 100% { transform: translate(0); }
            92% { transform: translate(-2px, 2px); }
            94% { transform: translate(2px, -2px); }
            96% { transform: translate(-2px, -2px); }
            98% { transform: translate(2px, 2px); }
        }

        .hero .subtitle {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.2rem;
            color: var(--neon-cyan);
            letter-spacing: 4px;
            margin-bottom: 30px;
            text-transform: uppercase;
        }

        .hero p {
            font-size: 1.3rem;
            color: var(--text-secondary);
            max-width: 700px;
            margin: 0 auto 50px;
            font-weight: 400;
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
            gap: 12px;
            padding: 18px 40px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            border: none;
            cursor: pointer;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .btn:hover::before {
            left: 100%;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue));
            color: var(--dark-bg);
            clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }

        .btn-primary:hover {
            box-shadow: var(--glow-cyan), inset 0 0 20px rgba(0, 255, 249, 0.3);
            transform: translateY(-3px);
        }

        .btn-secondary {
            background: transparent;
            color: var(--neon-magenta);
            border: 2px solid var(--neon-magenta);
            clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }

        .btn-secondary:hover {
            background: rgba(255, 0, 255, 0.1);
            box-shadow: var(--glow-magenta);
            transform: translateY(-3px);
        }

        .btn-tertiary {
            background: transparent;
            color: var(--neon-green);
            border: 2px solid var(--neon-green);
            clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }

        .btn-tertiary:hover {
            background: rgba(5, 255, 161, 0.1);
            box-shadow: 0 0 20px rgba(5, 255, 161, 0.5);
            transform: translateY(-3px);
        }

        /* SECTION STYLES */
        section {
            padding: 80px 20px;
            position: relative;
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            text-align: center;
            margin-bottom: 60px;
            text-transform: uppercase;
            letter-spacing: 4px;
            position: relative;
            display: inline-block;
            width: 100%;
        }

        .section-title::before {
            content: '//';
            color: var(--neon-cyan);
            margin-right: 15px;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
        }

        /* FEATURES GRID */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }

        .feature-card {
            background: var(--dark-card);
            border: 1px solid rgba(0, 255, 249, 0.2);
            padding: 35px;
            position: relative;
            transition: all 0.3s ease;
            clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--neon-cyan), transparent);
        }

        .feature-card:hover {
            border-color: var(--neon-cyan);
            box-shadow: var(--glow-cyan);
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            display: block;
        }

        .feature-card h3 {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.1rem;
            color: var(--neon-cyan);
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .feature-card p {
            color: var(--text-secondary);
            font-size: 1rem;
            line-height: 1.7;
        }

        /* QUICK START SECTION */
        .quick-start {
            background: var(--dark-surface);
            border-top: 1px solid rgba(0, 255, 249, 0.2);
            border-bottom: 1px solid rgba(0, 255, 249, 0.2);
        }

        .code-examples {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
        }

        .code-block {
            background: var(--dark-bg);
            border: 1px solid rgba(255, 0, 255, 0.3);
            border-radius: 0;
            overflow: hidden;
        }

        .code-header {
            background: linear-gradient(90deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 249, 0.1));
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 0, 255, 0.3);
        }

        .code-header span {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.85rem;
            color: var(--neon-magenta);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .code-header .method-badge {
            padding: 4px 12px;
            font-size: 0.75rem;
            font-weight: 700;
            border-radius: 0;
        }

        .code-header .method-badge.post { background: var(--neon-yellow); color: #000; }
        .code-header .method-badge.get { background: var(--neon-green); color: #000; }

        .code-block pre {
            padding: 20px;
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }

        .code-block pre code {
            color: inherit;
        }

        .code-block .comment { color: #666; }
        .code-block .string { color: var(--neon-green); }
        .code-block .key { color: var(--neon-cyan); }
        .code-block .url { color: var(--neon-magenta); }

        /* ENDPOINTS SECTION */
        .endpoints {
            background: rgba(0, 0, 0, 0.3);
        }

        .endpoint-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 25px;
        }

        .endpoint-group {
            background: var(--dark-card);
            border: 1px solid rgba(0, 255, 249, 0.15);
            padding: 25px;
            position: relative;
        }

        .endpoint-group::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, var(--neon-cyan), var(--neon-magenta));
        }

        .endpoint-group h3 {
            font-family: 'Orbitron', sans-serif;
            color: var(--neon-cyan);
            font-size: 1rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .endpoint {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .endpoint:last-child { border-bottom: none; }

        .method {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            font-weight: 700;
            padding: 5px 10px;
            min-width: 60px;
            text-align: center;
            text-transform: uppercase;
        }

        .method.get { background: var(--neon-green); color: #000; }
        .method.post { background: var(--neon-yellow); color: #000; }
        .method.put { background: var(--neon-blue); color: #000; }
        .method.patch { background: var(--neon-magenta); color: #000; }
        .method.delete { background: var(--neon-pink); color: #fff; }

        .endpoint code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: var(--text-secondary);
        }

        .endpoint .desc {
            font-size: 0.8rem;
            color: #666;
            margin-left: auto;
        }

        /* FILTERS SECTION */
        .filters-section {
            background: var(--dark-surface);
        }

        .filter-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
        }

        .filter-table thead {
            background: linear-gradient(90deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 255, 0.1));
        }

        .filter-table th {
            font-family: 'Orbitron', sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.8rem;
            color: var(--neon-cyan);
            padding: 15px 20px;
            text-align: left;
            border-bottom: 2px solid var(--neon-cyan);
        }

        .filter-table td {
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: var(--text-secondary);
        }

        .filter-table tr:hover td {
            background: rgba(0, 255, 249, 0.05);
        }

        .filter-table code {
            background: var(--dark-bg);
            padding: 3px 8px;
            color: var(--neon-magenta);
            border: 1px solid rgba(255, 0, 255, 0.3);
        }

        .table-container {
            overflow-x: auto;
            border: 1px solid rgba(0, 255, 249, 0.2);
        }

        /* AUTH SECTION */
        .auth-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
        }

        .auth-card {
            background: var(--dark-card);
            border: 1px solid rgba(255, 0, 255, 0.2);
            padding: 25px;
            position: relative;
        }

        .auth-card::before {
            content: '';
            position: absolute;
            top: -1px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--neon-magenta), var(--neon-pink));
        }

        .auth-card h4 {
            font-family: 'Orbitron', sans-serif;
            color: var(--neon-magenta);
            margin-bottom: 15px;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .auth-card code {
            display: block;
            background: var(--dark-bg);
            padding: 15px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: var(--text-secondary);
            overflow-x: auto;
            white-space: pre;
            border-left: 3px solid var(--neon-magenta);
        }

        /* FOOTER */
        footer {
            text-align: center;
            padding: 50px 20px;
            border-top: 1px solid rgba(0, 255, 249, 0.2);
            background: var(--dark-surface);
        }

        footer p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 10px;
        }

        footer a {
            color: var(--neon-cyan);
            text-decoration: none;
            transition: all 0.3s ease;
        }

        footer a:hover {
            color: var(--neon-magenta);
            text-shadow: var(--glow-magenta);
        }

        .footer-links {
            display: flex;
            gap: 30px;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .footer-links a {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; letter-spacing: 4px; }
            .hero .subtitle { font-size: 1rem; }
            .btn { padding: 14px 28px; font-size: 0.85rem; }
            .section-title { font-size: 1.5rem; }
            .endpoint-grid, .code-examples { grid-template-columns: 1fr; }
            .code-examples { grid-template-columns: 1fr; }
            .filter-table { font-size: 0.8rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HERO SECTION -->
        <section class="hero">
            <div class="glitch-wrapper">
                <h1>Mock API</h1>
            </div>
            <div class="subtitle">// Integration Testing Server</div>
            <p>Complete Mock API with OAuth 2.0, API Key, and Basic Auth. Full CRUD operations, advanced filtering, file uploads, and rich nested data structures for comprehensive integration testing.</p>
            <div class="btn-group">
                <a href="/api-docs" class="btn btn-primary">⚡ Swagger UI</a>
                <a href="/api-docs-json" class="btn btn-secondary">{ } OpenAPI JSON</a>
                <a href="/oauth/.well-known/oauth-authorization-server" class="btn btn-tertiary">◈ OAuth Metadata</a>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="features">
            <h2 class="section-title">System Capabilities</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <span class="feature-icon">🔐</span>
                    <h3>Full OAuth 2.0</h3>
                    <p>Client credentials, password, authorization_code, and refresh_token grant types. Token introspection and revocation included.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">🔑</span>
                    <h3>Multi-Auth Support</h3>
                    <p>JWT Bearer tokens, API Key (X-API-Key header), and HTTP Basic Auth. All methods work interchangeably.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">📦</span>
                    <h3>Full CRUD Operations</h3>
                    <p>GET, POST, PUT, PATCH, DELETE for all resources. No field restrictions on updates - perfect for mock testing.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">🔍</span>
                    <h3>Advanced Filtering</h3>
                    <p>Field filters, numeric ranges, date ranges, text search, tags, and field selection. Paginated responses with metadata.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">📤</span>
                    <h3>File Upload</h3>
                    <p>Single and multiple file upload endpoints returning mock CDN URLs. Image validation endpoint included.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">🗃️</span>
                    <h3>Rich Nested Data</h3>
                    <p>Products with variants, specs, reviews. Users with addresses, permissions. Sales with tracking events and pricing breakdowns.</p>
                </div>
            </div>
        </section>

        <!-- QUICK START SECTION -->
        <section class="quick-start">
            <h2 class="section-title">Quick Start</h2>
            <div class="code-examples">
                <div class="code-block">
                    <div class="code-header">
                        <span>Get OAuth Token</span>
                        <span class="method-badge post">POST</span>
                    </div>
                    <pre><code><span class="comment"># Request token using client credentials</span>
curl -X POST <span class="url">/oauth/token</span> \\
  -H "Content-Type: application/json" \\
  -d '{
    <span class="key">"grant_type"</span>: <span class="string">"client_credentials"</span>,
    <span class="key">"client_id"</span>: <span class="string">"client123"</span>,
    <span class="key">"client_secret"</span>: <span class="string">"secret123"</span>
  }'</code></pre>
                </div>
                <div class="code-block">
                    <div class="code-header">
                        <span>API Key Auth</span>
                        <span class="method-badge get">GET</span>
                    </div>
                    <pre><code><span class="comment"># Simple API Key authentication</span>
curl -X GET <span class="url">/api/products</span> \\
  -H <span class="string">"X-API-Key: api-key-123456"</span>

<span class="comment"># Available API Keys:</span>
<span class="comment"># • api-key-123456 (admin)</span>
<span class="comment"># • api-key-789012 (user)</span></code></pre>
                </div>
                <div class="code-block">
                    <div class="code-header">
                        <span>Basic Auth</span>
                        <span class="method-badge get">GET</span>
                    </div>
                    <pre><code><span class="comment"># HTTP Basic Authentication</span>
curl -X GET <span class="url">/api/users</span> \\
  -u admin:admin123

<span class="comment"># Valid credentials:</span>
<span class="comment"># • admin:admin123</span>
<span class="comment"># • johndoe:password123</span></code></pre>
                </div>
                <div class="code-block">
                    <div class="code-header">
                        <span>Advanced Filtering</span>
                        <span class="method-badge get">GET</span>
                    </div>
                    <pre><code><span class="comment"># Filter products by multiple criteria</span>
curl -X GET <span class="url">"/api/products/paginated?\\
  brand=Apple&\\
  minPrice=500&\\
  maxPrice=2000&\\
  minRating=4&\\
  fields=id,name,price,brand"</span> \\
  -H <span class="string">"X-API-Key: api-key-123456"</span></code></pre>
                </div>
            </div>
        </section>

        <!-- FILTERS SECTION -->
        <section class="filters-section">
            <h2 class="section-title">Filter Parameters</h2>
            <div class="table-container">
                <table class="filter-table">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>page</code></td>
                            <td>number</td>
                            <td>Page number (1-based)</td>
                            <td><code>1</code></td>
                        </tr>
                        <tr>
                            <td><code>limit</code></td>
                            <td>number</td>
                            <td>Items per page</td>
                            <td><code>10</code></td>
                        </tr>
                        <tr>
                            <td><code>sortBy</code></td>
                            <td>string</td>
                            <td>Sort field (supports nested paths)</td>
                            <td><code>price</code>, <code>pricing.total</code></td>
                        </tr>
                        <tr>
                            <td><code>sortOrder</code></td>
                            <td>string</td>
                            <td>Sort direction</td>
                            <td><code>asc</code>, <code>desc</code></td>
                        </tr>
                        <tr>
                            <td><code>search</code></td>
                            <td>string</td>
                            <td>Global text search</td>
                            <td><code>laptop</code></td>
                        </tr>
                        <tr>
                            <td><code>category</code></td>
                            <td>string</td>
                            <td>Filter by category</td>
                            <td><code>Electronics</code></td>
                        </tr>
                        <tr>
                            <td><code>brand</code></td>
                            <td>string</td>
                            <td>Filter by brand</td>
                            <td><code>Apple</code></td>
                        </tr>
                        <tr>
                            <td><code>minPrice</code> / <code>maxPrice</code></td>
                            <td>number</td>
                            <td>Price range</td>
                            <td><code>100</code>, <code>1000</code></td>
                        </tr>
                        <tr>
                            <td><code>minRating</code></td>
                            <td>number</td>
                            <td>Minimum rating (1-5)</td>
                            <td><code>4</code></td>
                        </tr>
                        <tr>
                            <td><code>status</code></td>
                            <td>string</td>
                            <td>Filter by status (sales)</td>
                            <td><code>delivered</code></td>
                        </tr>
                        <tr>
                            <td><code>createdAfter</code> / <code>createdBefore</code></td>
                            <td>ISO 8601</td>
                            <td>Date range filter</td>
                            <td><code>2024-01-01T00:00:00Z</code></td>
                        </tr>
                        <tr>
                            <td><code>tags</code></td>
                            <td>string</td>
                            <td>Filter by tags (comma-separated)</td>
                            <td><code>premium,wireless</code></td>
                        </tr>
                        <tr>
                            <td><code>fields</code></td>
                            <td>string</td>
                            <td>Select specific fields</td>
                            <td><code>id,name,price</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- ENDPOINTS SECTION -->
        <section class="endpoints">
            <h2 class="section-title">API Endpoints</h2>
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
                        <code>/oauth/userinfo</code>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/.well-known/oauth-authorization-server</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>👥 Users</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/users</code>
                        <span class="desc">List all</span>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/users/paginated</code>
                        <span class="desc">With filters</span>
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
                        <span class="desc">Full update</span>
                    </div>
                    <div class="endpoint">
                        <span class="method patch">PATCH</span>
                        <code>/api/users/:id</code>
                        <span class="desc">Partial</span>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DEL</span>
                        <code>/api/users/:id</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>📦 Products</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/products</code>
                        <span class="desc">List all</span>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/products/paginated</code>
                        <span class="desc">With filters</span>
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
                        <span class="desc">Full update</span>
                    </div>
                    <div class="endpoint">
                        <span class="method patch">PATCH</span>
                        <code>/api/products/:id</code>
                        <span class="desc">Partial</span>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DEL</span>
                        <code>/api/products/:id</code>
                    </div>
                </div>
                <div class="endpoint-group">
                    <h3>🛒 Sales</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/sales</code>
                        <span class="desc">List all</span>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <code>/api/sales/paginated</code>
                        <span class="desc">With filters</span>
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
                        <span class="desc">Full update</span>
                    </div>
                    <div class="endpoint">
                        <span class="method patch">PATCH</span>
                        <code>/api/sales/:id</code>
                        <span class="desc">Partial</span>
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
                        <span class="desc">Single file</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/upload/multiple</code>
                        <span class="desc">Multiple files</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <code>/api/upload/image</code>
                        <span class="desc">Image only</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- AUTH SECTION -->
        <section class="auth-section">
            <h2 class="section-title">Authentication Methods</h2>
            <div class="auth-cards">
                <div class="auth-card">
                    <h4>JWT Bearer Token</h4>
                    <code>Authorization: Bearer &lt;access_token&gt;

# Get token first via POST /oauth/token
# Token expires in 3600 seconds</code>
                </div>
                <div class="auth-card">
                    <h4>API Key</h4>
                    <code>X-API-Key: api-key-123456

# Available keys:
• api-key-123456 (admin)
• api-key-789012 (user)</code>
                </div>
                <div class="auth-card">
                    <h4>Basic Auth</h4>
                    <code>Authorization: Basic &lt;base64&gt;

# Or use -u flag in curl:
curl -u admin:admin123 /api/users</code>
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
        <div class="footer-links">
            <a href="/api-docs">⚡ Swagger UI</a>
            <a href="/api-docs-json">{ } OpenAPI JSON</a>
            <a href="/oauth/.well-known/oauth-authorization-server">◈ OAuth Metadata</a>
        </div>
        <p>Mock API Server v1.0.0</p>
        <p style="margin-top: 15px;">Built with 💜 by <a href="https://aldemi.tech" style="color: var(--neon-magenta);">Aldemi Tech</a></p>
    </footer>
</body>
</html>
    `;
  }
}
