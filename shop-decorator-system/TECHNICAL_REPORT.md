# Shop-Decorator-System 技术报告

## 项目概述

**项目名称**: Shop-Decorator-System (电商店铺装修管理系统)
**开发时间**: 2025年
**项目定位**: 一个基于 H5-Dooring 可视化编辑器的电商店铺装修设计管理平台

### 核心价值
- 为电商运营人员提供可视化的店铺装修工具
- 支持模板复用和共享，提高设计效率
- 完整的设计方案管理和版本控制
- 无需编程基础即可设计专业的H5页面

---

## 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | 3.3+ | 渐进式JavaScript框架，使用Composition API |
| **Element Plus** | 2.4+ | 基于Vue 3的UI组件库 |
| **Pinia** | 2.1+ | Vue 3官方推荐的状态管理库 |
| **Vue Router** | 4.x | 单页面应用路由管理 |
| **Axios** | 1.x | HTTP客户端，用于API请求 |
| **Vite** | 4.x | 下一代前端构建工具 |

**前端项目结构**:
```
frontend/
├── src/
│   ├── api/              # API接口封装
│   ├── components/       # 可复用组件
│   ├── store/            # Pinia状态管理
│   ├── views/            # 页面组件
│   ├── router/           # 路由配置
│   ├── utils/            # 工具函数
│   └── App.vue           # 根组件
└── package.json
```

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | 16+ | JavaScript运行时环境 |
| **Express** | 4.18+ | Web应用框架 |
| **MySQL** | 8.0+ | 关系型数据库 |
| **mysql2** | 3.x | MySQL客户端（支持Promise） |
| **bcryptjs** | 2.4+ | 密码加密 |
| **jsonwebtoken** | 9.0+ | JWT身份认证 |
| **Multer** | 1.4+ | 文件上传中间件 |
| **dotenv** | 16.x | 环境变量管理 |

**后端项目结构**:
```
backend/
├── src/
│   ├── controllers/      # 控制器层（业务逻辑）
│   ├── models/           # 数据模型层
│   ├── routes/           # 路由层
│   ├── middleware/       # 中间件
│   ├── utils/            # 工具函数
│   ├── config/           # 配置文件
│   └── app.js            # 应用入口
├── uploads/              # 文件上传目录
└── package.json
```

### 第三方集成

| 集成项目 | 用途 |
|---------|------|
| **H5-Dooring** | 开源可视化编辑器，提供拖拽式页面设计能力 |
| **iframe + postMessage** | 跨框架通信方案，连接Vue 3应用与React编辑器 |

---

## 数据库设计

### ER 关系图

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   users     │         │  templates   │         │   designs   │
│─────────────│         │──────────────│         │─────────────│
│ id (PK)     │────┐    │ id (PK)      │    ┌────│ id (PK)     │
│ username    │    │    │ name         │    │    │ name        │
│ email       │    │    │ description  │    │    │ description │
│ password    │    │    │ content      │    │    │ content     │
│ role        │    │    │ thumbnail    │    │    │ template_id │
│ created_at  │    │    │ is_public    │    │    │ user_id (FK)│
│ updated_at  │    │    │ user_id (FK) │────┘    │ created_at  │
└─────────────┘    │    │ created_at   │         │ updated_at  │
                   │    │ updated_at   │         └─────────────┘
                   │    └──────────────┘                │
                   │                                     │
                   │    ┌──────────────────┐            │
                   └────│ design_versions  │────────────┘
                        │──────────────────│
                        │ id (PK)          │
                        │ design_id (FK)   │
                        │ version_number   │
                        │ content          │
                        │ description      │
                        │ created_by (FK)  │
                        │ created_at       │
                        └──────────────────┘
