<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-content">
        <h1><el-icon><Watermelon /></el-icon> 企业饮用水管理系统</h1>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="activeMenu"
          router
          class="menu"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页概览</span>
          </el-menu-item>
          <el-menu-item index="/inventory">
            <el-icon><Box /></el-icon>
            <span>库存管理</span>
          </el-menu-item>
          <el-menu-item index="/claim">
            <el-icon><Document /></el-icon>
            <span>申领登记</span>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <el-icon><DataLine /></el-icon>
            <span>统计报表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container {
  height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header h1 {
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
}

.menu {
  border-right: none;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>