<template>
  <div class="preview-container">
    <div class="preview-header">
      <h2>装修预览</h2>
      <el-button @click="handleClose">关闭</el-button>
    </div>
    <div class="preview-content">
      <!-- 使用 iframe 嵌入 h5-Dooring 的预览页面 -->
      <div class="preview-frame-wrapper">
        <iframe
          ref="previewIframe"
          :src="previewUrl"
          frameborder="0"
          class="preview-iframe"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const previewIframe = ref(null)

// 构建预览 URL
const previewUrl = computed(() => {
  const data = route.query.data
  if (data) {
    // 传递数据到 h5-Dooring 预览页面
    return `http://localhost:8000/preview?data=${data}`
  }
  return ''
})

const handleClose = () => {
  window.close()
  // 如果 window.close() 不起作用（不是弹窗打开的），则返回上一页
  setTimeout(() => {
    router.back()
  }, 100)
}

onMounted(() => {
  // 监听来自预览 iframe 的消息
  window.addEventListener('message', (event) => {
    if (event.data.type === 'PREVIEW_READY') {
      console.log('预览页面已就绪')
    }
  })
})
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.preview-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.preview-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.preview-frame-wrapper {
  width: 375px;
  height: 667px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
}

.preview-frame-wrapper::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 6px;
  background-color: #333;
  border-radius: 3px;
  z-index: 10;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
