<template>
    <el-container class="layout-container">
        <el-aside width="200px" class="aside">
            <div class="logo">
                <el-icon><Agriculture /></el-icon>
                <span>农产品销售</span>
            </div>
            <el-menu
                :default-active="activeMenu"
                router
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF"
            >
                <el-menu-item index="/">
                    <el-icon><DataAnalysis /></el-icon>
                    <span>数据统计</span>
                </el-menu-item>
                <el-menu-item index="/products">
                    <el-icon><Goods /></el-icon>
                    <span>商品管理</span>
                </el-menu-item>
                <el-menu-item index="/orders">
                    <el-icon><Document /></el-icon>
                    <span>订单管理</span>
                </el-menu-item>
                <el-menu-item index="/customers">
                    <el-icon><User /></el-icon>
                    <span>客户管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <div class="header-title">农产品销售系统 - 农户版</div>
            </el-header>
            <el-main class="main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.layout-container {
    height: 100vh;
}
.aside {
    background-color: #304156;
}
.logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    gap: 8px;
}
.header {
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
}
.header-title {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
}
.main {
    background-color: #f0f2f5;
}
</style>
