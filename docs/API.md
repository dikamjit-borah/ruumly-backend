# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.ruumly.com/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Invalid request",
  "timestamp": "2024-12-27T10:00:00.000Z",
  "path": "/api/auth/login"
}
```

## Endpoints

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "Password@123",
  "name": "John Doe"
}

Response (201 Created):
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}

Error Responses:
400 - Bad Request (invalid input)
409 - Conflict (email already exists)
```

#### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "Password@123"
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}

Error Responses:
400 - Bad Request (invalid credentials)
401 - Unauthorized (invalid password)
```

### Users Endpoints

#### Get All Users
```
GET /users
Authorization: Bearer <token>

Response (200 OK):
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "is_active": true,
      "created_at": "2024-12-27T10:00:00.000Z"
    }
  ],
  "timestamp": "2024-12-27T10:00:00.000Z"
}

Error Responses:
401 - Unauthorized (missing or invalid token)
```

#### Get User by ID
```
GET /users/:id
Authorization: Bearer <token>

Parameters:
id (number) - User ID

Response (200 OK):
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "is_active": true,
    "created_at": "2024-12-27T10:00:00.000Z"
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}

Error Responses:
401 - Unauthorized
404 - Not Found (user doesn't exist)
```

#### Update User
```
PATCH /users/:id
Authorization: Bearer <token>
Content-Type: application/json

Parameters:
id (number) - User ID

Request Body (all fields optional):
{
  "name": "Jane Doe",
  "email": "newemail@example.com",
  "profile_picture": "https://example.com/photo.jpg"
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "is_active": true,
    "updated_at": "2024-12-27T10:00:00.000Z"
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}

Error Responses:
400 - Bad Request (invalid data)
401 - Unauthorized
404 - Not Found (user doesn't exist)
```

#### Delete User
```
DELETE /users/:id
Authorization: Bearer <token>

Parameters:
id (number) - User ID

Response (200 OK):
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "timestamp": "2024-12-27T10:00:00.000Z"
}

Error Responses:
401 - Unauthorized
404 - Not Found (user doesn't exist)
```

### Health Check Endpoints

#### Full Health Check
```
GET /health

Response (200 OK):
{
  "statusCode": 200,
  "status": "healthy",
  "timestamp": "2024-12-27T10:00:00.000Z",
  "uptime": 3600.5,
  "database": "connected"
}
```

#### Liveness Probe (K8s)
```
GET /health/live

Response (200 OK):
{
  "status": "ok",
  "message": "Application is live"
}
```

#### Readiness Probe (K8s)
```
GET /health/ready

Response (200 OK):
{
  "ready": true,
  "timestamp": "2024-12-27T10:00:00.000Z",
  "checks": {
    "database": true
  }
}
```

### General Endpoints

#### Welcome
```
GET /

Response (200 OK):
{
  "message": "Welcome to Ruumly Backend!"
}
```

#### Application Info
```
GET /info

Response (200 OK):
{
  "name": "Ruumly Backend",
  "version": "1.0.0",
  "environment": "development",
  "port": 3000,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service is down |

## Common Error Messages

### Authentication Errors
```json
{
  "statusCode": 401,
  "message": "Unauthorized - Invalid credentials",
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Validation Errors
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "email must be an email"
    },
    {
      "field": "password",
      "message": "password must be longer than or equal to 6 characters"
    }
  ],
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Not Found Error
```json
{
  "statusCode": 404,
  "message": "User not found",
  "path": "/api/users/999",
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

## Request Examples

### Using cURL

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get Users (with token)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### Using JavaScript/Fetch
```javascript
// Register
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    name: 'John Doe'
  })
});
const data = await response.json();
console.log(data);
```

### Using Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Login
const loginResponse = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'SecurePass123!'
});

const token = loginResponse.data.data.access_token;

// Use token for authenticated requests
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Get users
const usersResponse = await api.get('/users');
console.log(usersResponse.data);
```

## Rate Limiting

Currently no rate limiting is implemented. For production, add:

```bash
npm install @nestjs/throttler
```

Then implement in your main.ts:
```typescript
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

app.useGlobalGuards(new ThrottlerGuard());
```

## Pagination

To add pagination support:

```typescript
// In controller
@Get()
async findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  return this.service.findAll(page, limit);
}
```

## Filtering & Sorting

Example with query parameters:

```
GET /users?search=john&sort=name&order=asc&page=1&limit=10
```

Implement in service:
```typescript
async findAll(search?: string, sort?: string, order?: 'asc' | 'desc') {
  let query = this.userModel.findAll();
  
  if (search) {
    query = query.where({
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    });
  }
  
  if (sort) {
    query = query.order([[sort, order === 'desc' ? 'DESC' : 'ASC']]);
  }
  
  return query;
}
```

## Webhooks (Future)

Webhook support can be added for real-time updates:

```typescript
// Example: User created webhook
async create(user: CreateUserDto) {
  const newUser = await this.userModel.create(user);
  await this.webhookService.trigger('user.created', newUser);
  return newUser;
}
```

## API Testing Tools

- **Postman** - Full-featured API client
- **Insomnia** - REST client with team features
- **Thunder Client** - Lightweight VS Code extension
- **REST Client** - VS Code extension for quick testing
- **cURL** - Command-line tool

## Support

For API issues or questions:
1. Check error messages carefully
2. Review this documentation
3. Check application logs
4. Open an issue on GitHub

---

Last Updated: 2024-12-27
