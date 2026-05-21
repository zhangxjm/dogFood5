<template>
  <div class="my-orders">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.back()" />
    
    <van-tabs v-model:active="activeTab">
      <van-tab title="全部" name="all">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-card
              v-for="order in orders"
              :key="order._id"
              :title="order.title"
              :desc="order.description"
              :price="order.price"
              @click="goToDetail(order._id)"
            >
              <template #tag>
                <van-tag type="primary">{{ getStatusText(order.status) }}</van-tag>
              </template>
              <template #footer>
                <span>{{ order.pickupAddress }} → {{ order.deliveryAddress }}</span>
              </template>
            </van-card>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { store } from '../store'
import { orderApi } from '../api'

const router = useRouter()
const orders = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const activeTab = ref('all')

onMounted(() => {
  store.loadUser()
  if (store.currentUser) {
    loadOrders()
  }
})

async function loadOrders() {
  if (!store.isLoggedIn()) {
    loading.value = false
    return
  }
  try {
    let res
    if (store.userRole === 'runner') {
      res = await orderApi.getByRunner(store.getUserId())
    } else {
      res = await orderApi.getByCustomer(store.getUserId())
    }
    orders.value = res.data || []
    finished.value = true
  } catch (e) {
    console.error('Load orders error:', e)
    showToast(e.response?.data?.message || '加载订单失败')
  }
  loading.value = false
}

function onLoad() {
  loading.value = true
  loadOrders()
}

function onRefresh() {
  finished.value = false
  loading.value = false
  loadOrders()
  refreshing.value = false
}

function goToDetail(id) {
  router.push(`/order/${id}`)
}

function getStatusText(status) {
  const map = {
    pending: '待接单',
    accepted: '已接单',
    picked_up: '已取件',
    delivered: '已送达',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}
</script>

<style scoped>
.my-orders {
  min-height: 100vh;
}
</style>
