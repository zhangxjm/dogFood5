<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🎨 亲子手工课报名系统</h1>
        <nav class="app-nav">
          <router-link to="/courses" class="nav-link">
            <span class="nav-icon">📚</span> 课程管理
          </router-link>
          <router-link to="/schedules" class="nav-link">
            <span class="nav-icon">📅</span> 课程表
          </router-link>
          <router-link to="/registrations" class="nav-link">
            <span class="nav-icon">📝</span> 报名记录
          </router-link>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
}
</style>
