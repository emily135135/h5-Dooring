<template>
  <el-dialog
    v-model="dialogVisible"
    title="版本历史"
    width="800px"
    :before-close="handleClose"
  >
    <div v-loading="loading" class="version-history">
      <div v-if="versions.length === 0" class="empty">
        <el-empty description="暂无版本历史" />
      </div>
      <el-timeline v-else>
        <el-timeline-item
          v-for="version in versions"
          :key="version.id"
          :timestamp="formatTime(version.created_at)"
          placement="top"
        >
          <el-card>
            <div class="version-item">
              <div class="version-info">
                <h4>版本 {{ version.version_number }}</h4>
                <p class="description">{{ version.description || '无描述' }}</p>
                <p class="meta">创建者: {{ version.created_by_name }}</p>
              </div>
              <div class="version-actions">
                <el-button
                  size="small"
                  type="primary"
                  @click="handleRestore(version)"
                >
                  恢复此版本
                </el-button>
                <el-button
                  size="small"
                  @click="handlePreview(version)"
                >
                  查看详情
                </el-button>
                <el-popconfirm
                  title="确定删除此版本吗？"
                  @confirm="handleDelete(version)"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      type="danger"
                      :disabled="versions.length === 1"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 版本详情对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="版本详情"
      width="600px"
      append-to-body
    >
      <div v-if="currentVersion">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="版本号">
            {{ currentVersion.version_number }}
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            {{ currentVersion.description || '无描述' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建者">
            {{ currentVersion.created_by_name }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatTime(currentVersion.created_at) }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="content-preview">
          <h4>内容预览</h4>
          <pre>{{ JSON.stringify(currentVersion.content, null, 2) }}</pre>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getVersions, getVersionDetail, restoreVersion, deleteVersion } from '../api/version'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  designId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'restored'])

const dialogVisible = ref(false)
const loading = ref(false)
const versions = ref([])
const previewVisible = ref(false)
const currentVersion = ref(null)

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    loadVersions()
  }
})

watch(dialogVisible, (val) => {
  if (!val) {
    emit('update:visible', false)
  }
})

// 加载版本列表
const loadVersions = async () => {
  loading.value = true
  try {
    const res = await getVersions(props.designId)
    versions.value = res.data
  } catch (err) {
    ElMessage.error('加载版本历史失败')
  } finally {
    loading.value = false
  }
}

// 恢复版本
const handleRestore = async (version) => {
  try {
    await restoreVersion(version.id)
    ElMessage.success(`已恢复到版本 ${version.version_number}`)
    emit('restored')
    handleClose()
  } catch (err) {
    ElMessage.error('恢复版本失败')
  }
}

// 查看详情
const handlePreview = async (version) => {
  try {
    const res = await getVersionDetail(version.id)
    currentVersion.value = res.data
    previewVisible.value = true
  } catch (err) {
    ElMessage.error('加载版本详情失败')
  }
}

// 删除版本
const handleDelete = async (version) => {
  try {
    await deleteVersion(version.id)
    ElMessage.success('版本已删除')
    loadVersions()
  } catch (err) {
    ElMessage.error('删除版本失败')
  }
}

// 格式化时间
const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
.version-history {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.version-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.version-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.version-info .description {
  margin: 0 0 8px 0;
  color: #606266;
}

.version-info .meta {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.version-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.content-preview {
  margin-top: 20px;
}

.content-preview h4 {
  margin: 0 0 10px 0;
}

.content-preview pre {
  max-height: 300px;
  overflow: auto;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
}
</style>
