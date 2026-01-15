# Ejemplos de Consumo de la API Mock

Este documento contiene ejemplos de cómo consumir la API usando diferentes métodos de autenticación.

## 1. OAuth 2.0 (Client Credentials)

### Paso 1: Obtener Access Token

```bash
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "client123",
    "client_secret": "secret123"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Paso 2: Usar el Token para Acceder a Recursos

```bash
# Obtener lista de usuarios
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Obtener usuario específico
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Obtener lista de productos
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Obtener lista de ventas
curl -X GET http://localhost:3000/api/sales \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2. API Key Authentication

Usa el header `X-API-Key` con una de las API keys válidas.

### API Keys Válidas:
- `api-key-123456` (usuario admin)
- `api-key-789012` (usuario user)

```bash
# Obtener lista de usuarios
curl -X GET http://localhost:3000/api/users \
  -H "X-API-Key: api-key-123456"

# Obtener producto específico
curl -X GET http://localhost:3000/api/products/1 \
  -H "X-API-Key: api-key-123456"

# Obtener venta específica
curl -X GET http://localhost:3000/api/sales/1 \
  -H "X-API-Key: api-key-789012"
```

---

## 3. Basic Authentication

Usa credenciales de usuario en formato Basic Auth.

### Credenciales Válidas:
- Usuario: `admin` / Password: `admin123`
- Usuario: `user` / Password: `user123`

```bash
# Obtener lista de usuarios (usando admin)
curl -X GET http://localhost:3000/api/users \
  -u admin:admin123

# Obtener lista de productos (usando user)
curl -X GET http://localhost:3000/api/products \
  -u user:user123

# También puedes usar el header Authorization directamente
curl -X GET http://localhost:3000/api/sales \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM="
```

Para generar el header Basic Auth manualmente:
```bash
echo -n "admin:admin123" | base64
# Resultado: YWRtaW46YWRtaW4xMjM=
```

---

## 4. Ejemplos con JavaScript/TypeScript

### OAuth 2.0

```javascript
// Obtener token
async function getAccessToken() {
  const response = await fetch('http://localhost:3000/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: 'client123',
      client_secret: 'secret123',
    }),
  });
  
  const data = await response.json();
  return data.access_token;
}

// Usar el token
async function getUsers() {
  const token = await getAccessToken();
  
  const response = await fetch('http://localhost:3000/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
}
```

### API Key

```javascript
async function getProducts() {
  const response = await fetch('http://localhost:3000/api/products', {
    headers: {
      'X-API-Key': 'api-key-123456',
    },
  });
  
  return await response.json();
}
```

### Basic Auth

```javascript
async function getSales() {
  const credentials = btoa('admin:admin123');
  
  const response = await fetch('http://localhost:3000/api/sales', {
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });
  
  return await response.json();
}
```

---

## 5. Ejemplos con Python

### OAuth 2.0

```python
import requests

# Obtener token
def get_access_token():
    url = 'http://localhost:3000/oauth/token'
    payload = {
        'grant_type': 'client_credentials',
        'client_id': 'client123',
        'client_secret': 'secret123'
    }
    response = requests.post(url, json=payload)
    return response.json()['access_token']

# Usar el token
def get_users():
    token = get_access_token()
    url = 'http://localhost:3000/api/users'
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    return response.json()
```

### API Key

```python
import requests

def get_products():
    url = 'http://localhost:3000/api/products'
    headers = {'X-API-Key': 'api-key-123456'}
    response = requests.get(url, headers=headers)
    return response.json()
```

### Basic Auth

```python
import requests
from requests.auth import HTTPBasicAuth

def get_sales():
    url = 'http://localhost:3000/api/sales'
    auth = HTTPBasicAuth('admin', 'admin123')
    response = requests.get(url, auth=auth)
    return response.json()
```

---

## 6. Endpoints Disponibles

### Usuarios
- `GET /api/users` - Lista todos los usuarios
- `GET /api/users/:id` - Obtiene un usuario específico

### Productos
- `GET /api/products` - Lista todos los productos
- `GET /api/products/:id` - Obtiene un producto específico

### Ventas
- `GET /api/sales` - Lista todas las ventas
- `GET /api/sales/:id` - Obtiene una venta específica

---

## 7. Respuestas de Error

### Sin Autenticación (401)
```json
{
  "statusCode": 401,
  "message": "Authentication required. Please provide valid Bearer token, API Key (X-API-Key header), or Basic Auth credentials"
}
```

### Recurso No Encontrado (404)
```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found"
}
```

### Token Expirado (401)
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

---

## 8. Testing con Postman

1. Importa la colección creando requests con los ejemplos anteriores
2. Para OAuth 2.0:
   - Crea un request POST a `/oauth/token`
   - Guarda el `access_token` en una variable de entorno
   - Usa `{{access_token}}` en las siguientes requests

3. Para API Key:
   - Agrega un header `X-API-Key` con el valor `api-key-123456`

4. Para Basic Auth:
   - En la pestaña "Authorization", selecciona "Basic Auth"
   - Ingresa username: `admin` y password: `admin123`