```

### 数据表详细设计

#### 1. users (用户表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 邮箱 |
| password | VARCHAR(255) | NOT NULL | 密码（bcrypt加密） |
| role | ENUM('user', 'admin') | DEFAULT 'user' | 用户角色 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- `idx_username` (username)
- `idx_email` (email)

#### 2. templates (模板表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 模板ID |
| name | VARCHAR(100) | NOT NULL | 模板名称 |
| description | TEXT | | 模板描述 |
| content | LONGTEXT | | 模板内容（JSON） |
| thumbnail | VARCHAR(255) | | 缩略图URL |
| is_public | TINYINT(1) | DEFAULT 0 | 是否公开（0-私有，1-公开） |
| user_id | INT | FK, NOT NULL | 创建者ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**外键**:
- `user_id` → `users(id)` ON DELETE CASCADE

**索引**:
- `idx_user_id` (user_id)
- `idx_is_public` (is_public)

#### 3. designs (设计方案表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 方案ID |
| name | VARCHAR(100) | NOT NULL | 方案名称 |
| description | TEXT | | 方案描述 |
| content | LONGTEXT | | 方案内容（JSON） |
| template_id | INT | FK | 基于的模板ID |
| user_id | INT | FK, NOT NULL | 创建者ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**外键**:
- `template_id` → `templates(id)` ON DELETE SET NULL
- `user_id` → `users(id)` ON DELETE CASCADE

**索引**:
- `idx_user_id` (user_id)
- `idx_template_id` (template_id)

#### 4. design_versions (版本历史表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 版本ID |
| design_id | INT | FK, NOT NULL | 关联的设计方案ID |
| version_number | INT | NOT NULL | 版本号 |
| content | LONGTEXT | NOT NULL | 版本内容（JSON） |
| description | VARCHAR(255) | | 版本描述 |
| created_by | INT | FK, NOT NULL | 创建者ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**外键**:
- `design_id` → `designs(id)` ON DELETE CASCADE
- `created_by` → `users(id)` ON DELETE CASCADE

**索引**:
- `idx_design_id` (design_id)
- `idx_created_at` (created_at)

**唯一约束**:
- `unique_design_version` (design_id, version_number)

---

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户浏览器                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        Vue 3 前端应用 (Port 3000)                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   登录页    │  │   模板浏览   │  │  我的方案   │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │          编辑器页面 (Editor.vue)                  │ │  │
│  │  │                                                    │ │  │
│  │  │  ┌──────────────────────────────────────────────┐│ │  │
│  │  │  │  iframe: H5-Dooring 编辑器 (Port 8000)       ││ │  │
│  │  │  │                                                ││ │  │
│  │  │  │  [React 编辑器 - 拖拽式设计]                 ││ │  │
│  │  │  └──────────────────────────────────────────────┘│ │  │
│  │  │                                                    │ │  │
│  │  │  EditorBridge (postMessage 通信)                  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕ HTTP/AJAX                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │       Express 后端 API (Port 5000)                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │  │
│  │  │ 认证模块 │  │ 模板管理 │  │ 设计管理 │             │  │
│  │  └──────────┘  └──────────┘  └──────────┘             │  │
│  │  ┌──────────┐  ┌──────────┐                            │  │
│  │  │ 版本控制 │  │ 文件上传 │                            │  │
│  │  └──────────┘  └──────────┘                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕ MySQL Driver                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             MySQL 数据库 (Port 3306)                   │  │
│  │  [users] [templates] [designs] [design_versions]      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 跨框架通信方案

由于主应用使用 Vue 3，而 H5-Dooring 编辑器使用 React，我们采用 **iframe + postMessage** 通信机制：

```javascript
// Vue 3 端 (EditorBridge.js)
class EditorBridge {
  send(type, data) {
    iframe.contentWindow.postMessage({ type, data }, origin)
  }

  on(type, callback) {
    // 监听来自 iframe 的消息
  }
}

// React 端 (ParentBridge.ts)
class ParentBridge {
  send(type, data) {
    window.parent.postMessage({ type, data }, parentOrigin)
  }

