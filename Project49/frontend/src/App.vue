<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-left">
        <el-icon :size="28" color="#fff"><Van /></el-icon>
        <h1 class="title">同城搬家服务管理系统</h1>
      </div>
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        class="menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/requests">
          <el-icon><Document /></el-icon>
          <span>搬家需求</span>
        </el-menu-item>
        <el-menu-item index="/vehicles">
          <el-icon><Van /></el-icon>
          <span>车型管理</span>
        </el-menu-item>
        <el-menu-item index="/records">
          <el-icon><List /></el-icon>
          <span>完成记录</span>
        </el-menu-item>
        <el-menu-item index="/ratings">
          <el-icon><Star /></el-icon>
          <span>服务评分</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  color: #fff;
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.menu {
  border-bottom: none;
}

.menu :deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
}

.main-content {
  padding: 0;
  background: #f0f2f5;
}
</style>
