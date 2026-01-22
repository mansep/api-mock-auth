# Mock API Usage Examples

This document contains examples of how to consume the API using different authentication methods and advanced filtering.

## Base URL

```
http://localhost:7110
```

---

## 1. OAuth 2.0 (Client Credentials)

### Step 1: Get Access Token

```bash
curl -X POST http://localhost:7110/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "client123",
    "client_secret": "secret123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Step 2: Use the Token to Access Resources

```bash
# Get list of users
curl -X GET http://localhost:7110/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2. API Key Authentication

Use the `X-API-Key` header with one of the valid API keys.

### Valid API Keys:
- `api-key-123456` (admin user)
- `api-key-789012` (regular user)

```bash
# Get products
curl -X GET http://localhost:7110/api/products \
  -H "X-API-Key: api-key-123456"
```

---

## 3. Basic Authentication

Use user credentials in Basic Auth format.

### Valid Credentials:
- Username: `admin` / Password: `admin123`
- Username: `johndoe` / Password: `password123`

```bash
# Get sales
curl -X GET http://localhost:7110/api/sales \
  -u admin:admin123
```

---

## 4. Advanced Filtering & Pagination

All resources support advanced filtering via the `/paginated` endpoint.

### Pagination Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | `1` |
| `limit` | number | Items per page | `10` |
| `sortBy` | string | Sort field (supports nested) | `price`, `pricing.total` |
| `sortOrder` | string | Sort order | `asc`, `desc` |

### Search & Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Global text search | `iphone` |
| `category` | string | Filter by category | `Electronics` |
| `brand` | string | Filter by brand | `Apple` |
| `status` | string | Filter by status (sales) | `delivered` |
| `role` | string | Filter by role (users) | `admin` |
| `active` | boolean | Filter by active status | `true` |
| `tags` | string | Filter by tags (comma-separated) | `wireless,premium` |

### Numeric Range Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `minPrice` | number | Minimum price | `100` |
| `maxPrice` | number | Maximum price | `1000` |
| `minStock` | number | Minimum stock | `10` |
| `maxStock` | number | Maximum stock | `100` |
| `minRating` | number | Minimum rating (1-5) | `4` |
| `minTotal` | number | Minimum total (sales) | `500` |
| `maxTotal` | number | Maximum total (sales) | `5000` |

### Date Range Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `createdAfter` | ISO 8601 | Created after date | `2024-01-01T00:00:00Z` |
| `createdBefore` | ISO 8601 | Created before date | `2024-12-31T23:59:59Z` |
| `updatedAfter` | ISO 8601 | Updated after date | `2024-06-01T00:00:00Z` |
| `updatedBefore` | ISO 8601 | Updated before date | `2024-12-31T23:59:59Z` |

### Field Selection

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `fields` | string | Select specific fields (comma-separated) | `id,name,price` |

---

## 5. Filtering Examples

### Products - Filter by Brand and Price Range

```bash
curl -X GET "http://localhost:7110/api/products/paginated?brand=Apple&minPrice=500&maxPrice=2000" \
  -H "X-API-Key: api-key-123456"
```

### Products - Filter by Category with Rating and Custom Fields

```bash
curl -X GET "http://localhost:7110/api/products/paginated?category=Electronics&minRating=4.5&sortBy=price&sortOrder=desc&fields=id,name,price,rating,brand" \
  -H "X-API-Key: api-key-123456"
```

**Response:**
```json
{
  "data": [
    {
      "id": "prod-001",
      "name": "MacBook Pro 16\" M3 Max",
      "price": 3499.99,
      "rating": 4.9,
      "brand": "Apple"
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "filters": {
    "search": null,
    "category": "Electronics",
    "brand": null,
    "priceRange": null,
    "dateRange": null
  }
}
```

### Products - Filter by Tags and Date Range

```bash
curl -X GET "http://localhost:7110/api/products/paginated?tags=wireless,gaming&createdAfter=2024-06-01T00:00:00Z" \
  -H "X-API-Key: api-key-123456"
```

### Sales - Filter by Status and Total Amount

```bash
curl -X GET "http://localhost:7110/api/sales/paginated?status=delivered&minTotal=500&fields=id,orderId,status,pricing.total,customerInfo.name" \
  -H "X-API-Key: api-key-123456"
```

**Response:**
```json
{
  "data": [
    {
      "id": "sale-001",
      "orderId": "ORD-2025-0001",
      "status": "delivered",
      "pricing.total": 3507.38,
      "customerInfo.name": "John Doe"
    }
  ],
  "meta": { ... },
  "filters": {
    "status": "delivered",
    "totalRange": { "min": 500 }
  }
}
```

### Users - Filter by Role and Country

```bash
curl -X GET "http://localhost:7110/api/users/paginated?role=admin&country=USA&fields=id,username,email,role,address.city" \
  -H "X-API-Key: api-key-123456"
```

---

## 6. CRUD Operations

### Create (POST)