  on(type, callback) {
    // 监听来自父窗口的消息
  }
}
```

**消息类型**:
- `LOAD_DATA`: 加载设计数据到编辑器
- `GET_DATA`: 获取编辑器当前数据
- `CLEAR`: 清空编辑器
- `EDITOR_READY`: 编辑器加载完成
- `DATA_CHANGED`: 数据已修改
- `SAVE_REQUEST`: 编辑器请求保存

---

## 核心功能实现

### 1. 用户认证系统

#### 注册功能
- **密码加密**: 使用 bcryptjs 进行密码哈希 (salt rounds: 10)
- **唯一性校验**: 用户名和邮箱必须唯一
- **默认角色**: 新用户默认角色为 `user`

**实现文件**:
- 后端: `backend/src/controllers/authController.js`
- 前端: `frontend/src/views/Register.vue`

#### 登录功能
- **JWT 认证**: 登录成功返回 JWT token
- **Token 存储**: 前端使用 Pinia store 持久化存储
- **自动携带**: Axios 拦截器自动在请求头添加 token

**JWT payload**:
```javascript
{
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role
}
```

**实现文件**:
- 后端: `backend/src/controllers/authController.js`
- 前端: `frontend/src/views/Login.vue`
- Store: `frontend/src/store/user.js`

#### 权限中间件
```javascript
// backend/src/middleware/auth.js
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return error(res, '未授权', 401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    error(res, 'Token无效', 401)
  }
}
```

### 2. 模板管理系统

#### 模板浏览
- **公共模板**: 所有用户可查看 `is_public = 1` 的模板
- **私有模板**: 管理员可创建私有模板，仅自己可见
- **模板预览**: 支持缩略图展示
- **基于模板创建**: 点击模板可基于该模板创建新设计

**API**:
```
GET /api/templates?isPublic=true  # 获取公共模板
GET /api/templates/:id            # 获取模板详情
POST /api/templates               # 创建模板（需认证）
PUT /api/templates/:id            # 更新模板（需认证）
DELETE /api/templates/:id         # 删除模板（需认证）
```

**实现文件**:
- 后端: `backend/src/controllers/templateController.js`
- 前端: `frontend/src/views/Templates.vue`

#### 模板权限控制
- 普通用户: 只能查看公共模板
- 管理员:
  - 可创建公共/私有模板
  - 可管理自己创建的所有模板
  - 公共模板对所有用户可见

### 3. 可视化编辑器集成

#### H5-Dooring 编辑器
- **组件库**:
  - 基础组件: Text, Image, Form, Header, Icon, List, etc.
  - 媒体组件: Video, Audio, Map, Calendar
  - 可视化组件: Chart, Line, Pie, Area, XProgress
  - 电商组件: CardLabel, Coupons, List, Tab, ZhuanLan

- **编辑能力**:
  - 拖拽添加组件
  - 可视化配置属性
  - 实时预览
  - 响应式设计

#### 编辑器通信桥接

**加载数据到编辑器**:
```javascript
// frontend/src/views/Editor.vue
bridge.loadData(designData)
```

**从编辑器获取数据**:
```javascript
const data = await bridge.getData()
```

**监听数据变化**:
```javascript
bridge.on(MESSAGE_TYPES.DATA_CHANGED, () => {
  hasUnsavedChanges.value = true
})
```

**实现文件**:
- Vue端桥接: `frontend/src/utils/editorBridge.js`
- React端桥接: `src/utils/parentBridge.ts`, `src/pages/editor/EditorBridge.tsx`
- 编辑器页面: `frontend/src/views/Editor.vue`

### 4. 设计方案管理

#### 创建/编辑方案
- **新建方案**: 空白创建或基于模板创建
- **保存方案**: 自动保存到数据库，支持更新
- **方案命名**: 可自定义方案名称和描述

**数据流**:
```
用户编辑 → EditorBridge → getData() →
保存API → 数据库 → 自动创建版本快照
```

#### 方案列表
- **个人方案**: 展示用户创建的所有方案
- **排序**: 按更新时间倒序
- **快捷操作**: 编辑、预览、导出、删除

**实现文件**:
- 后端: `backend/src/controllers/designController.js`
- 前端: `frontend/src/views/MyDesigns.vue`

### 5. 文件上传系统

#### 图片上传
- **上传方式**:
  - 拖拽上传
  - 点击选择上传
- **文件验证**:
  - 支持格式: image/*
  - 最大大小: 5MB
- **存储路径**:
  - 图片: `backend/uploads/images/`
  - 缩略图: `backend/uploads/thumbnails/`

#### 图片选择器组件
- **双Tab界面**:
  - 图片库: 展示已上传的图片
  - 上传: 上传新图片
- **选择模式**: 支持单选/多选
- **图片管理**: 查看、选择、删除

**实现文件**:
- 后端中间件: `backend/src/middleware/upload.js`
- 后端控制器: `backend/src/controllers/uploadController.js`
- 前端组件: `frontend/src/components/ImagePicker.vue`

### 6. 预览和导出

#### 移动端预览
- **设备框架**: 模拟iPhone外观 (375px × 667px)
- **实时预览**: 通过iframe嵌入H5-Dooring预览页
- **独立窗口**: 新窗口打开预览

**实现文件**:
- `frontend/src/views/Preview.vue`

#### 导出功能

**JSON导出**:
- 导出完整的设计数据（JSON格式）
- 可用于备份或迁移
- 支持重新导入

**HTML导出**:
- 生成独立的HTML文件
- 包含所有组件和样式
- 可直接部署到服务器

**HTML生成器**:
```javascript
// backend/src/utils/htmlGenerator.js
function generateHTML(designData) {
  // 解析组件数据
  // 生成HTML结构
  // 注入样式和脚本
  return completeHTMLDocument
}
```

**实现文件**:
- 后端: `backend/src/controllers/designController.js`
- HTML生成: `backend/src/utils/htmlGenerator.js`

### 7. 版本历史系统 ⭐

#### 自动版本创建
- **触发时机**: 每次更新设计方案时
- **版本号**: 自动递增 (1, 2, 3, ...)
- **快照内容**: 保存完整的设计JSON数据
- **版本描述**: 默认"自动保存"，可自定义

**实现逻辑**:
```javascript
// 更新设计前，先创建版本
await DesignVersion.createVersion({
  designId: id,
  content: design.content,  // 保存当前版本
  description: '自动保存',
  createdBy: userId
})

