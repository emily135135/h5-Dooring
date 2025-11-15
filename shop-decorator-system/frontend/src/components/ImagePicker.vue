<template>
  <div class="image-picker">
    <el-dialog
      v-model="visible"
      title="选择图片"
      width="800px"
      @close="handleClose"
    >
      <el-tabs v-model="activeTab">
        <!-- 图片库 -->
        <el-tab-pane label="图片库" name="library">
          <div class="image-library">
            <div v-loading="loading" class="images-grid">
              <div
                v-for="image in images"
                :key="image.filename"
                class="image-item"
                :class="{ selected: isSelected(image) }"
                @click="handleSelectImage(image)"
              >
                <img :src="getImageUrl(image.url)" :alt="image.filename" />
                <div class="image-mask">
                  <el-icon v-if="isSelected(image)" class="check-icon"><Check /></el-icon>
                </div>
                <div class="image-info">
                  <span class="filename">{{ image.filename }}</span>
                  <span class="size">{{ formatSize(image.size) }}</span>
                </div>
              </div>
            </div>
            <el-empty v-if="!loading && images.length === 0" description="暂无图片" />
          </div>
        </el-tab-pane>

        <!-- 上传图片 -->
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="upload-area"
            drag
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :show-file-list="true"
            :multiple="multiple"
            accept="image/*"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 jpg/png/gif/webp 文件，且不超过 5MB
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="!hasSelection">
          确定 {{ selectedImages.length > 0 ? `(${selectedImages.length})` : '' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, UploadFilled } from '@element-plus/icons-vue'
import { getImages } from '@/api/upload'
import { useUserStore } from '@/store/user'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'images'
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const userStore = useUserStore()
const visible = ref(false)
const activeTab = ref('library')
const loading = ref(false)
const images = ref([])
const selectedImages = ref([])

const uploadUrl = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL || ''}/api/upload/single?type=${props.type}`
})

const uploadHeaders = computed(() => {
  return {
    Authorization: `Bearer ${userStore.token}`
  }
})

const hasSelection = computed(() => selectedImages.value.length > 0)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loadImages()
    selectedImages.value = []
  }
})

watch(visible, (val) => {
  if (!val) {
    emit('update:modelValue', false)
  }
})

const loadImages = async () => {
  try {
    loading.value = true
    images.value = await getImages(props.type)
  } catch (error) {
    console.error('加载图片失败:', error)
    ElMessage.error('加载图片失败')
  } finally {
    loading.value = false
  }
}

const getImageUrl = (url) => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${url}`
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const isSelected = (image) => {
  return selectedImages.value.some(img => img.filename === image.filename)
}

const handleSelectImage = (image) => {
  if (props.multiple) {
    const index = selectedImages.value.findIndex(img => img.filename === image.filename)
    if (index > -1) {
      selectedImages.value.splice(index, 1)
    } else {
      selectedImages.value.push(image)
    }
  } else {
    selectedImages.value = [image]
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  ElMessage.success('上传成功')
  loadImages()
  // 切换到图片库标签
  activeTab.value = 'library'
}

const handleUploadError = (error) => {
  console.error('上传失败:', error)
  ElMessage.error('上传失败')
}

const handleConfirm = () => {
  if (selectedImages.value.length === 0) {
    ElMessage.warning('请选择图片')
    return
  }

  const result = props.multiple
    ? selectedImages.value.map(img => getImageUrl(img.url))
    : getImageUrl(selectedImages.value[0].url)

  emit('select', result)
  handleClose()
}

const handleClose = () => {
  visible.value = false
  selectedImages.value = []
  activeTab.value = 'library'
}
</script>

<style scoped>
.image-library {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.image-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
}

.image-item.selected {
  border-color: #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-mask,
.image-item.selected .image-mask {
  opacity: 1;
}

.check-icon {
  font-size: 40px;
  color: #fff;
}

.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.filename {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.size {
  color: #ccc;
  font-size: 11px;
}

.upload-area {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
