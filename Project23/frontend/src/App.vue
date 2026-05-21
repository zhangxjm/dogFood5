<template>
  <el-container style="height: 100vh;">
    <el-header style="background: #409EFF; color: white; display: flex; align-items: center; padding: 0 20px;">
      <h1 style="margin: 0; font-size: 24px;">🐾 宠物用品门店管理系统</h1>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background: #f5f5f5;">
        <el-menu
          :default-active="activeMenu"
          router
          style="border-right: none;"
        >
          <el-menu-item index="/">
            <span>🏠 首页</span>
          </el-menu-item>
          <el-menu-item index="/categories">
            <span>📁 商品分类</span>
          </el-menu-item>
          <el-menu-item index="/products">
            <span>📦 商品管理</span>
          </el-menu-item>
          <el-menu-item index="/sales">
            <span>🛒 销售记录</span>
          </el-menu-item>
          <el-menu-item index="/hot-products">
            <span>📊 热销统计</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background: #fff; padding: 20px;">
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
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
