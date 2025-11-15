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
      <el-table-column label="操作" width="460" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="editDesign(row)">编辑</el-button>
          <el-button size="small" @click="previewDesign(row)">预览</el-button>
          <el-button size="small" @click="showVersionHistory(row)">版本历史</el-button>
          <el-dropdown size="small" @command="(cmd) => handleExport(row, cmd)">
            <el-button size="small">
              导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="json">导出JSON</el-dropdown-item>
                <el-dropdown-item command="html">导出HTML</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button size="small" type="danger" @click="deleteDesign(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && designs.length === 0" description="暂无装修方案" />

    <!-- 版本历史 -->
    <VersionHistory
      v-if="currentDesignId"
      v-model:visible="versionHistoryVisible"
      :design-id="currentDesignId"
      @restored="handleVersionRestored"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import { getMyDesigns, deleteDesign as deleteDesignApi } from '@/api/design'
import { useUserStore } from '@/store/user'
import VersionHistory from '@/components/VersionHistory.vue'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const designs = ref([])
const versionHistoryVisible = ref(false)
const currentDesignId = ref(null)

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
  // 打开预览窗口
  const previewUrl = `/preview?data=${encodeURIComponent(JSON.stringify(design.content))}`
  window.open(previewUrl, '_blank', 'width=400,height=700')
}

const handleExport = (design, type) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const token = userStore.token

  if (type === 'json') {
    // 导出 JSON
    const url = `${baseUrl}/api/designs/${design.id}/export`
    downloadFile(url, token)
  } else if (type === 'html') {
    // 导出 HTML
    const url = `${baseUrl}/api/designs/${design.id}/export-html`
    downloadFile(url, token)
  }
}

const downloadFile = (url, token) => {
  // 创建隐藏的 iframe 下载文件
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url + `?token=${token}`
  document.body.appendChild(iframe)

  // 5秒后移除 iframe
  setTimeout(() => {
    document.body.removeChild(iframe)
  }, 5000)
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

// 显示版本历史
const showVersionHistory = (design) => {
  currentDesignId.value = design.id
  versionHistoryVisible.value = true
}

// 版本恢复后刷新列表
const handleVersionRestored = () => {
  loadDesigns()
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
