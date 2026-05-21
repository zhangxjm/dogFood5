<template>
  <div id="app">
    <router-view />
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item icon="shopping-cart-o" to="/">点餐</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/orders">订单</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/summary">汇总</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/admin">管理</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref(0)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}
.page-content {
  padding: 12px;
}
</style>