// 然后更新设计
await Design.update(id, newContent, userId)
```

#### 版本列表展示
- **时间线形式**: Element Plus Timeline 组件
- **显示信息**: 版本号、描述、创建者、创建时间
- **操作按钮**: 恢复、查看详情、删除

#### 版本恢复
- **一键恢复**: 点击"恢复此版本"
- **自动刷新**: 恢复后编辑器自动加载历史数据
- **无损恢复**: 恢复操作本身也会创建新版本

#### 版本详情
- **嵌套对话框**: 在版本历史对话框中嵌套详情对话框
- **完整信息**: 版本元数据 + JSON内容预览
- **语法高亮**: JSON格式化显示

**API**:
```
GET /api/designs/:designId/versions       # 获取版本列表
GET /api/versions/:versionId              # 获取版本详情
POST /api/designs/:designId/versions      # 手动创建版本
POST /api/versions/:versionId/restore     # 恢复版本
DELETE /api/versions/:versionId           # 删除版本
```

**实现文件**:
- 后端Model: `backend/src/models/DesignVersion.js`
- 后端Controller: `backend/src/controllers/versionController.js`
- 后端Routes: `backend/src/routes/version.js`
- 前端API: `frontend/src/api/version.js`
- 前端组件: `frontend/src/components/VersionHistory.vue`

---

## API 接口文档

### 认证接口

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

Response: {
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

Response: {
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user"
    }
  }
}
```

### 模板接口

#### 获取模板列表
```http
GET /api/templates?isPublic=true
Authorization: Bearer {token}

Response: {
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "简约电商模板",
      "description": "简约风格的电商店铺模板",
      "thumbnail": "/uploads/thumbnails/xxx.png",
      "is_public": 1,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 创建模板
```http
POST /api/templates
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "我的模板",
  "description": "模板描述",
  "content": {...},
  "thumbnail": "/uploads/thumbnails/xxx.png",
  "isPublic": true
}
```

### 设计方案接口

#### 获取我的方案
```http
GET /api/designs
Authorization: Bearer {token}

Response: {
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "店铺首页",
      "description": "双十一活动页",
      "content": {...},
      "template_id": 1,
      "templateName": "简约电商模板",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-02T00:00:00.000Z"
    }
  ]
}
```

#### 创建方案
```http
POST /api/designs
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "店铺首页",
  "description": "描述",
  "content": {...},
  "templateId": 1
}
```

#### 更新方案（自动创建版本）
```http
PUT /api/designs/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "店铺首页",
  "description": "描述",
  "content": {...},
  "createVersion": true,  // 是否创建版本（默认true）
  "versionDescription": "修改了Banner"
}
```

#### 导出为JSON
```http
GET /api/designs/:id/export
Authorization: Bearer {token}

Response: 直接下载 JSON 文件
```

#### 导出为HTML
```http
GET /api/designs/:id/export-html
Authorization: Bearer {token}

Response: 直接下载 HTML 文件
```

### 版本历史接口

#### 获取版本列表
```http
GET /api/designs/:designId/versions
Authorization: Bearer {token}

