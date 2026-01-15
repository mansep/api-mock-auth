# Mock API Server

API mock con múltiples métodos de autenticación para pruebas de integración.

## Características

- **OAuth 2.0 Completo**: Todos los grant types principales
  - `client_credentials` - Para aplicaciones servidor a servidor
  - `password` - Resource Owner Password Credentials
  - `authorization_code` - Para aplicaciones web/móviles
  - `refresh_token` - Para renovar tokens expirados
- **API Key**: Autenticación mediante header `X-API-Key`
- **Basic Auth**: Autenticación básica HTTP
- **JWT Tokens**: Tokens reales con expiración
- **Datos Dummy**: JSON files con usuarios, productos y ventas

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## OAuth 2.0 Endpoints

### Server Metadata (RFC 8414)
```
GET /oauth/.well-known/oauth-authorization-server
```

### Authorization Endpoint (para authorization_code)
```
GET /oauth/authorize
  ?response_type=code
  &client_id=client123
  &redirect_uri=http://localhost:8080/callback
  &scope=read
  &state=xyz
```

### Token Endpoint
```
POST /oauth/token
Content-Type: application/json
```

### Token Introspection (RFC 7662)
```
POST /oauth/introspect
Content-Type: application/json
{ "token": "<access_token>" }
```

### Token Revocation (RFC 7009)
```
POST /oauth/revoke
Content-Type: application/json
{ "token": "<refresh_token>", "token_type_hint": "refresh_token" }
```

## OAuth 2.0 Grant Types

### 1. Client Credentials
Para comunicación servidor a servidor.

```bash
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "client123",
    "client_secret": "secret123",
    "scope": "read"
  }'
```

### 2. Password Grant (Resource Owner)
Para aplicaciones de confianza que manejan credenciales del usuario.

```bash
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "password",
    "client_id": "client123",
    "client_secret": "secret123",
    "username": "admin",
    "password": "admin123",
    "scope": "read write"
  }'
```

### 3. Authorization Code
Flujo más seguro para aplicaciones web/móviles.

**Paso 1: Obtener código de autorización**
```bash
curl "http://localhost:3000/oauth/authorize?response_type=code&client_id=client123&redirect_uri=http://localhost:8080/callback&state=xyz"
```

**Paso 2: Intercambiar código por token**
```bash
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "client_id": "client123",
    "client_secret": "secret123",
    "code": "<code_obtenido>",
    "redirect_uri": "http://localhost:8080/callback"
  }'
```

### 4. Refresh Token
Para renovar tokens sin pedir credenciales nuevamente.

```bash
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "refresh_token",
    "client_id": "client123",
    "client_secret": "secret123",
    "refresh_token": "<refresh_token>"
  }'
```

## Respuesta de Token

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "abc123xyz...",
  "scope": "read write"
}
```

## Endpoints de Recursos Protegidos

Todos los endpoints aceptan los 3 métodos de autenticación:

### Con OAuth 2.0 Bearer Token
```
Authorization: Bearer <access_token>
```

### Con API Key
```
X-API-Key: api-key-123456
```

### Con Basic Auth
```
Authorization: Basic base64(username:password)
```

### Endpoints Disponibles

- `GET /api/users` - Lista de usuarios
- `GET /api/users/:id` - Usuario específico
- `GET /api/products` - Lista de productos
- `GET /api/products/:id` - Producto específico
- `GET /api/sales` - Lista de ventas
- `GET /api/sales/:id` - Venta específica

## Credenciales de Prueba

### OAuth 2.0 Clients

| Client ID | Client Secret | Grant Types |
|-----------|---------------|-------------|
| client123 | secret123 | Todos (client_credentials, password, authorization_code, refresh_token) |
| client456 | secret456 | client_credentials, refresh_token |
| webapp | webappsecret | authorization_code, refresh_token |
| mobile | mobilesecret | password, refresh_token |

### API Keys

| API Key | Usuario |
|---------|---------|
| api-key-123456 | admin |
| api-key-789012 | user |
| api-key-345678 | jsmith |

### Basic Auth / Password Grant

| Usuario | Password |
|---------|----------|
| admin | admin123 |
| user | user123 |
| jsmith | jsmith123 |
| mbrown | mbrown123 |

## Testing

Ejecuta el script de prueba:

```bash
./test-api.sh
```

## Puerto

La API corre por defecto en el puerto `3000`.
