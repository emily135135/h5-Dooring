<template>
  <div class="layout-container">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1 class="title">电商店铺装修系统</h1>
          <div class="user-info">
            <el-tag v-if="userStore.isAdmin" type="danger" class="admin-tag">管理员</el-tag>
            <span class="username">{{ userStore.userInfo.username }}</span>
            <el-button @click="handleLogout" size="small">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeMenu"
            router
            class="el-menu-vertical"
          >
            <el-menu-item index="/templates">
              <el-icon><Document /></el-icon>
              <span>模板中心</span>
            </el-menu-item>
            <el-menu-item index="/my-designs">
              <el-icon><Files /></el-icon>
              <span>我的方案</span>
            </el-menu-item>
            <el-menu-item v-if="userStore.isAdmin" index="/admin/templates">
              <el-icon><Setting /></el-icon>
              <span>模板管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Document, Files, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/login')
  })
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
}

.el-header {
  background-color: #545c64;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-tag {
  font-size: 12px;
}

.username {
  font-size: 14px;
}

.el-aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
}

.el-menu-vertical {
  border: none;
  height: 100%;
}

.el-main {
  background-color: #fff;
  padding: 20px;
}
</style>
