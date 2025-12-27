# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] Security review completed
- [ ] API documentation updated
- [ ] Dependencies updated (`npm audit`)

## Environment Setup

### Production Environment Variables
```env
NODE_ENV=production
APP_PORT=3000
APP_NAME=Ruumly Backend

# Database - Use managed database service
DB_HOST=prod-db.c.amazonaws.com
DB_PORT=3306
DB_USERNAME=produser
DB_PASSWORD=<strong-password>
DB_DATABASE=ruumly_prod
DB_POOL_MAX=20

# JWT - Generate strong secret
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRATION=24h

# CORS - Frontend URL only
CORS_ORIGIN=https://frontend.ruumly.com
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=warn
LOG_DIR=/var/log/ruumly-backend
```

### Generate Secure JWT Secret
```bash
openssl rand -base64 32
```

## Docker Deployment

### Build Image
```bash
docker build -t ruumly-backend:1.0.0 .
docker tag ruumly-backend:1.0.0 your-registry/ruumly-backend:latest
docker push your-registry/ruumly-backend:latest
```

### Run Container
```bash
docker run -d \
  --name ruumly-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=mysql-host \
  -e JWT_SECRET=<secret> \
  your-registry/ruumly-backend:latest
```

## AWS EC2 Deployment

### 1. Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.medium (minimum)
- Security Groups: Allow 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 2. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL Client
sudo apt install -y mysql-client

# Install Git
sudo apt install -y git

# Create app directory
sudo mkdir -p /home/app
sudo chown -R $USER:$USER /home/app
```

### 3. Deploy Application
```bash
cd /home/app

# Clone repository
git clone <repo-url> ruumly-backend
cd ruumly-backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
# Edit .env with production values

# Build application
npm run build

# Install PM2 (process manager)
sudo npm install -g pm2

# Start application
pm2 start dist/main.js --name "ruumly-backend"
pm2 startup
pm2 save
```

### 4. Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo tee /etc/nginx/sites-available/ruumly-backend > /dev/null <<EOF
upstream ruumly_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name api.ruumly.com;

    location / {
        proxy_pass http://ruumly_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/ruumly-backend /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d api.ruumly.com

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Update Nginx config
sudo certbot install --nginx -d api.ruumly.com
```

## AWS RDS Database Setup

### Create RDS Instance
1. Go to AWS RDS Console
2. Create DB Instance
   - Engine: MySQL 8.0
   - Instance Class: db.t3.micro (minimum)
   - Storage: 20 GB
   - Multi-AZ: Enabled (for production)
   - Backup retention: 7 days

### Connect and Initialize
```bash
# Get endpoint from AWS Console
mysql -h <rds-endpoint> -u admin -p

# Create database and user
CREATE DATABASE ruumly_prod;
CREATE USER 'ruumly_user'@'%' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON ruumly_prod.* TO 'ruumly_user'@'%';
FLUSH PRIVILEGES;
```

## CI/CD Pipeline (GitHub Actions)

### Create Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to AWS EC2
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST << 'EOF'
            cd /home/app/ruumly-backend
            git pull origin main
            npm install --production
            npm run build
            pm2 restart ruumly-backend
          EOF
```

## Kubernetes Deployment

### Create Deployment Manifest
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ruumly-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ruumly-backend
  template:
    metadata:
      labels:
        app: ruumly-backend
    spec:
      containers:
      - name: ruumly-backend
        image: your-registry/ruumly-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: host
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        livenessProbe:
          httpGet:
            path: /api/health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: ruumly-backend-service
spec:
  selector:
    app: ruumly-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Deploy to Kubernetes
```bash
# Create secrets
kubectl create secret generic db-credentials \
  --from-literal=host=<db-host> \
  --from-literal=username=<username> \
  --from-literal=password=<password>

# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs <pod-name>
```

## Monitoring & Logging

### PM2 Monitoring
```bash
# Install PM2 Plus
pm2 plus

# Monitor
pm2 monit
```

### CloudWatch Logs (AWS)
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/aws-cloudwatch/downloads/latest/awslogger/awslogs-agent-setup.py

# Configure
python3 awslogs-agent-setup.py -n -r us-east-1
```

### Health Check Monitoring
```bash
# Setup cron job
0 */1 * * * curl -f http://localhost:3000/api/health || systemctl restart ruumly-backend
```

## Performance Optimization

### Enable Gzip Compression
```typescript
// src/main.ts
import * as compression from 'compression';
app.use(compression());
```

### Database Connection Pooling
Already configured in `env.config.ts`:
```env
DB_POOL_MAX=20
DB_POOL_MIN=5
```

### Redis Caching (Optional)
```bash
npm install @nestjs/cache-manager redis cache-manager-redis-store

# In env.config.ts
cache: {
  store: 'redis',
  host: 'localhost',
  port: 6379,
}
```

## Rollback Plan

### Quick Rollback
```bash
# Using PM2
pm2 restart ruumly-backend

# With Git
git revert <commit-hash>
npm run build
pm2 restart ruumly-backend
```

### Database Rollback
```bash
# Backup existing database
mysqldump -h <host> -u <user> -p <database> > backup.sql

# Execute migration rollback if needed
npx sequelize-cli db:migrate:undo
```

## Security Hardening

1. **Firewall Configuration**
   ```bash
   sudo ufw enable
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

2. **Update Dependencies**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

3. **Regular Backups**
   ```bash
   # Daily database backup
   0 2 * * * mysqldump -h <host> -u <user> -p<password> <db> | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
   ```

4. **Log Rotation**
   ```bash
   # Using logrotate
   sudo tee /etc/logrotate.d/ruumly-backend > /dev/null <<EOF
   /var/log/ruumly-backend/*.log {
       daily
       rotate 7
       compress
       missingok
       notifempty
   }
   EOF
   ```

## Post-Deployment

- [ ] Verify API is responding
- [ ] Check health endpoints
- [ ] Test authentication flow
- [ ] Monitor error logs
- [ ] Load test if needed
- [ ] Update DNS records
- [ ] Notify team of deployment
- [ ] Document any changes

## Support & Troubleshooting

### Check Application Status
```bash
pm2 status
pm2 logs ruumly-backend
```

### Restart Application
```bash
pm2 restart ruumly-backend
```

### Clear Logs
```bash
pm2 flush
```

### Debug Production
```bash
NODE_ENV=production npm run start:debug
```

---

For more help, refer to individual tool documentation:
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [MySQL Docs](https://dev.mysql.com/doc/)
