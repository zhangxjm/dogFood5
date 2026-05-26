<template>
  <el-container class="layout-container">
    <el-aside width="220px" style="background: #001529;">
      <div class="sidebar-logo">布草物资管理系统</div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
        router>
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/inventory">
          <el-icon><Goods /></el-icon>
          <span>布草库存</span>
        </el-menu-item>
        <el-menu-item index="/cleaning">
          <el-icon><Brush /></el-icon>
          <span>清洗登记</span>
        </el-menu-item>
        <el-menu-item index="/usage">
          <el-icon><ShoppingCart /></el-icon>
          <span>领用归还</span>
        </el-menu-item>
        <el-menu-item index="/loss">
          <el-icon><Warning /></el-icon>
          <span>损耗记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background: #fff; border-bottom: 1px solid #e6e6e6; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 16px; font-weight: bold;">{{ $route.meta.title || '酒店布草物资管理系统' }}</span>
        <span style="color: #666;">{{ currentTime }}</span>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.el-menu-vertical {
  border-right: none;
}
</style>
