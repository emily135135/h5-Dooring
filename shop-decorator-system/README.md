# Shop Decorator System - 电商店铺装修管理系统

一个基于 Vue 3 + Express + MySQL 的电商店铺装修管理系统，已集成 H5-Dooring 可视化编辑器。

## ✨ 核心特性

### 🎨 H5-Dooring 编辑器集成
- ✅ 通过 iframe + postMessage 实现 React 编辑器与 Vue 应用的无缝集成
- ✅ 实时双向数据通信
- ✅ 数据自动保存和加载
- ✅ 未保存提醒功能

### 👥 用户系统
- ✅ 用户注册和登录
- ✅ JWT 身份认证
- ✅ 角色权限管理（管理员/普通用户）

### 📋 模板管理
- ✅ 管理员创建模板
- ✅ 公共/私有模板设置
- ✅ 公共模板对所有用户可见
- ✅ 模板浏览和选择

### 🎯 装修方案
- ✅ 基于模板创建方案
- ✅ 可视化编辑器设计
- ✅ 保存和管理方案
- ✅ 方案导出

## 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Element Plus** - Vue 3 组件库
- **Pinia** - Vue 状态管理
- **Vue Router** - 官方路由
- **Axios** - HTTP 客户端

### 编辑器
- **H5-Dooring** - React 可视化编辑器
- **iframe + postMessage** - 跨框架通信

### 后端
- **Node.js + Express** - 服务端框架
- **MySQL** - 关系型数据库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

## 快速开始

### 一键启动（推荐）

```bash
# 1. 初始化数据库
mysql -u root -p < database/init.sql

# 2. 配置后端环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，配置数据库密码

# 3. 一键启动所有服务
chmod +x start-all.sh
./start-all.sh
```

启动完成后访问：
- **前端应用**: http://localhost:3000
- **H5-Dooring 编辑器**: http://localhost:8000/editor
- **后端 API**: http://localhost:5000

默认管理员账号：`admin` / `admin123`

### 停止服务

```bash
./stop-all.sh
```

### 手动启动

详细启动步骤请参考：[QUICK_START.md](./QUICK_START.md)

## 项目结构

```
shop-decorator-system/
├── frontend/                 # Vue 3 前端应用
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理
│   │   ├── utils/           # 工具函数
│   │   │   ├── request.js   # HTTP 请求封装
│   │   │   └── editorBridge.js  # 编辑器通信桥接 ⭐
│   │   └── views/           # 页面组件
│   │       ├── Login.vue         # 登录
│   │       ├── Register.vue      # 注册
│   │       ├── Templates.vue     # 模板中心
│   │       ├── MyDesigns.vue     # 我的方案
│   │       ├── AdminTemplates.vue # 模板管理
│   │       └── Editor.vue        # 编辑器（集成 H5-Dooring）⭐
│   └── package.json
│
├── backend/                  # Express 后端服务
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middleware/      # 中间件
│   │   └── app.js           # 应用入口
│   └── package.json
│
├── database/                 # 数据库
│   ├── init.sql             # 初始化脚本
│   └── README.md
│
├── start-all.sh             # 一键启动脚本 ⭐
├── stop-all.sh              # 停止服务脚本 ⭐
├── QUICK_START.md           # 快速开始指南
├── DEPLOYMENT.md            # 部署文档
└── EDITOR_INTEGRATION_GUIDE.md  # 编辑器集成指南 ⭐
```

## 文档

- 📖 [快速开始指南](./QUICK_START.md) - 5分钟快速上手
- 🚀 [部署指南](./DEPLOYMENT.md) - 生产环境部署
- 🎨 [编辑器集成指南](./EDITOR_INTEGRATION_GUIDE.md) - H5-Dooring 集成详解 ⭐
- 💾 [数据库说明](./database/README.md) - 数据库结构和配置

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/userinfo` - 获取用户信息

### 模板
- `GET /api/templates` - 获取模板列表
- `POST /api/templates` - 创建模板（管理员）
- `PATCH /api/templates/:id/visibility` - 切换模板可见性（管理员）

### 装修方案
- `GET /api/designs` - 获取我的方案列表
- `POST /api/designs` - 创建方案
- `PUT /api/designs/:id` - 更新方案
- `GET /api/designs/:id/export` - 导出方案

## 使用流程

1. 登录系统（默认管理员：admin/admin123）
2. 管理员可在"模板管理"创建公共或私有模板
3. 用户在"模板中心"浏览和选择模板
4. 点击"使用模板"进入编辑器
5. 使用 H5-Dooring 可视化编辑器设计页面
6. 保存装修方案
7. 在"我的方案"中管理所有方案

## 开发计划

- [ ] 添加更多电商组件（商品卡片、购物车等）
- [ ] 实现实时预览功能
- [ ] 添加模板导出为 HTML
- [ ] 集成图片上传和管理
- [ ] 添加移动端预览
- [ ] 实现版本历史和回滚

## 常见问题

**Q: 编辑器一直显示"加载中"？**
- 确认 H5-Dooring 服务运行正常（访问 http://localhost:8000/editor）
- 检查浏览器控制台是否有跨域错误

**Q: 保存后数据丢失？**
- 检查后端 API 是否正常（http://localhost:5000/api/health）
- 确认数据库连接配置正确

更多问题请参考 [EDITOR_INTEGRATION_GUIDE.md](./EDITOR_INTEGRATION_GUIDE.md)

## 技术支持

- H5-Dooring 文档: https://github.com/MrXujiang/h5-Dooring

## 开发者

- 项目创建时间: 2025-11-15
- 编辑器集成时间: 2025-11-15
