# Quick Reference Guide

## 🚀 Start Here

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run start:dev

# 3. API is available at
http://localhost:3000/api
```

## 📋 Common Tasks

### Create New Module
```bash
nest generate module features/products
nest generate controller features/products
nest generate service features/products
```

### Run Tests
```bash
npm run test                # Run all tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
```

### Build for Production
```bash
npm run build
npm run start:prod
```

### Check Code Quality
```bash
npm run lint              # Check
npm run lint -- --fix     # Auto-fix
npm run format            # Format code
```

## 🔑 Authentication Flow

### 1. Register User
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### 2. Get Access Token
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
# Response includes: access_token
```

### 3. Use Token for Requests
```bash
GET /api/users
Authorization: Bearer <access_token>
```

## 📁 Important Files

### Config
- `.env` - Environment variables
- `src/config/env.config.ts` - Config loader

### Core Modules
- `src/auth/` - Authentication
- `src/users/` - User management
- `src/database/` - Database setup

### Common Utilities
- `src/common/filters/` - Error handling
- `src/common/guards/` - JWT protection
- `src/common/interceptors/` - Logging
- `src/common/decorators/` - Custom decorators

## 🗄️ Database

### View Tables
```bash
mysql -u root -p
USE ruumly_db;
SHOW TABLES;
DESC users;
```

### Reset Database
```sql
DROP DATABASE ruumly_db;
CREATE DATABASE ruumly_db;
```

## 🐳 Docker

### Start All Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f app
docker-compose logs -f mysql
```

## 📊 API Testing Examples

### Using Thunder Client (VS Code)
1. Install "Thunder Client" extension
2. Create new request
3. Set method and URL
4. Add headers and body
5. Click Send

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123!",
    "name":"John"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123!"
  }'
```

**Get Users:**
```bash
TOKEN="your_access_token_here"
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

## 🔧 Environment Variables

### Development (.env)
```env
NODE_ENV=development
APP_PORT=3000
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=ruumly_db
JWT_SECRET=dev-secret-key
```

### Production (.env)
```env
NODE_ENV=production
APP_PORT=3000
DB_HOST=prod-db-endpoint
DB_USERNAME=produser
DB_PASSWORD=strong-password
DB_DATABASE=ruumly_prod
JWT_SECRET=strong-secret-key
CORS_ORIGIN=https://frontend.ruumly.com
```

## 🐛 Debugging

### View Logs
```bash
npm run start:dev
# Logs appear in terminal
```

### Enable Debug Mode
```bash
npm run start:debug
# Visit chrome://inspect
```

### Check Health
```bash
curl http://localhost:3000/api/health
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Overview & setup |
| DEVELOPMENT.md | Dev guide & patterns |
| DEPLOYMENT.md | Deployment & hosting |
| API.md | API reference |
| BOILERPLATE_SUMMARY.md | Feature summary |

## 🆘 Common Issues

### Port 3000 Already in Use
```bash
APP_PORT=3001 npm run start:dev
```

### Module Not Found Error
```bash
npm run build
rm -rf dist
npm run build
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify .env settings
cat .env
```

### JWT Token Invalid
- Token must be in `Authorization: Bearer <token>` format
- Token should not be expired
- JWT_SECRET must match

## ⚡ Performance Tips

1. **Use Pagination**
   ```typescript
   @Get()
   async findAll(@Query('page') page: number) {
     const limit = 10;
     const offset = (page - 1) * limit;
     return this.service.findAll(offset, limit);
   }
   ```

2. **Add Database Indexes**
   ```typescript
   @Column({ unique: true })
   email: string;
   ```

3. **Enable Caching** (optional)
   ```bash
   npm install @nestjs/cache-manager
   ```

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use HTTPS in production
- [ ] Set strong database password
- [ ] Enable CORS only for trusted origins
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use environment variables for secrets
- [ ] Enable password hashing (already done)
- [ ] Validate all user input (already done)
- [ ] Implement rate limiting (optional)

## 📞 Useful Commands

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debugger
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled version

# Testing
npm run test               # Run unit tests
npm run test:watch        # Watch mode
npm run test:e2e          # Run E2E tests

# Code Quality
npm run lint              # Check code
npm run lint -- --fix     # Auto-fix
npm run format            # Format with Prettier

# Docker
docker-compose up         # Start services
docker-compose down       # Stop services
docker build -t app .     # Build image
docker run -p 3000:3000 app  # Run container
```

## 🎯 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Write Code**
   - Create module with CLI
   - Implement service logic
   - Create controller routes
   - Write tests

3. **Test Locally**
   ```bash
   npm run test
   npm run lint
   npm run start:dev
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

5. **Create Pull Request**
   - Request review
   - Address feedback
   - Merge to main

## 🚀 Deployment Checklist

- [ ] All tests passing
- [ ] Linter checks pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API documentation updated
- [ ] Security review completed
- [ ] Performance tested
- [ ] Health checks verified

## 🎓 Learning Resources

- [Nest.js Docs](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Sequelize Docs](https://sequelize.org)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [REST API Design](https://restfulapi.net)

---

**Quick Access**: See specific docs for detailed guides:
- Setup issues? → README.md
- Development help? → DEVELOPMENT.md
- Deploy to production? → DEPLOYMENT.md
- API endpoints? → API.md

**Happy Coding! 🎉**
