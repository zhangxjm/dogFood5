<template>
  <div id="app">
    <router-view />
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from './components/BottomNav.vue'
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
