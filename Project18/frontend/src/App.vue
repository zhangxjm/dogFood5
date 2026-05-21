<template>
  <div id="app">
    <el-container class="main-container">
      <el-header class="header">
        <div class="header-content">
          <div class="logo" @click="$router.push('/')">
            <el-icon size="32" color="#409EFF"><Picture /></el-icon>
            <span class="logo-text">书画作品展示平台</span>
          </div>
          <div class="nav-menu">
            <el-button @click="$router.push('/')" type="text">首页</el-button>
            <el-dropdown @command="handleCategoryClick">
              <span class="el-dropdown-link">
                分类 <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="cat in categories" :key="cat.id" :command="cat.id">
                    {{ cat.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary" @click="$router.push('/upload')">
              <el-icon><Upload /></el-icon>
              上传作品
            </el-button>
          </div>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
      <el-footer class="footer">
        <p>© 2024 书画作品展示平台 - 传承艺术之美</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryAPI } from './api'

const router = useRouter()
const categories = ref([])

const loadCategories = async () => {
  try {
    const res = await categoryAPI.getAll()
    categories.value = res.data
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const handleCategoryClick = (categoryId) => {
  router.push(`/category/${categoryId}`)
}

onMounted(() => {
  loadCategories()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background: #f5f7fa;
}

#app {
  min-height: 100vh;
}

.main-container {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  height: auto;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-text {
  font-size: 22px;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-menu .el-button--text {
  color: white;
  font-size: 16px;
}

.nav-menu .el-dropdown-link {
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.main-content {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
}

.footer {
  background: #303133;
  color: #909399;
  text-align: center;
  padding: 20px 0;
}
</style>
