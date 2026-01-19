import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Mock API Server')
    .setDescription('Mock API with OAuth 2.0, API Key and Basic Auth for integration testing')
    .setVersion('1.0.0')
    .setContact('Aldemi Tech', 'https://aldemi.tech', 'contact@aldemi.tech')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /oauth/token endpoint',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key for authentication (e.g. api-key-123456)',
      },
      'API-Key',
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        description: 'Credentials: admin:admin123 or user:user123',
      },
      'Basic-auth',
    )
    .addTag('OAuth 2.0', 'OAuth 2.0 authentication endpoints')
    .addTag('Users', 'User management (requires authentication)')
    .addTag('Products', 'Product management (requires authentication)')
    .addTag('Sales', 'Sales management (requires authentication)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Mock API - Swagger',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Mock API Server is running!                             ║
║                                                               ║
║   📡 URL: http://localhost:${port}                            ║
║   📚 Swagger: http://localhost:${port}/api-docs               ║
║                                                               ║
║   📚 OAuth 2.0 Grant Types:                                   ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║   🔐 client_credentials - Server to server                    ║
║   🔐 password - Resource Owner Password                       ║
║   🔐 authorization_code - Web/Mobile apps                     ║
║   🔐 refresh_token - Renew access tokens                      ║
║                                                               ║
║   📋 OAuth Endpoints:                                         ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║   GET  /oauth/authorize                                       ║
║   POST /oauth/token                                           ║
║   POST /oauth/introspect                                      ║
║   POST /oauth/revoke                                          ║
║   GET  /oauth/.well-known/oauth-authorization-server          ║
║                                                               ║
║   🔑 Other Auth Methods:                                      ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║   API Key: X-API-Key header (api-key-123456)                  ║
║   Basic Auth: admin:admin123 or user:user123                  ║
║                                                               ║
║   📋 Protected Endpoints:                                     ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║   GET /api/users[/:id]                                        ║
║   GET /api/products[/:id]                                     ║
║   GET /api/sales[/:id]                                        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
