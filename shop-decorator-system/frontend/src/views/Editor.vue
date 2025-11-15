<template>
  <div class="editor-container">
    <div class="editor-header">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <div class="editor-title">
        <el-input v-model="designName" placeholder="输入方案名称" style="width: 300px" />
      </div>
      <div class="editor-actions">
        <el-button @click="handlePreview">预览</el-button>
        <el-button
          v-if="designId"
          @click="showVersionHistory = true"
        >
          版本历史
        </el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </div>
    </div>
    <div class="editor-content">
      <!-- H5-Dooring 编辑器 iframe -->
      <div v-if="!editorReady" class="editor-loading">
        <el-loading-icon style="font-size: 48px; color: #409eff" />
        <p>编辑器加载中...</p>
      </div>
      <iframe
        ref="editorIframe"
        :src="editorUrl"
        frameborder="0"
        class="editor-iframe"
        :style="{ display: editorReady ? 'block' : 'none' }"
      ></iframe>
    </div>

    <!-- 版本历史 -->
    <VersionHistory
      v-if="designId"
      v-model:visible="showVersionHistory"
      :design-id="designId"
      @restored="handleVersionRestored"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getDesignDetail, saveDesign, updateDesign } from '@/api/design'
import { getTemplateDetail } from '@/api/template'
import { EditorBridge, MESSAGE_TYPES } from '@/utils/editorBridge'
import VersionHistory from '@/components/VersionHistory.vue'

const route = useRoute()
const router = useRouter()
const designName = ref('未命名方案')
const designId = ref(null)
const designData = ref(null)
const editorIframe = ref(null)
const editorReady = ref(false)
const saving = ref(false)
const hasUnsavedChanges = ref(false)
const showVersionHistory = ref(false)

// 编辑器 URL - 指向 h5-Dooring 编辑器
const editorUrl = ref('http://localhost:8000/editor')

let bridge = null

// 加载设计数据
const loadDesign = async () => {
  const id = route.params.id
  if (id) {
    try {
      const data = await getDesignDetail(id)
      designId.value = data.id
      designName.value = data.name
      designData.value = data.content
    } catch (error) {
      console.error('加载方案失败:', error)
      ElMessage.error('加载方案失败')
    }
  } else if (route.query.templateId) {
    try {
      const template = await getTemplateDetail(route.query.templateId)
      designData.value = template.content
      designName.value = `基于 ${template.name} 的方案`
    } catch (error) {
      console.error('加载模板失败:', error)
      ElMessage.error('加载模板失败')
    }
  }
}

// 初始化编辑器通信
const initEditorBridge = () => {
  if (!editorIframe.value) return

  bridge = new EditorBridge(editorIframe.value)

  // 监听编辑器就绪事件
  bridge.on(MESSAGE_TYPES.READY, () => {
    console.log('编辑器已就绪')
    editorReady.value = true

    // 如果有数据，加载到编辑器
    if (designData.value) {
      bridge.loadData(designData.value)
    }
  })

  // 监听数据变化
  bridge.on(MESSAGE_TYPES.DATA_CHANGED, () => {
    hasUnsavedChanges.value = true
  })

  // 监听保存请求（从编辑器发起）
  bridge.on(MESSAGE_TYPES.SAVE_REQUEST, () => {
    handleSave()
  })
}

// 返回
const handleBack = () => {
  if (hasUnsavedChanges.value) {
    ElMessageBox.confirm('您有未保存的修改，确定要离开吗？', '提示', {
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.back()
    }).catch(() => {})
  } else {
    router.back()
  }
}

// 预览
const handlePreview = async () => {
  if (!bridge) {
    ElMessage.warning('编辑器未就绪')
    return
  }

  try {
    const data = await bridge.getData()
    // 打开预览窗口
    const previewUrl = `/preview?data=${encodeURIComponent(JSON.stringify(data))}`
    window.open(previewUrl, '_blank')
  } catch (error) {
    console.error('预览失败:', error)
    ElMessage.error('预览失败')
  }
}

// 保存
const handleSave = async () => {
  if (!bridge) {
    ElMessage.warning('编辑器未就绪')
    return
  }

  if (!designName.value.trim()) {
    ElMessage.warning('请输入方案名称')
    return
  }

  try {
    saving.value = true

    // 从编辑器获取数据
    const editorData = await bridge.getData()

    const data = {
      name: designName.value,
      description: '',
      content: editorData,
      templateId: route.query.templateId
    }

    if (designId.value) {
      await updateDesign(designId.value, data)
      ElMessage.success('保存成功')
    } else {
      const result = await saveDesign(data)
      designId.value = result.id
      ElMessage.success('创建成功')
      // 更新 URL，避免重复创建
      router.replace(`/editor/${result.id}`)
    }

    hasUnsavedChanges.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 版本恢复后重新加载
const handleVersionRestored = async () => {
  try {
    const data = await getDesignDetail(designId.value)
    designData.value = data.content
    if (bridge && editorReady.value) {
      bridge.loadData(data.content)
    }
    hasUnsavedChanges.value = false
  } catch (error) {
    console.error('重新加载失败:', error)
    ElMessage.error('重新加载失败')
  }
}

// 组件挂载
onMounted(async () => {
  await loadDesign()

  // 等待 iframe 加载完成
  setTimeout(() => {
    initEditorBridge()
  }, 100)

  // 监听页面关闭
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
})

// 组件卸载
onBeforeUnmount(() => {
  if (bridge) {
    bridge.destroy()
  }
})
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  z-index: 10;
}

.editor-title {
  flex: 1;
  text-align: center;
}

.editor-actions {
  display: flex;
  gap: 10px;
}

.editor-content {
  flex: 1;
  overflow: hidden;
  background-color: #f5f7fa;
  position: relative;
}

.editor-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #fff;
  z-index: 5;
}

.editor-loading p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.editor-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
