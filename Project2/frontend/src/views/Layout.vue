<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: #2c3e50">
      <div class="logo">
        <h3>维修系统</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#2c3e50"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="/devices">
          <el-icon><Monitor /></el-icon>
          <span>设备台账</span>
        </el-menu-item>
        <el-menu-item index="/repair-requests">
          <el-icon><Document /></el-icon>
          <span>报修申请</span>
        </el-menu-item>
        <el-menu-item index="/assignments">
          <el-icon><User /></el-icon>
          <span>维修派单</span>
        </el-menu-item>
        <el-menu-item index="/records">
          <el-icon><Tickets /></el-icon>
          <span>维修记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background-color: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center">
        <h2 style="margin: 0">{{ pageTitle }}</h2>
        <div style="display: flex; align-items: center; gap: 15px">
          <span>欢迎，{{ currentUser?.real_name }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main style="background-color: #f5f7fa">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const activeMenu = ref(route.path)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '数据统计',
    '/devices': '设备台账',
    '/repair-requests': '报修申请',
    '/assignments': '维修派单',
    '/records': '维修记录'
  }
  return titles[route.path] || '设备维修报修系统'
})

watch(() => route.path, (path) => {
  activeMenu.value = path
})

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.success('退出成功')
    router.push('/login')
  } catch {
  }
}
</script>

<style scoped>
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h3 {
  margin: 0;
  font-size: 18px;
}
</style>
