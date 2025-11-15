# H5-Dooring 编辑器集成完成指南

## 集成概述

已成功将 H5-Dooring 可视化编辑器集成到电商店铺装修管理系统中！

### 集成方案

采用 **iframe + postMessage** 通信方案：
- H5-Dooring 作为独立服务运行（React + UmiJS）
- shop-decorator-system 前端（Vue 3）通过 iframe 嵌入编辑器
- 使用 window.postMessage API 实现双向数据通信

### 技术架构

```
┌─────────────────────────────────────────────────┐
│  shop-decorator-system (Vue 3)                  │
│  ┌─────────────────────────────────────────┐   │
│  │  Editor.vue                              │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │  <iframe>                       │   │   │
│  │  │    H5-Dooring Editor            │   │   │
│  │  │    (React + UmiJS)              │   │   │
│  │  │                                 │   │   │
│  │  └─────────────────────────────────┘   │   │
│  │          ↕ postMessage                  │   │
│  │  EditorBridge.js                        │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 核心文件说明

### 1. Vue 前端文件

**shop-decorator-system/frontend/src/utils/editorBridge.js**
- 编辑器通信桥接工具
- 提供消息发送和接收 API
- 实现数据的加载和获取

**shop-decorator-system/frontend/src/views/Editor.vue**
- 编辑器页面组件
- 集成 iframe 嵌入 H5-Dooring
- 实现保存、加载、预览功能
- 未保存提醒功能

### 2. H5-Dooring 文件

**h5-Dooring/src/utils/parentBridge.ts**
- 父窗口通信工具
- 处理来自父窗口的消息
- 发送数据到父窗口

**h5-Dooring/src/pages/editor/EditorBridge.tsx**
- 编辑器通信包装组件
- 连接 Redux store
- 处理数据的加载和保存

**h5-Dooring/src/pages/editor/index.js**
- 已更新，包含 EditorBridge 组件
- 自动处理与父窗口的通信

## 通信协议

### 消息类型

#### 从 Vue 发送到 h5-Dooring：

1. **LOAD_DATA** - 加载设计数据到编辑器
   ```javascript
   bridge.loadData(designData)
   ```

2. **GET_DATA** - 请求编辑器当前数据
   ```javascript
   const data = await bridge.getData()
   ```

3. **CLEAR** - 清空编辑器
   ```javascript
   bridge.clear()
   ```

#### 从 h5-Dooring 发送到 Vue：

1. **EDITOR_READY** - 编辑器加载完成
2. **GET_DATA_RESPONSE** - 返回编辑器数据
3. **DATA_CHANGED** - 数据发生变化
4. **SAVE_REQUEST** - 请求保存

### 数据格式

编辑器数据以 JSON 格式存储在数据库中：

```json
{
  "pointData": [
    {
      "id": "component_1",
      "type": "Text",
      "config": {},
      "h": 100,
      "w": 200,
      "x": 0,
      "y": 0
    }
  ]
}
```

## 使用流程

### 1. 启动所有服务

#### 方式一：一键启动（推荐）

```bash
cd shop-decorator-system
chmod +x start-all.sh
./start-all.sh
```

这会自动启动：
- H5-Dooring 编辑器（端口 8000）
- 后端 API（端口 5000）
- 前端应用（端口 3000）

#### 方式二：手动启动

**终端 1 - 启动 H5-Dooring：**
```bash
cd h5-Dooring
npm install  # 首次运行
export NODE_OPTIONS=--openssl-legacy-provider
npm start
# 访问 http://localhost:8000/editor
```

**终端 2 - 启动后端：**
```bash
cd shop-decorator-system/backend
npm install  # 首次运行
cp .env.example .env  # 首次运行，然后配置数据库
npm run dev
# 运行在 http://localhost:5000
```

**终端 3 - 启动前端：**
```bash
cd shop-decorator-system/frontend
npm install  # 首次运行
npm run dev
# 访问 http://localhost:3000
```

### 2. 使用编辑器

1. 登录系统（admin/admin123）
2. 进入"模板中心"或"我的方案"
3. 点击"新建方案"或"编辑"
4. 进入编辑器页面，等待加载（约 2-3 秒）
5. 使用 H5-Dooring 编辑器设计页面
6. 点击"保存"按钮保存方案

### 3. 停止服务

```bash
cd shop-decorator-system
./stop-all.sh
```

## 功能特性

### ✅ 已实现

1. **编辑器集成**
   - iframe 嵌入 H5-Dooring
   - 实时双向通信
   - 数据同步加载和保存

2. **数据管理**
   - 从数据库加载设计数据到编辑器
   - 从编辑器获取数据保存到数据库
   - 未保存提醒功能

3. **用户体验**
   - 加载状态提示
   - 保存成功提示
   - 离开页面前的提醒

### 📝 待优化

1. **性能优化**
   - 编辑器预加载
   - 数据防抖保存
   - 缓存机制

2. **功能增强**
   - 实时预览
   - 版本历史
   - 撤销/重做同步

3. **组件扩展**
   - 电商专用组件
   - 自定义组件库
   - 组件模板市场

## 常见问题

### Q1: 编辑器一直显示"加载中"？

**解决方法：**
1. 确认 H5-Dooring 服务运行正常（访问 http://localhost:8000/editor）
2. 检查浏览器控制台是否有跨域错误
3. 清除浏览器缓存重试
4. 检查 Editor.vue 中的 editorUrl 配置

### Q2: 保存后数据丢失？

**解决方法：**
1. 检查后端 API 是否正常（http://localhost:5000/api/health）
2. 查看浏览器控制台网络请求
3. 检查数据库连接配置
4. 确认用户已登录且有权限

### Q3: 编辑器数据无法加载？

**解决方法：**
1. 检查 EditorBridge 通信是否正常
2. 打开浏览器控制台查看通信日志
3. 确认数据格式正确（JSON）
4. 检查 Redux store 是否正常

### Q4: h5-Dooring 启动失败？

**解决方法：**
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install

# 使用 legacy OpenSSL
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

## 开发调试

### 查看通信日志

**在 Vue 应用控制台：**
```javascript
// 编辑器准备就绪
console.log('编辑器已就绪')

// 数据加载/保存
console.log('加载数据:', data)
```

**在 H5-Dooring 控制台：**
```javascript
// 收到消息
console.log('收到加载数据请求:', data)
console.log('收到获取数据请求')
```

### 测试通信

在浏览器控制台手动测试：

```javascript
// 在 Editor.vue 页面
const iframe = document.querySelector('.editor-iframe')
iframe.contentWindow.postMessage({
  type: 'LOAD_DATA',
  data: { pointData: [] }
}, window.location.origin)
```

## 技术支持

遇到问题？
1. 查看日志文件：`shop-decorator-system/logs/`
2. 检查控制台输出
3. 参考 H5-Dooring 官方文档：https://github.com/MrXujiang/h5-Dooring

## 下一步开发建议

1. 添加更多电商组件（商品卡片、购物车等）
2. 实现实时协作编辑
3. 添加模板导出为 HTML 功能
4. 集成图片上传和管理
5. 添加移动端预览功能
