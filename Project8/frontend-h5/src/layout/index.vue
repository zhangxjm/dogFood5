<template>
  <div class="layout">
    <router-view />
    <van-tabbar v-model="active" route active-color="#667eea">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/product" icon="orders-o">商品</van-tabbar-item>
      <van-tabbar-item to="/order" icon="description">订单</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(route.path)
</script>

<style scoped>
.layout {
  min-height: 100vh;
  padding-bottom: 50px;
}
</style>
