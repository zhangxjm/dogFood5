<template>
  <div id="app">
    <router-view />
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item icon="calendar" to="/" name="home">预约练车</van-tabbar-item>
      <van-tabbar-item icon="orders" to="/bookings" name="bookings">我的预约</van-tabbar-item>
      <van-tabbar-item icon="records" to="/records" name="records">练车记录</van-tabbar-item>
      <van-tabbar-item icon="user" to="/profile" name="profile">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('home')
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>
