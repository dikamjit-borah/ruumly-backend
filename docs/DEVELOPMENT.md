# Development Guide

## Quick Start

### 1. Setup Database
```bash
# Option A: Use Docker Compose
docker-compose up -d

# Option B: Local MySQL
mysql -u root
CREATE DATABASE ruumly_db;
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run Development Server
```bash
npm run start:dev
```

### 5. Test Endpoints
```bash
# Check API is running
curl http://localhost:3000/api

# Check health
curl http://localhost:3000/api/health
```

## File Structure Best Practices

### Modules
Each module should have:
- `*.controller.ts` - HTTP request handlers
- `*.service.ts` - Business logic
- `*.module.ts` - Module definition
- `dto/` - Data transfer objects
- `entities/` - Database models
- `*.spec.ts` - Unit tests

### Common Pattern
```
src/
├── feature/
│   ├── dto/
│   │   ├── create-feature.dto.ts
│   │   └── update-feature.dto.ts
│   ├── entities/
│   │   └── feature.entity.ts
│   ├── feature.controller.ts
│   ├── feature.service.ts
│   ├── feature.module.ts
│   └── feature.service.spec.ts
```

## Creating New Modules

### 1. Use Nest CLI
```bash
nest generate module features/products
nest generate controller features/products
nest generate service features/products
```

### 2. Create Entity
```typescript
// src/features/products/entities/product.entity.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class Product extends Model<Product> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.DECIMAL(10, 2))
  price: number;
}
```

### 3. Create DTOs
```typescript
// src/features/products/dto/create-product.dto.ts
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

### 4. Create Service
```typescript
// src/features/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }
}
```

### 5. Create Controller
```typescript
// src/features/products/products.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
```

### 6. Update Module
```typescript
// src/features/products/products.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### 7. Import in App Module
```typescript
// src/app.module.ts
import { ProductsModule } from './features/products/products.module';

@Module({
  imports: [
    // ... other imports
    ProductsModule,
  ],
})
export class AppModule {}
```

## Testing

### Unit Tests
```typescript
// src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'ProductRepository',
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const dto = { name: 'Test', price: 100 };
    mockProductModel.create.mockResolvedValue(dto);
    
    const result = await service.create(dto);
    
    expect(mockProductModel.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });
});
```

### E2E Tests
```bash
npm run test:e2e
```

## Logging

### Use Logger Service
```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
    this.logger.error('An error occurred', 'Context');
    this.logger.warn('Warning message');
    this.logger.debug('Debug info');
  }
}
```

## Database Migrations

### Create New Migration (with Sequelize)
```bash
# Install sequelize-cli
npm install --save-dev sequelize-cli

# Initialize migrations
npx sequelize-cli init

# Create migration
npx sequelize-cli migration:generate --name add-column-to-users

# Run migrations
npx sequelize-cli db:migrate

# Undo migration
npx sequelize-cli db:migrate:undo
```

### Migration Example
```typescript
// migrations/20231225120000-add-phone-to-users.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone');
  },
};
```

## Environment Management

### Development
```bash
NODE_ENV=development npm run start:dev
```

### Production
```bash
npm run build
NODE_ENV=production npm run start:prod
```

### Multiple Environments
```env
# .env.development
DB_HOST=localhost

# .env.production
DB_HOST=prod-db.example.com

# .env.test
DB_HOST=test-db.example.com
```

Update `env.config.ts`:
```typescript
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
expand(config({ path: envFile }));
```

## Debugging

### VS Code Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Nest Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then press `F5` to debug.

### Logging Configuration
```typescript
// src/config/logger.config.ts
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const loggerConfig = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
};
```

## Performance Tips

1. **Use Database Indexes**
   ```typescript
   @Column({ type: DataType.STRING, unique: true })
   email: string;
   ```

2. **Implement Caching**
   ```bash
   npm install @nestjs/cache-manager
   ```

3. **Use Pagination**
   ```typescript
   async findAll(page: number, limit: number) {
     const offset = (page - 1) * limit;
     return this.model.findAll({ offset, limit });
   }
   ```

4. **Profile Database Queries**
   ```typescript
   // Enable logging in development
   logging: isDevelopment ? console.log : false,
   ```

## Security Checklist

- ✅ Set strong JWT_SECRET in production
- ✅ Enable HTTPS in production
- ✅ Use environment variables for sensitive data
- ✅ Validate all input with class-validator
- ✅ Implement rate limiting
- ✅ Use helmet for security headers
- ✅ Keep dependencies updated
- ✅ Enable CORS only for trusted origins
- ✅ Hash passwords with bcryptjs
- ✅ Implement request/response logging

## Common Issues & Solutions

### Issue: Database Connection Timeout
```bash
# Check MySQL is running
mysql -u root -p

# Update connection pool settings in .env
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

### Issue: Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
APP_PORT=3001 npm run start:dev
```

### Issue: Module Not Found
```bash
# Rebuild TypeScript
npm run build

# Clear dist folder
rm -rf dist && npm run build
```

### Issue: JWT Token Invalid
- Verify token is in `Authorization: Bearer <token>` format
- Check JWT_SECRET matches
- Verify token hasn't expired

## IDE Setup

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
- MySQL (for database)
- Git Graph
- REST Client

### Settings (.vscode/settings.json)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "typescript"
  ]
}
```

## Useful Resources

- [Nest.js Documentation](https://docs.nestjs.com)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

Happy coding! 🚀
