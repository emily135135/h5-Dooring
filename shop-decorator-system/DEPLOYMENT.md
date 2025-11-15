# 部署指南

## 环境要求

- Node.js >= 16.x
- MySQL >= 5.7
- npm 或 yarn

## 本地开发环境搭建

### 1. 数据库配置

```bash
# 登录 MySQL
mysql -u root -p

# 导入数据库
source database/init.sql
```

### 2. 后端配置

```bash
cd backend

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，配置数据库连接信息
# vim .env

# 启动后端服务（开发模式）
npm run dev

# 或者生产模式
npm start
```

后端服务默认运行在: http://localhost:5000

### 3. 前端配置

```bash
cd frontend

# 安装依赖
npm install

# 启动前端服务（开发模式）
npm run dev

# 构建生产版本
npm run build
```

前端服务默认运行在: http://localhost:3000

## 环境变量配置

### 后端环境变量 (backend/.env)

```env
# 服务器配置
PORT=5000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shop_decorator

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# 上传配置
UPLOAD_PATH=./uploads
```

## 生产环境部署

### 使用 PM2 部署后端

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd backend
pm2 start src/app.js --name shop-decorator-backend

# 查看日志
pm2 logs shop-decorator-backend

# 重启应用
pm2 restart shop-decorator-backend
```

### 使用 Nginx 部署前端

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker 部署（可选）

### 创建 Dockerfile（后端）

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: shop_decorator
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: shop_decorator
    ports:
      - "5000:5000"

volumes:
  mysql_data:
```

## 测试账号

- 用户名: admin
- 密码: admin123
- 角色: 管理员

## 常见问题

### 数据库连接失败
- 检查 MySQL 是否正在运行
- 确认 .env 文件中的数据库配置是否正确
- 检查数据库用户权限

### 前端无法连接后端
- 确认后端服务是否正常运行
- 检查前端 vite.config.js 中的代理配置
- 确认防火墙设置

### JWT 认证失败
- 确认 JWT_SECRET 已正确配置
- 检查 token 是否已过期
- 清除浏览器缓存和 localStorage

## 性能优化建议

1. 使用 CDN 加速静态资源
2. 启用 gzip 压缩
3. 配置 MySQL 连接池
4. 使用 Redis 缓存热点数据
5. 前端代码分割和懒加载
