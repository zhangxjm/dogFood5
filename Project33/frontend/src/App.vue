<template>
  <el-container class="layout-container">
    <el-header class="header">
      <h1>母婴实体店会员管理系统</h1>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/members">
            <el-icon><User /></el-icon>
            <span>会员管理</span>
          </el-menu-item>
          <el-menu-item index="/member-levels">
            <el-icon><Medal /></el-icon>
            <span>会员等级</span>
          </el-menu-item>
          <el-menu-item index="/consumption-records">
            <el-icon><ShoppingCart /></el-icon>
            <span>消费记录</span>
          </el-menu-item>
          <el-menu-item index="/benefits">
            <el-icon><Gift /></el-icon>
            <span>福利管理</span>
          </el-menu-item>
          <el-menu-item index="/benefit-claims">
            <el-icon><Tickets /></el-icon>
            <span>福利领取</span>
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
.layout-container {
  height: 100vh;
}
.header {
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.header h1 {
  margin: 0;
  font-size: 24px;
}
.aside {
  background: #545c64;
}
.main {
  background: #f5f7fa;
  padding: 20px;
}
</style>