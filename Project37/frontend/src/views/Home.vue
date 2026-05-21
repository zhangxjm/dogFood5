<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="background-color: #304156; color: white;">
      <div style="height: 60px; line-height: 60px; text-align: center; font-size: 18px; font-weight: bold; border-bottom: 1px solid #1f2d3d;">
        文件传阅系统
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/home/upload">
          <el-icon><Document /></el-icon>
          <span>文件上传</span>
        </el-menu-item>
        <el-menu-item index="/home/circulate">
          <el-icon><Share /></el-icon>
          <span>文件传阅</span>
        </el-menu-item>
        <el-menu-item index="/home/received">
          <el-icon><Download /></el-icon>
          <span>收到的文件</span>
        </el-menu-item>
        <el-menu-item index="/home/status">
          <el-icon><DataLine /></el-icon>
          <span>传阅状态</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background-color: #fff; border-bottom: 1px solid #e6e6e6; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 18px; font-weight: bold;">欢迎使用企业内部文件传阅系统</span>
        <div style="display: flex; align-items: center; gap: 15px;">
          <span>当前用户: {{ user?.realName }} ({{ user?.department }})</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main style="background-color: #f0f2f5; padding: 20px;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Document, Share, Download, DataLine } from '@element-plus/icons-vue'

export default {
  name: 'Home',
  components: { Document, Share, Download, DataLine },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const user = computed(() => {
      return JSON.parse(localStorage.getItem('user') || '{}')
    })

    const activeMenu = computed(() => route.path)

    const handleLogout = () => {
      localStorage.removeItem('user')
      router.push('/')
    }

    onMounted(() => {
      if (!localStorage.getItem('user')) {
        router.push('/')
      }
    })

    return {
      user,
      activeMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.el-header {
  padding: 0 20px;
}
</style>
