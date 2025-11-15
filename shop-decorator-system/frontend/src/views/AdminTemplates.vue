<template>
  <div class="admin-templates-container">
    <el-page-header title="返回" @back="$router.back()">
      <template #content>
        <h2>模板管理</h2>
      </template>
      <template #extra>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>
          创建模板
        </el-button>
      </template>
    </el-page-header>

    <el-divider />

    <el-table :data="templates" v-loading="loading" stripe>
      <el-table-column prop="name" label="模板名称" width="200" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="可见性" width="120">
        <template #default="{ row }">
          <el-switch
            v-model="row.isPublic"
            active-text="公共"
            inactive-text="私有"
            @change="toggleVisibility(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="editTemplate(row)">编辑</el-button>
          <el-button size="small" @click="designTemplate(row)">设计</el-button>
          <el-button size="small" type="danger" @click="deleteTemplate(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑模板对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '创建模板' : '编辑模板'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入模板描述"
          />
        </el-form-item>
        <el-form-item label="缩略图">
          <div class="thumbnail-upload">
            <div v-if="form.thumbnail" class="thumbnail-preview">
              <img :src="getThumbnailUrl(form.thumbnail)" alt="缩略图" />
              <el-button size="small" type="danger" @click="removeThumbnail">删除</el-button>
            </div>
            <el-button v-else @click="showImagePicker = true">选择缩略图</el-button>
          </div>
        </el-form-item>
        <el-form-item label="可见性" prop="isPublic">
          <el-radio-group v-model="form.isPublic">
            <el-radio :label="true">公共（所有用户可见）</el-radio>
            <el-radio :label="false">私有（仅自己可见）</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 图片选择器 -->
    <ImagePicker
      v-model="showImagePicker"
      :multiple="false"
      type="thumbnails"
      @select="handleSelectThumbnail"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate as deleteTemplateApi,
  toggleTemplateVisibility
} from '@/api/template'
import ImagePicker from '@/components/ImagePicker.vue'

const router = useRouter()
const loading = ref(false)
const templates = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)
const showImagePicker = ref(false)

const form = reactive({
  id: null,
  name: '',
  description: '',
  thumbnail: '',
  isPublic: false
})

const rules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入模板描述', trigger: 'blur' }]
}

const loadTemplates = async () => {
  try {
    loading.value = true
    templates.value = await getTemplates()
  } catch (error) {
    console.error('加载模板失败:', error)
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  dialogMode.value = 'create'
  form.id = null
  form.name = ''
  form.description = ''
  form.thumbnail = ''
  form.isPublic = false
  dialogVisible.value = true
}

const editTemplate = (template) => {
  dialogMode.value = 'edit'
  form.id = template.id
  form.name = template.name
  form.description = template.description
  form.thumbnail = template.thumbnail || ''
  form.isPublic = template.isPublic
  dialogVisible.value = true
}

const handleSelectThumbnail = (url) => {
  form.thumbnail = url
}

const removeThumbnail = () => {
  form.thumbnail = ''
}

const getThumbnailUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${url}`
}

const designTemplate = (template) => {
  router.push({
    name: 'Editor',
    query: { templateId: template.id, mode: 'design' }
  })
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    if (dialogMode.value === 'create') {
      await createTemplate(form)
      ElMessage.success('创建成功')
    } else {
      await updateTemplate(form.id, form)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    loadTemplates()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

const toggleVisibility = async (template) => {
  try {
    await toggleTemplateVisibility(template.id, template.isPublic)
    ElMessage.success(`已${template.isPublic ? '公开' : '设为私有'}`)
  } catch (error) {
    console.error('切换失败:', error)
    template.isPublic = !template.isPublic // 回滚
  }
}

const deleteTemplate = (template) => {
  ElMessageBox.confirm(`确定要删除模板 "${template.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteTemplateApi(template.id)
      ElMessage.success('删除成功')
      loadTemplates()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.admin-templates-container {
  padding: 20px;
}

.thumbnail-upload {
  width: 100%;
}

.thumbnail-preview {
  display: flex;
  align-items: center;
  gap: 15px;
}

.thumbnail-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
