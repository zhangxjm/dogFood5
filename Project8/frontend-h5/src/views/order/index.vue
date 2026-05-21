<template>
  <div class="page">
    <div class="page-content">
      <van-tabs v-model:active="activeTab">
        <van-tab title="全部">
          <OrderList :status="null" />
        </van-tab>
        <van-tab title="待核销">
          <OrderList :status="1" />
        </van-tab>
        <van-tab title="已完成">
          <OrderList :status="2" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderList from './list.vue'

const activeTab = ref(0)
</script>
