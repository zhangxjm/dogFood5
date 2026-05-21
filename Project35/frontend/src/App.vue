<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <div class="logo">
          <el-icon size="32" color="#4CAF50"><Grass /></el-icon>
          <span class="title">同城绿植养护服务</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="nav-menu"
        >
          <el-menu-item index="/">服务列表</el-menu-item>
          <el-menu-item index="/appointments">我的预约</el-menu-item>
          <el-menu-item index="/reviews">服务评价</el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
      <el-footer class="footer">
        <p>© 2024 同城绿植养护服务预约系统</p>
      </el-footer>
    </el-container>
  </div>
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

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
}

.nav-menu {
  border: none;
}

.main {
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #fff;
  color: #666;
}
</style>
