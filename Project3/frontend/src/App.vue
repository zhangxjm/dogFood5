<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <i class="bi bi-bar-chart-line me-2"></i>在线投票系统
        </router-link>
        <div class="navbar-nav">
          <router-link to="/" class="nav-link">投票列表</router-link>
          <router-link to="/create" class="nav-link">创建投票</router-link>
          <router-link to="/history" class="nav-link">投票历史</router-link>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>

<style>
body {
  background-color: #f8f9fa;
}
.app {
  min-height: 100vh;
}
</style>
