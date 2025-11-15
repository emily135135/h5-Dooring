# H5-Dooring 编辑器集成指南

## 概述

本文档说明如何将 H5-Dooring 可视化编辑器集成到电商店铺装修管理系统中。

## H5-Dooring 简介

H5-Dooring 是一个强大的 H5 页面可视化搭建工具，支持：
- 拖拽式页面搭建
- 丰富的组件库
- 实时预览
- JSON 配置导出

项目地址: https://github.com/MrXujiang/h5-Dooring

## 集成方案

### 方案一：npm 包集成（推荐）

1. 安装依赖

```bash
cd frontend
npm install @alex_xu/react-core-form-render
```

2. 在 Editor.vue 中集成

```vue
<template>
  <div class="editor-container">
    <div id="dooring-editor"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 初始化 H5-Dooring 编辑器
  // 具体集成代码参考官方文档
})
</script>
```

### 方案二：iframe 集成

1. 部署独立的 H5-Dooring 服务

```bash
git clone https://github.com/MrXujiang/h5-Dooring.git
cd h5-Dooring
npm install
npm start
```

2. 在 Editor.vue 中使用 iframe

```vue
<template>
  <div class="editor-container">
    <iframe
      src="http://localhost:8000"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>
```

### 方案三：自定义简化版编辑器

如果不需要完整的 H5-Dooring 功能，可以使用以下轻量级替代方案：

```bash
npm install vue-grid-layout
npm install vuedraggable
```

## 数据结构设计

### 编辑器配置数据格式

```json
{
  "version": "1.0.0",
  "components": [
    {
      "id": "component_1",
      "type": "banner",
      "props": {
        "images": ["url1", "url2"],
        "autoPlay": true
      },
      "style": {
        "width": "100%",
        "height": "200px"
      }
    },
    {
      "id": "component_2",
      "type": "product-list",
      "props": {
        "products": []
      }
    }
  ],
  "globalStyle": {
    "backgroundColor": "#fff"
  }
}
```

## API 集成

### 保存设计方案

```javascript
// 在编辑器中保存时调用
const saveDesign = async () => {
  const editorData = getEditorData() // 获取编辑器数据

  await saveDesign({
    name: designName.value,
    content: editorData,
    templateId: currentTemplateId
  })
}
```

### 加载设计方案

```javascript
// 加载已有方案
const loadDesign = async (id) => {
  const design = await getDesignDetail(id)
  setEditorData(design.content) // 设置编辑器数据
}
```

## 组件库扩展

可以根据电商场景扩展自定义组件：

1. **轮播图组件** - 商品图片展示
2. **商品卡片** - 单个商品展示
3. **商品列表** - 多商品展示
4. **分类导航** - 商品分类
5. **优惠券** - 优惠信息展示
6. **倒计时** - 促销活动倒计时
7. **客服悬浮按钮** - 在线客服入口

## 预览和导出

### 预览功能

```javascript
const previewDesign = () => {
  const previewUrl = `/preview?designId=${designId.value}`
  window.open(previewUrl, '_blank')
}
```

### 导出功能

支持多种导出格式：
- JSON 配置文件
- HTML 静态页面
- 移动端适配代码

## 性能优化

1. **组件懒加载** - 按需加载编辑器组件
2. **防抖保存** - 避免频繁保存操作
3. **缓存机制** - 本地缓存编辑数据

## 下一步工作

1. ✅ 完成基础项目架构
2. ⬜ 集成 H5-Dooring 或选择替代编辑器方案
3. ⬜ 开发自定义电商组件
4. ⬜ 实现预览和导出功能
5. ⬜ 优化用户体验

## 参考资源

- [H5-Dooring 官方文档](https://github.com/MrXujiang/h5-Dooring)
- [Vue Grid Layout](https://github.com/jbaysolutions/vue-grid-layout)
- [VueDraggable](https://github.com/SortableJS/Vue.Draggable)