Response: {
  "code": 200,
  "data": [
    {
      "id": 10,
      "design_id": 5,
      "version_number": 3,
      "description": "修改了Banner",
      "created_at": "2025-01-02T10:30:00.000Z",
      "created_by_name": "admin"
    },
    {
      "id": 9,
      "design_id": 5,
      "version_number": 2,
      "description": "自动保存",
      "created_at": "2025-01-02T09:15:00.000Z",
      "created_by_name": "admin"
    }
  ]
}
```

#### 获取版本详情
```http
GET /api/versions/:versionId
Authorization: Bearer {token}

Response: {
  "code": 200,
  "data": {
    "id": 10,
    "design_id": 5,
    "version_number": 3,
    "content": {...},  // 完整的设计JSON
    "description": "修改了Banner",
    "created_at": "2025-01-02T10:30:00.000Z",
    "created_by_name": "admin"
  }
}
```

#### 恢复版本
```http
POST /api/versions/:versionId/restore
Authorization: Bearer {token}

Response: {
  "code": 200,
  "message": "恢复成功",
  "data": {
    "designId": 5,
    "versionNumber": 3
  }
}
```

#### 删除版本
```http
DELETE /api/versions/:versionId
Authorization: Bearer {token}

Response: {
  "code": 200,
  "message": "版本删除成功"
}
```

### 文件上传接口

#### 上传单个文件
```http
POST /api/upload/single?type=images
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary]

Response: {
  "code": 200,
  "data": {
    "filename": "1234567890-randomid.png",
    "originalname": "photo.png",
    "url": "/uploads/images/1234567890-randomid.png",
    "size": 102400,
    "mimetype": "image/png"
  }
}
```

#### 获取图片列表
```http
GET /api/upload/images
Authorization: Bearer {token}

