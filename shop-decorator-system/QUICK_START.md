# 快速开始指南

## 项目结构

```
shop-decorator-system/
├── frontend/                 # 前端项目（Vue 3）
│   ├── src/
│   │   ├── api/             # API 接口
│   │   │   ├── auth.js      # 认证接口
│   │   │   ├── template.js  # 模板接口
│   │   │   └── design.js    # 装修方案接口
│   │   ├── components/      # 公共组件
│   │   ├── router/          # 路由配置
│   │   │   └── index.js
│   │   ├── store/           # 状态管理
│   │   │   └── user.js      # 用户状态
│   │   ├── utils/           # 工具函数
│   │   │   └── request.js   # HTTP 请求封装
│   │   ├── views/           # 页面组件
│   │   │   ├── Login.vue           # 登录页
│   │   │   ├── Register.vue        # 注册页
│   │   │   ├── Layout.vue          # 布局组件
│   │   │   ├── Templates.vue       # 模板中心
│   │   │   ├── MyDesigns.vue       # 我的方案
│   │   │   ├── AdminTemplates.vue  # 模板管理（管理员）
│   │   │   └── Editor.vue          # 装修编辑器
│   │   ├── App.vue          # 根组件
│   │   └── main.js          # 入口文件
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                  # 后端项目（Node.js + Express）
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   │   ├── authController.js      # 认证控制器
│   │   │   ├── templateController.js  # 模板控制器
│   │   │   └── designController.js    # 装修方案控制器
│   │   ├── models/          # 数据模型
│   │   │   ├── User.js      # 用户模型
│   │   │   ├── Template.js  # 模板模型
│   │   │   └── Design.js    # 装修方案模型
│   │   ├── routes/          # 路由
│   │   │   ├── auth.js      # 认证路由
│   │   │   ├── template.js  # 模板路由
│   │   │   └── design.js    # 装修方案路由
│   │   ├── middleware/      # 中间件
│   │   │   └── auth.js      # 认证中间件
│   │   ├── config/          # 配置
│   │   │   └── database.js  # 数据库配置
│   │   ├── utils/           # 工具函数
│   │   │   └── response.js  # 响应格式化
│   │   └── app.js           # 应用入口
│   ├── uploads/             # 上传文件目录
│   ├── package.json
│   └── .env.example         # 环境变量示例
│
├── database/                 # 数据库脚本
│   ├── init.sql             # 数据库初始化脚本
│   └── README.md            # 数据库说明
│
├── README.md                 # 项目说明
├── DEPLOYMENT.md             # 部署指南
├── H5_DOORING_INTEGRATION.md # H5-Dooring集成指南
└── .gitignore               # Git 忽略文件
```

## 5分钟快速启动

### 第一步：初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 导入数据库
mysql> source database/init.sql
mysql> exit
```

### 第二步：启动后端

```bash
cd backend

# 安装依赖
npm install

# 复制环境配置
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
# 修改 DB_PASSWORD 为你的 MySQL 密码

# 启动后端服务
npm run dev
```

后端启动成功后会显示：
```
✅ 数据库连接成功
🚀 服务器运行在 http://localhost:5000
```

### 第三步：启动前端

新开一个终端窗口：

```bash
cd frontend

# 安装依赖
npm install

# 启动前端服务
npm run dev
```

前端启动成功后会显示：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 第四步：访问系统

打开浏览器访问：http://localhost:3000

使用默认管理员账号登录：
- 用户名：admin
- 密码：admin123

## 功能演示

### 1. 用户注册和登录

- 访问登录页，可以注册新用户
- 使用 admin/admin123 登录获得管理员权限

### 2. 浏览模板（所有用户）

- 登录后进入模板中心
- 查看公共模板和私有模板
- 点击"使用模板"开始装修

### 3. 创建模板（仅管理员）

- 管理员登录后访问"模板管理"
- 点击"创建模板"
- 填写模板信息，选择公共/私有
- 公共模板会显示给所有用户

### 4. 装修编辑

- 使用模板或新建方案
- 在编辑器中设计页面（H5-Dooring待集成）
- 保存装修方案

### 5. 管理方案

- 访问"我的方案"
- 查看、编辑、删除装修方案
- 导出方案配置

## 主要功能特性

✅ **用户系统**
- 用户注册登录
- JWT 认证
- 角色权限管理（普通用户/管理员）

✅ **模板管理**
- 管理员创建模板
- 公共/私有模板设置
- 模板浏览和使用

✅ **装修方案**
- 基于模板创建方案
- 保存和管理方案
- 方案导出

✅ **权限控制**
- 公共模板对所有用户可见
- 私有模板仅创建者可见
- 管理员独享模板管理功能

## API 接口

### 认证接口
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/userinfo - 获取用户信息

### 模板接口
- GET /api/templates - 获取模板列表
- GET /api/templates/:id - 获取模板详情
- POST /api/templates - 创建模板（管理员）
- PUT /api/templates/:id - 更新模板（管理员）
- PATCH /api/templates/:id/visibility - 切换可见性（管理员）
- DELETE /api/templates/:id - 删除模板（管理员）

### 装修方案接口
- GET /api/designs - 获取我的方案列表
- GET /api/designs/:id - 获取方案详情
- POST /api/designs - 创建方案
- PUT /api/designs/:id - 更新方案
- DELETE /api/designs/:id - 删除方案
- GET /api/designs/:id/export - 导出方案

## 下一步开发

1. 集成 H5-Dooring 可视化编辑器
2. 实现实时预览功能
3. 添加更多电商组件
4. 实现页面导出为 HTML
5. 添加模板市场功能

## 常见问题

**Q: 数据库连接失败？**
A: 检查 backend/.env 中的数据库配置是否正确

**Q: 前端无法访问后端？**
A: 确保后端服务运行在 5000 端口，检查 CORS 配置

**Q: 登录后无法访问？**
A: 检查浏览器控制台，可能是 JWT token 问题

## 技术支持

如遇到问题，请查看：
- DEPLOYMENT.md - 详细部署文档
- H5_DOORING_INTEGRATION.md - 编辑器集成指南
- database/README.md - 数据库说明
