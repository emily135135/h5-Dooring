<template>
  <div class="templates-container">
    <el-page-header title="返回" @back="$router.back()">
      <template #content>
        <h2>模板中心</h2>
      </template>
    </el-page-header>

    <el-divider />

    <div class="filter-bar">
      <el-radio-group v-model="filterType" @change="loadTemplates">
        <el-radio-button label="all">全部模板</el-radio-button>
        <el-radio-button label="public">公共模板</el-radio-button>
        <el-radio-button v-if="userStore.isAdmin" label="private">我的私有模板</el-radio-button>
      </el-radio-group>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="6" v-for="template in templates" :key="template.id">
        <el-card class="template-card" :body-style="{ padding: '0px' }">
          <div class="template-image">
            <img :src="getThumbnailUrl(template.thumbnail)" alt="模板预览" />
          </div>
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <p class="description">{{ template.description }}</p>
            <div class="meta">
              <el-tag v-if="template.isPublic" type="success" size="small">公共</el-tag>
              <el-tag v-else type="info" size="small">私有</el-tag>
              <span class="author">作者: {{ template.author }}</span>
            </div>
            <div class="actions">
              <el-button type="primary" size="small" @click="useTemplate(template)">
                使用模板
              </el-button>
              <el-button size="small" @click="previewTemplate(template)">
                预览
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!loading && templates.length === 0" description="暂无模板" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTemplates } from '@/api/template'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const templates = ref([])
const filterType = ref('all')

const loadTemplates = async () => {
  try {
    loading.value = true
    const params = {}
    if (filterType.value === 'public') {
      params.isPublic = true
    } else if (filterType.value === 'private') {
      params.isPublic = false
    }
    templates.value = await getTemplates(params)
  } catch (error) {
    console.error('加载模板失败:', error)
  } finally {
    loading.value = false
  }
}

const useTemplate = (template) => {
  router.push({
    name: 'Editor',
    query: { templateId: template.id }
  })
}

const previewTemplate = (template) => {
  ElMessage.info('预览功能开发中...')
}

const getThumbnailUrl = (url) => {
  if (!url) {
    // 返回默认缩略图
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1Zjdm YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5MDkzOTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7mo6fnv4jlm77niYc8L3RleHQ+PC9zdmc+'
  }
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${url}`
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.templates-container {
  padding: 20px;
}

.filter-bar {
  margin: 20px 0;
}

.template-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.template-image {
  height: 200px;
  overflow: hidden;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-info {
  padding: 15px;
}

.template-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.description {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #606266;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #909399;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
