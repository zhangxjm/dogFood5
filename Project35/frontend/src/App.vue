<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="header-left">
        <el-icon class="logo-icon"><Document /></el-icon>
        <span class="header-title">Document Circulation System</span>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleUserSelect">
          <span class="user-info">
            <el-icon><UserFilled /></el-icon>
            {{ currentUser?.name || 'Select User' }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="user in users"
                :key="user.id"
                :command="user"
                :class="{ active: currentUser?.id === user.id }"
              >
                {{ user.name }} ({{ user.department }})
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px" class="layout-aside">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/documents">
            <el-icon><Document /></el-icon>
            <span>Document Management</span>
          </el-menu-item>
          <el-menu-item index="/my-tasks">
            <el-icon><Tickets /></el-icon>
            <span>My Tasks</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>User Management</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, UserFilled, ArrowDown, HomeFilled, Tickets, User } from '@element-plus/icons-vue'
import { fetchUsers } from './api'

const route = useRoute()
const users = ref([])
const currentUser = ref(null)

const activeMenu = computed(() => route.path)

onMounted(async () => {
  try {
    const response = await fetchUsers()
    users.value = response.data
    if (users.value.length > 0) {
      const savedUserId = localStorage.getItem('currentUserId')
      if (savedUserId) {
        currentUser.value = users.value.find(u => u.id === parseInt(savedUserId))
      }
      if (!currentUser.value) {
        currentUser.value = users.value[0]
        localStorage.setItem('currentUserId', currentUser.value.id)
      }
    }
  } catch (error) {
    console.error('Failed to load users:', error)
  }
})

const handleUserSelect = (user) => {
  currentUser.value = user
  localStorage.setItem('currentUserId', user.id)
  ElMessage.success(`Switched to: ${user.name}`)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 28px;
  color: #409eff;
  margin-right: 12px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-info .el-icon {
  margin: 0 4px;
}

.layout-aside {
  background: #304156;
}

.layout-aside :deep(.el-menu) {
  border-right: none;
}

.layout-main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
