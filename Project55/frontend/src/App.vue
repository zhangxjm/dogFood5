<template>
  <el-container class="app-container">
    <el-header class="header">
      <div class="header-content">
        <h1>剧本杀门店管理系统</h1>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px" class="aside">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页概览</span>
          </el-menu-item>
          <el-menu-item index="/script-type">
            <el-icon><Collection /></el-icon>
            <span>剧本类型管理</span>
          </el-menu-item>
          <el-menu-item index="/script-inventory">
            <el-icon><Goods /></el-icon>
            <span>剧本库存管理</span>
          </el-menu-item>
          <el-menu-item index="/session-record">
            <el-icon><Tickets /></el-icon>
            <span>场次开本记录</span>
          </el-menu-item>
          <el-menu-item index="/player-record">
            <el-icon><User /></el-icon>
            <span>玩家游玩记录</span>
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

html, body, #app {
  height: 100%;
}

.app-container {
  height: 100%;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content h1 {
  color: #fff;
  font-size: 24px;
}

.aside {
  background-color: #545c64;
  height: calc(100vh - 60px);
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
}

.el-menu {
  border-right: none;
}
</style>