Response: {
  "code": 200,
  "data": [
    {
      "filename": "1234567890-randomid.png",
      "url": "/uploads/images/1234567890-randomid.png",
      "size": 102400,
      "mtime": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 安全性设计

### 1. 密码安全
- **加密算法**: bcryptjs
- **Salt Rounds**: 10
- **不可逆**: 密码哈希后无法还原原文

### 2. 身份认证
- **JWT Token**: 有状态的会话管理
- **Token过期**: 可配置过期时间
- **HTTPS**: 生产环境强制使用HTTPS

### 3. 权限控制
- **认证中间件**: 所有敏感API需要验证token
- **用户隔离**: 用户只能访问自己的数据
- **角色权限**: admin 拥有额外权限

### 4. SQL注入防护
- **参数化查询**: 使用 mysql2 的参数绑定
- **输入验证**: 前后端双重验证

```javascript
// 安全的参数化查询
await db.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
)
```

### 5. XSS防护
- **内容转义**: Element Plus 自动转义
- **CSP**: 可配置内容安全策略

### 6. 文件上传安全
- **类型验证**: 只允许图片格式
- **大小限制**: 最大5MB
- **随机命名**: 防止文件名冲突和路径遍历

---

## 性能优化

### 前端优化

1. **路由懒加载**
```javascript
{
  path: '/editor/:id?',
  component: () => import('@/views/Editor.vue')
}
```

2. **组件按需加载**
- Element Plus 按需导入
- 减小打包体积

3. **图片懒加载**
- 使用 Element Plus Image 组件
- 支持懒加载和占位符

4. **状态持久化**
- Pinia 状态持久化到 localStorage
- 减少重复请求

### 后端优化

1. **数据库索引**
- 所有外键字段建立索引
- 常用查询字段建立索引

2. **连接池**
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'shop_decorator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
```

3. **CORS优化**
- 配置特定来源
- 减少预检请求

---

## 部署方案

### 开发环境

#### 启动所有服务
```bash
cd shop-decorator-system
./start-all.sh
```

这会启动:
- H5-Dooring编辑器: http://localhost:8000
- 后端API: http://localhost:5000
- 前端应用: http://localhost:3000

#### 停止所有服务
```bash
./stop-all.sh
```

### 生产环境

#### 前端构建
```bash
cd frontend
npm run build
# 输出到 dist/ 目录
```

#### 后端部署
```bash
cd backend
npm install --production
NODE_ENV=production node src/app.js
```

#### Nginx配置示例
```nginx
server {
  listen 80;
  server_name your-domain.com;

  # 前端静态文件
  location / {
    root /var/www/shop-decorator/frontend/dist;
    try_files $uri $uri/ /index.html;
  }

  # 后端API代理
  location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # H5-Dooring编辑器代理
  location /editor {
    proxy_pass http://localhost:8000;
  }

  # 文件上传目录
  location /uploads {
    alias /var/www/shop-decorator/backend/uploads;
  }
}
```

#### 数据库备份
```bash
# 备份
mysqldump -u root -p shop_decorator > backup_$(date +%Y%m%d).sql

# 恢复
mysql -u root -p shop_decorator < backup_20250101.sql
```

---

## 项目特色

### 1. 跨框架集成
- 成功将 Vue 3 应用与 React 编辑器集成
- 使用 iframe + postMessage 实现无缝通信
- 保持两个框架的独立性和各自优势

### 2. 完整的版本控制
- 自动版本快照
- 时间线展示
- 一键恢复
- 无损版本管理

### 3. 灵活的模板系统
- 公共模板共享机制
- 私有模板保护
- 基于模板快速创建

### 4. 开箱即用
- 完整的用户系统
- 文件上传管理
- 多格式导出
- 移动端预览

### 5. 企业级代码质量
- MVC架构清晰
- RESTful API设计
- 统一错误处理
- 完善的权限控制

---

## 未来规划

### 短期优化 (1-2个月)
1. ✅ 版本历史功能（已完成）
2. 🔲 版本对比功能
3. 🔲 组件收藏夹
4. 🔲 设计方案分类标签
5. 🔲 批量操作（批量删除、批量导出）

### 中期规划 (3-6个月)
1. 🔲 实时协同编辑
2. 🔲 评论和批注系统
3. 🔲 数据分析仪表板
4. 🔲 H5页面埋点统计
5. 🔲 A/B测试功能

### 长期规划 (6-12个月)
1. 🔲 多端适配（PC、Pad、Mobile）
2. 🔲 国际化支持
3. 🔲 插件市场
4. 🔲 AI辅助设计
5. 🔲 云端资源库

---

## 技术亮点总结

### 架构设计
✨ **前后端分离**: Vue 3 + Express，职责清晰
✨ **跨框架集成**: Vue ↔ React 无缝通信
✨ **分层架构**: Controller-Model-Route 三层结构
✨ **RESTful API**: 标准化接口设计

### 功能实现
✨ **版本控制**: 自动快照 + 手动版本 + 一键恢复
✨ **权限系统**: JWT + 角色控制 + 数据隔离
✨ **文件管理**: 上传 + 预览 + 图片库
✨ **模板共享**: 公共/私有模板分离

### 安全性
✨ **密码加密**: bcryptjs 哈希
✨ **SQL防注入**: 参数化查询
✨ **XSS防护**: 内容转义
✨ **认证授权**: JWT + 中间件

### 用户体验
✨ **可视化编辑**: 拖拽式设计，所见即所得
✨ **实时预览**: 移动端设备框架预览
✨ **多格式导出**: JSON + HTML
✨ **版本时间线**: 直观的历史版本展示

---

## 开发统计

### 代码量统计
- **前端**: ~2,500 行 (Vue 3 + JavaScript)
- **后端**: ~1,800 行 (Node.js + Express)
- **数据库**: ~150 行 (SQL)
- **文档**: ~1,000 行 (Markdown)

### 文件数量
- **前端组件**: 8个 Vue组件
- **后端控制器**: 5个 Controller
- **数据模型**: 4个 Model
- **API路由**: 5个 Route文件

### 功能模块
- **核心功能**: 7个 (认证、模板、设计、编辑器、上传、预览、版本)
- **数据表**: 4个 (users, templates, designs, design_versions)
- **API接口**: 25+ 个

---

## 结语

Shop-Decorator-System 是一个功能完整、架构清晰、易于扩展的电商店铺装修管理平台。通过集成 H5-Dooring 可视化编辑器，降低了H5页面设计的门槛，使非技术人员也能快速创建专业的店铺页面。

系统采用现代化的技术栈（Vue 3 + Express + MySQL），遵循前后端分离、MVC分层的架构设计，代码质量高、可维护性强。特别是版本控制系统的引入，为设计工作提供了强大的版本管理能力，避免了误操作导致的数据丢失。

未来，系统将继续完善协同编辑、数据分析等企业级功能，打造更加完善的电商设计工具链。

---

**项目仓库**: https://github.com/emily135135/h5-Dooring
**开发分支**: `claude/setup-shop-decorator-system-01WarqmZCSBkC2c6yjr8hyfP`
**文档版本**: v1.0
**最后更新**: 2025年
