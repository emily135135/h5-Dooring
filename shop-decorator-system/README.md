# Shop Decorator System - 电商店铺装修管理系统

一个基于 Vue 3 + Express + MySQL 的电商店铺装修管理系统，集成 H5-Dooring 编辑器。

## 技术栈

### 前端
- Vue 3
- Element Plus
- H5-Dooring 编辑器

### 后端
- Node.js
- Express
- MySQL
- JWT 认证

## 功能模块

1. **用户管理**
   - 用户注册登录
   - 权限管理（管理员/普通用户）

2. **模板管理**
   - 模板浏览和选择
   - 公共/私有模板设置
   - 管理员模板上传

3. **装修编辑**
   - 集成 H5-Dooring 编辑器
   - 保存装修方案
   - 方案管理

4. **预览和导出**
   - 实时预览
   - 导出功能

## 项目结构

```
shop-decorator-system/
├── frontend/          # 前端项目
├── backend/           # 后端项目
├── database/          # 数据库脚本
└── README.md
```

## 快速开始

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 后端启动
```bash
cd backend
npm install
npm run dev
```

### 数据库配置
1. 创建 MySQL 数据库
2. 导入数据库脚本: `database/init.sql`
3. 配置后端环境变量: `backend/.env`

## 开发者
- 项目创建时间: 2025-11-15
