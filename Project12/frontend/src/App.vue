<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: #2f4050">
      <div style="color: white; text-align: center; padding: 20px 0; font-size: 18px; font-weight: bold">
        材料领用系统
      </div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#2f4050"
        text-color="#fff"
        active-text-color="#1890ff"
        router
      >
        <el-menu-item index="/materials">
          <el-icon><Box /></el-icon>
          <span>材料管理</span>
        </el-menu-item>
        <el-menu-item index="/teams">
          <el-icon><User /></el-icon>
          <span>班组管理</span>
        </el-menu-item>
        <el-menu-item index="/record">
          <el-icon><Document /></el-icon>
          <span>领用/归还登记</span>
        </el-menu-item>
        <el-menu-item index="/records">
          <el-icon><List /></el-icon>
          <span>台账查询</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main style="background-color: #f3f3f4">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
