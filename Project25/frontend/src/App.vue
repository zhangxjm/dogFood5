<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: #2e3b4e">
      <div style="color: white; text-align: center; padding: 20px 0; font-size: 18px; font-weight: bold">
        文具采购管理
      </div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#2e3b4e"
        text-color="#fff"
        active-text-color="#409eff"
      >
        <el-menu-item index="/category">
          <el-icon><Folder /></el-icon>
          <span>品类管理</span>
        </el-menu-item>
        <el-menu-item index="/item">
          <el-icon><Box /></el-icon>
          <span>文具清单</span>
        </el-menu-item>
        <el-menu-item index="/order">
          <el-icon><Document /></el-icon>
          <span>采购订单</span>
        </el-menu-item>
        <el-menu-item index="/stockIn">
          <el-icon><Download /></el-icon>
          <span>入库核验</span>
        </el-menu-item>
        <el-menu-item index="/department">
          <el-icon><OfficeBuilding /></el-icon>
          <span>部门管理</span>
        </el-menu-item>
        <el-menu-item index="/claim">
          <el-icon><Tickets /></el-icon>
          <span>部门申领</span>
        </el-menu-item>
        <el-menu-item index="/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>申领统计</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background-color: #fff; border-bottom: 1px solid #eee">
        <div style="font-size: 20px; font-weight: bold; color: #333">办公文具批量采购管理平台</div>
      </el-header>
      <el-main style="background-color: #f5f7fa">
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
  box-sizing: border-box;
}
</style>
