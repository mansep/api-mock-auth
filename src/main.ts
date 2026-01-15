import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Mock API Server is running!                             ║
║                                                               ║
║   📡 URL: http://localhost:${port}                            ║
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
