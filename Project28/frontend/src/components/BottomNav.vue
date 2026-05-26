<template>
  <div class="bottom-nav">
    <div
      class="nav-item"
      :class="{ active: $route.path === '/home' }"
      @click="$router.push('/home')"
    >
      <span class="nav-icon">🏠</span>
      <span>Home</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: $route.path === '/sales' }"
      @click="$router.push('/sales')"
    >
      <span class="nav-icon">📋</span>
      <span>Records</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: $route.path === '/add-sale' }"
      @click="$router.push('/add-sale')"
    >
      <span class="nav-icon">➕</span>
      <span>Add</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: $route.path === '/statistics' }"
      @click="$router.push('/statistics')"
    >
      <span class="nav-icon">📊</span>
      <span>Stats</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: $route.path === '/hot-sales' }"
      @click="$router.push('/hot-sales')"
    >
      <span class="nav-icon">🔥</span>
      <span>Ranking</span>
    </div>
  </div>
</template>

<script setup>
</script>