```bash
curl -X POST http://localhost:7110/api/products \
  -H "X-API-Key: api-key-123456" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "category": "Electronics",
    "price": 299.99,
    "stock": 50,
    "brand": "TestBrand"
  }'
```

### Update (PUT/PATCH)

```bash
curl -X PATCH http://localhost:7110/api/products/prod-001 \
  -H "X-API-Key: api-key-123456" \
  -H "Content-Type: application/json" \
  -d '{"price": 349.99, "stock": 100}'
```

### Delete (DELETE)

```bash
curl -X DELETE http://localhost:7110/api/products/prod-001 \
  -H "X-API-Key: api-key-123456"
```

---

## 7. File Upload

### Single File Upload

```bash
curl -X POST http://localhost:7110/api/upload/single \
  -H "X-API-Key: api-key-123456" \
  -F "file=@/path/to/file.jpg"
```

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "abc123-...",
    "originalName": "file.jpg",
    "url": "https://cdn.mock-api.example.com/uploads/abc123-..."
  }
}
```

### Multiple Files Upload

```bash
curl -X POST http://localhost:7110/api/upload/multiple \
  -H "X-API-Key: api-key-123456" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.png"
```

---

## 8. Available Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/paginated` | Get products with filtering |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Full update |
| PATCH | `/api/products/:id` | Partial update |
| DELETE | `/api/products/:id` | Delete product |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/paginated` | Get users with filtering |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Full update |
| PATCH | `/api/users/:id` | Partial update |
| DELETE | `/api/users/:id` | Delete user |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get all sales |
| GET | `/api/sales/paginated` | Get sales with filtering |
| GET | `/api/sales/:id` | Get sale by ID |
| POST | `/api/sales` | Create sale |
| PUT | `/api/sales/:id` | Full update |
| PATCH | `/api/sales/:id` | Partial update |
| DELETE | `/api/sales/:id` | Delete sale |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/single` | Upload single file |
| POST | `/api/upload/multiple` | Upload multiple files |
| POST | `/api/upload/image` | Upload image (validated) |

### OAuth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/.well-known/oauth-authorization-server` | OAuth metadata |
| POST | `/oauth/authorize` | Authorization endpoint |
| POST | `/oauth/token` | Token endpoint |

---

## 9. Data Structures

### Product (Rich Nested Object)

```json
{
  "id": "prod-001",
  "name": "MacBook Pro 16\" M3 Max",
  "description": "...",
  "category": "Electronics",
  "subcategory": "Laptops",
  "price": 3499.99,
  "currency": "USD",
  "stock": 150,
  "sku": "MBP16-M3M-32-1TB",
  "brand": "Apple",
  "tags": ["laptop", "apple", "pro", "m3"],
  "specifications": {
    "processor": "Apple M3 Max",
    "ram": "32GB",
    "storage": "1TB SSD",
    "ports": {
      "usbc": 3,
      "hdmi": 1,
      "sdCard": true
    }
  },
  "images": [
    { "url": "https://...", "alt": "Front view", "isPrimary": true }
  ],
  "variants": [
    { "id": "var-001", "name": "Space Black", "sku": "...", "priceModifier": 0, "stock": 50 }
  ],
  "rating": 4.9,
  "reviewCount": 1250,
  "reviews": [...],
  "shipping": { "weight": 2.14, "freeShipping": true, "estimatedDays": 3 },
  "active": true,
  "featured": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T15:00:00Z"
}
```

### Sale (Complex Nested Structure)

```json
{
  "id": "sale-001",
  "orderId": "ORD-2025-0001",
  "userId": "user-002",
  "customerInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123"
  },
  "status": "delivered",
  "items": [
    {
      "productId": "prod-001",
      "productName": "MacBook Pro",
      "sku": "MBP16-M3M-32-1TB",
      "quantity": 1,
      "unitPrice": 3499.99,
      "total": 3499.99,
      "variant": { "name": "Space Black", "color": "#1d1d1f" },
      "discount": { "type": "percentage", "value": 5, "amount": 175.00 }
    }
  ],
  "pricing": {
    "subtotal": 3324.99,
    "tax": { "rate": 0.0875, "amount": 290.94 },
    "shipping": 0,
    "total": 3615.93
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardLast4": "4242",
    "cardBrand": "visa",
    "transactionId": "txn_123456"
  },
  "shippingAddress": {
    "street": "456 Oak Avenue",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "United States",
    "coordinates": { "lat": 37.7749, "lng": -122.4194 }
  },
  "tracking": {
    "carrier": "FedEx",
    "trackingNumber": "FDX123456789",
    "events": [
      { "date": "2025-01-22T10:00:00Z", "status": "Delivered", "location": "San Francisco, CA" }
    ]
  },
  "createdAt": "2025-01-15T14:30:00Z",
  "updatedAt": "2025-01-22T10:00:00Z"
}
```

---

## 10. Documentation

- **Swagger UI**: http://localhost:7110/api-docs
- **OpenAPI JSON**: http://localhost:7110/api-docs-json
