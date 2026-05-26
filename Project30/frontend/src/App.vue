<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <el-icon><Reading /></el-icon>
          <span>Campus Book Exchange</span>
        </router-link>
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          router
          class="header-menu"
        >
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/categories">Categories</el-menu-item>
          <el-menu-item v-if="isLoggedIn" index="/publish">
            <el-icon><Plus /></el-icon>Publish
          </el-menu-item>
          <el-menu-item v-if="isLoggedIn" index="/my-books">My Books</el-menu-item>
          <el-menu-item v-if="isLoggedIn" index="/messages">
            <el-icon><ChatDotRound /></el-icon>Messages
            <el-badge v-if="unreadCount > 0" :value="unreadCount" class="msg-badge" />
          </el-menu-item>
        </el-menu>
        <div class="header-right">
          <template v-if="isLoggedIn">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="28">{{ user?.username?.charAt(0)?.toUpperCase() }}</el-avatar>
                <span class="username">{{ user?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">Profile</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="$router.push('/login')">Login</el-button>
            <el-button @click="$router.push('/register')">Register</el-button>
          </template>
        </div>
      </div>
    </el-header>
    <el-main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    <el-footer class="app-footer">
      <p>Campus Idle Book Exchange Platform &copy; 2026 | No Payment - Exchange Only</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from './api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const activeMenu = computed(() => route.path)
const unreadCount = ref(0)

onMounted(() => {
  authStore.restoreFromLocal()
  if (isLoggedIn.value) {
    fetchUnread()
  }
})

async function fetchUnread() {
  try {
    const res = await api.get('/api/messages/inbox')
    unreadCount.value = res.data.filter(m => !m.is_read).length
  } catch (e) {}
}

function handleCommand(cmd) {
  if (cmd === 'logout') {
    ElMessageBox.confirm('Are you sure you want to logout?', 'Confirm', {
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }).then(() => {
      authStore.logout()
      ElMessage.success('Logged out')
      router.push('/')
    }).catch(() => {})
  } else if (cmd === 'profile') {
    ElMessage.info('Profile feature coming soon')
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f5f7fa;
}
.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  height: 60px;
  line-height: 60px;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
  text-decoration: none;
  margin-right: 40px;
}
.logo .el-icon {
  font-size: 24px;
}
.header-menu {
  flex: 1;
  border-bottom: none;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 0 10px;
}
.user-info:hover {
  color: #409eff;
}
.username {
  font-size: 14px;
}
.msg-badge {
  margin-left: 4px;
}
.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}
.app-footer {
  text-align: center;
  color: #909399;
  font-size: 13px;
  padding: 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
