<template>
  <div class="my-designs-container">
    <el-page-header title="返回" @back="$router.back()">
      <template #content>
        <h2>我的装修方案</h2>
      </template>
      <template #extra>
        <el-button type="primary" @click="createNew">
          <el-icon><Plus /></el-icon>
          新建方案
        </el-button>
      </template>
    </el-page-header>

    <el-divider />

    <el-table :data="designs" v-loading="loading" stripe>
      <el-table-column prop="name" label="方案名称" width="200" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="基于模板" width="150">
        <template #default="{ row }">
          {{ row.templateName || '自定义' }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="editDesign(row)">编辑</el-button>
          <el-button size="small" @click="previewDesign(row)">预览</el-button>
          <el-button size="small" @click="exportDesign(row)">导出</el-button>
          <el-button size="small" type="danger" @click="deleteDesign(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && designs.length === 0" description="暂无装修方案" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getMyDesigns, deleteDesign as deleteDesignApi } from '@/api/design'

const router = useRouter()
const loading = ref(false)
const designs = ref([])

const loadDesigns = async () => {
  try {
    loading.value = true
    designs.value = await getMyDesigns()
  } catch (error) {
    console.error('加载装修方案失败:', error)
  } finally {
    loading.value = false
  }
}

const createNew = () => {
  router.push('/editor')
}

const editDesign = (design) => {
  router.push(`/editor/${design.id}`)
}

const previewDesign = (design) => {
  ElMessage.info('预览功能开发中...')
}

const exportDesign = (design) => {
  ElMessage.info('导出功能开发中...')
}

const deleteDesign = (design) => {
  ElMessageBox.confirm(`确定要删除方案 "${design.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteDesignApi(design.id)
      ElMessage.success('删除成功')
      loadDesigns()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  loadDesigns()
})
</script>

<style scoped>
.my-designs-container {
  padding: 20px;
}
</style>
