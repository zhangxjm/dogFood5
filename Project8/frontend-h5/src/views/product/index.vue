<template>
  <div class="page">
    <div class="page-content">
      <van-button class="add-btn" @click="goAdd">+ 添加商品</van-button>
      
      <van-tabs v-model:active="activeTab">
        <van-tab title="全部">
          <ProductList :status="null" />
        </van-tab>
        <van-tab title="上架中">
          <ProductList :status="1" />
        </van-tab>
        <van-tab title="已下架">
          <ProductList :status="0" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductList from './list.vue'

const router = useRouter()
const activeTab = ref(0)

const goAdd = () => {
  router.push('/product/form')
}
</script>
