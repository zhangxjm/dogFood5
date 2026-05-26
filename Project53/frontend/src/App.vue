<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible theme="dark">
      <div class="logo">
        <span v-if="!collapsed">酒水管理系统</span>
        <span v-else>酒</span>
      </div>
      <a-menu theme="dark" mode="inline" :selected-keys="selectedKeys">
        <a-menu-item key="/" @click="goTo('/')">
          <template #icon><dashboard-outlined /></template>
          <span>首页概览</span>
        </a-menu-item>
        <a-menu-item key="/category" @click="goTo('/category')">
          <template #icon><appstore-outlined /></template>
          <span>酒水品类</span>
        </a-menu-item>
        <a-menu-item key="/product" @click="goTo('/product')">
          <template #icon><stock-outlined /></template>
          <span>酒水库存</span>
        </a-menu-item>
        <a-menu-item key="/sale" @click="goTo('/sale')">
          <template #icon><shopping-cart-outlined /></template>
          <span>售卖记录</span>
        </a-menu-item>
        <a-menu-item key="/expiry-alert" @click="goTo('/expiry-alert')">
          <template #icon><warning-outlined /></template>
          <span>临期提醒</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px">
        <span class="header-title">{{ currentTitle }}</span>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DashboardOutlined,
  AppstoreOutlined,
  StockOutlined,
  ShoppingCartOutlined,
  WarningOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKeys = computed(() => [route.path])
const currentTitle = computed(() => route.meta.title || '酒水管理系统')

const goTo = (path) => {
  router.push(path)
}
</script>

<style>
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: #001529;
}
.header-title {
  font-size: 18px;
  font-weight: 600;
}
</style>
