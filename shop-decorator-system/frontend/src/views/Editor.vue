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
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
    <div class="editor-content">
      <!-- H5-Dooring 编辑器将在这里集成 -->
      <div class="editor-placeholder">
        <el-empty description="H5-Dooring 编辑器集成区域">
          <template #extra>
            <p>此处将集成 H5-Dooring 可视化编辑器</p>
            <p>用户可以通过拖拽组件的方式设计店铺页面</p>
          </template>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getDesignDetail, saveDesign, updateDesign } from '@/api/design'
import { getTemplateDetail } from '@/api/template'

const route = useRoute()
const router = useRouter()
const designName = ref('未命名方案')
const designId = ref(null)
const designData = ref(null)

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
    }
  } else if (route.query.templateId) {
    try {
      const template = await getTemplateDetail(route.query.templateId)
      designData.value = template.content
      designName.value = `基于 ${template.name} 的方案`
    } catch (error) {
      console.error('加载模板失败:', error)
    }
  }
}

const handleBack = () => {
  router.back()
}

const handlePreview = () => {
  ElMessage.info('预览功能开发中...')
}

const handleSave = async () => {
  try {
    const data = {
      name: designName.value,
      description: '',
      content: designData.value,
      templateId: route.query.templateId
    }

    if (designId.value) {
      await updateDesign(designId.value, data)
      ElMessage.success('保存成功')
    } else {
      const result = await saveDesign(data)
      designId.value = result.id
      ElMessage.success('创建成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

onMounted(() => {
  loadDesign()
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
