# 版本历史功能使用指南

## 功能概述

版本历史功能允许用户：
- 自动保存设计方案的历史版本
- 查看所有历史版本
- 恢复到任意历史版本
- 删除不需要的版本
- 查看版本详细内容

## 数据库更新

### 方式一：使用迁移脚本（推荐）

如果数据库已经存在，运行迁移脚本：

```bash
mysql -u root -p < shop-decorator-system/database/add_version_history.sql
```

### 方式二：重新初始化数据库

如果是全新安装，直接运行完整的初始化脚本：

```bash
mysql -u root -p < shop-decorator-system/database/init.sql
```

### 方式三：手动执行SQL

登录MySQL后手动执行：

```sql
USE shop_decorator;

CREATE TABLE IF NOT EXISTS design_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  design_id INT NOT NULL COMMENT '关联的设计方案ID',
  version_number INT NOT NULL COMMENT '版本号',
  content LONGTEXT NOT NULL COMMENT '版本内容（JSON格式）',
  description VARCHAR(255) DEFAULT NULL COMMENT '版本描述',
  created_by INT NOT NULL COMMENT '创建者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_design_id (design_id),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_design_version (design_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设计方案版本历史表';
```

## 功能使用

### 1. 自动版本创建

每次保存设计方案时，系统会自动创建一个版本快照：

- 在编辑器页面点击"保存"按钮
- 系统会先保存当前版本到历史记录
- 然后更新设计方案内容
- 版本描述默认为"自动保存"

### 2. 查看版本历史

#### 方式一：在编辑器页面

1. 打开设计方案编辑器
2. 点击顶部的"版本历史"按钮
3. 查看时间线形式的版本列表

#### 方式二：在我的方案页面

1. 在"我的装修方案"列表中
2. 点击某个方案的"版本历史"按钮
3. 查看该方案的所有版本

### 3. 恢复历史版本

1. 打开版本历史对话框
2. 找到要恢复的版本
3. 点击"恢复此版本"按钮
4. 确认后，设计方案会恢复到该版本的状态
5. 编辑器会自动刷新显示恢复后的内容

### 4. 查看版本详情

1. 在版本历史列表中
2. 点击"查看详情"按钮
3. 可以看到：
   - 版本号
   - 创建者
   - 创建时间
   - 版本描述
   - 完整的JSON内容

### 5. 删除版本

1. 在版本历史列表中
2. 点击"删除"按钮
3. 确认删除
4. 注意：如果只剩一个版本，删除按钮会被禁用

## API 接口

### 获取版本列表

```http
GET /api/designs/:designId/versions
Authorization: Bearer {token}
```

### 获取版本详情

```http
GET /api/versions/:versionId
Authorization: Bearer {token}
```

### 创建版本（手动）

```http
POST /api/designs/:designId/versions
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": {...},
  "description": "手动保存的版本"
}
```

### 恢复版本

```http
POST /api/versions/:versionId/restore
Authorization: Bearer {token}
```

### 删除版本

```http
DELETE /api/versions/:versionId
Authorization: Bearer {token}
```

## 技术实现细节

### 后端

1. **Model**: `DesignVersion.js`
   - 版本创建和管理逻辑
   - 自动递增版本号
   - 权限验证

2. **Controller**: `versionController.js`
   - RESTful API接口
   - 错误处理
   - 用户权限校验

3. **Routes**: `version.js`
   - 路由配置
   - 认证中间件

4. **自动版本创建**: 在 `designController.js` 的 `updateDesign` 方法中
   - 默认每次更新都创建版本
   - 可通过 `createVersion: false` 参数禁用

### 前端

1. **API 层**: `api/version.js`
   - 封装所有版本相关的API调用

2. **组件**: `VersionHistory.vue`
   - 时间线形式展示版本列表
   - 版本详情对话框
   - 恢复和删除操作

3. **集成页面**:
   - `Editor.vue`: 编辑器页面的版本历史
   - `MyDesigns.vue`: 方案列表页面的版本历史

## 注意事项

1. **版本数量**: 版本会随着保存次数增加，建议定期清理不需要的版本
2. **存储空间**: 每个版本都会保存完整的设计内容，注意数据库存储空间
3. **权限控制**: 只能查看和恢复自己创建的设计方案的版本
4. **删除限制**: 至少保留一个版本，不能删除最后一个版本
5. **版本号**: 版本号从1开始自动递增，删除版本不会影响版本号的连续性

## 测试步骤

1. 启动后端服务：
   ```bash
   cd shop-decorator-system/backend
   npm run dev
   ```

2. 启动前端服务：
   ```bash
   cd shop-decorator-system/frontend
   npm run dev
   ```

3. 测试流程：
   - 登录系统
   - 创建或编辑一个设计方案
   - 多次修改并保存，观察版本创建
   - 点击"版本历史"查看版本列表
   - 尝试恢复到某个历史版本
   - 查看版本详情
   - 删除某个版本

## 常见问题

**Q: 为什么看不到版本历史按钮？**
A: 版本历史功能只在已保存的设计方案中可用，新建未保存的方案不显示该按钮。

**Q: 恢复版本后原来的内容会丢失吗？**
A: 不会。恢复操作本身也会创建一个新版本，原来的内容仍然保存在版本历史中。

**Q: 可以禁用自动版本创建吗？**
A: 可以。在调用更新API时，传递 `createVersion: false` 参数即可。

**Q: 版本会自动清理吗？**
A: 目前不会自动清理，需要手动删除不需要的版本。可以考虑后续添加版本保留策略。

## 未来改进方向

1. 版本对比功能：显示两个版本之间的差异
2. 版本标签：为重要版本添加标签
3. 自动清理策略：只保留最近N个版本
4. 版本压缩：压缩存储以节省空间
5. 版本合并：合并多个小改动为一个版本
