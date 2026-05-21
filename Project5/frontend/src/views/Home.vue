<template>
  <div class="home">
    <van-nav-bar title="跑腿服务平台" />
    
    <div class="user-section">
      <van-cell-group v-if="!store.currentUser">
        <van-field v-model="phone" label="手机号" placeholder="请输入手机号" />
        <van-field v-model="name" label="姓名" placeholder="请输入姓名" />
        <div class="role-select">
          <van-radio-group v-model="role" direction="horizontal">
            <van-radio name="customer">我是顾客</van-radio>
            <van-radio name="runner">我是跑腿员</van-radio>
          </van-radio-group>
        </div>
        <van-button type="primary" block @click="login">登录/注册</van-button>
      </van-cell-group>
      
      <van-cell-group v-else>
        <van-cell title="当前用户" :value="store.currentUser.name" />
        <van-cell title="角色" :value="store.userRole === 'customer' ? '顾客' : '跑腿员'" />
        <van-button type="danger" block @click="logout">退出登录</van-button>
      </van-cell-group>
    </div>

    <div v-if="store.currentUser" class="orders-section">
      <h3 v-if="store.userRole === 'runner'">待接订单</h3>
      <h3 v-else>我的订单</h3>
      
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
    </div>

    <van-tabbar v-if="store.currentUser" v-model="activeTab">
      <van-tabbar-item icon="home-o" @click="$router.push('/')">首页</van-tabbar-item>
      <van-tabbar-item v-if="store.userRole === 'customer'" icon="plus-o" @click="$router.push('/order/create')">发单</van-tabbar-item>
      <van-tabbar-item icon="orders-o" @click="$router.push('/my-orders')">我的</van-tabbar-item>
      <van-tabbar-item icon="user-o" @click="$router.push('/profile')">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { store } from '../store'
import { userApi, orderApi } from '../api'
import { initSocket, getSocket } from '../utils/socket'

const router = useRouter()
const phone = ref('')
const name = ref('')
const role = ref('customer')
const orders = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const activeTab = ref(0)

onMounted(() => {
  store.loadUser()
  if (store.currentUser) {
    loadOrders()
    setupSocket()
  }
})

function setupSocket() {
  if (!store.isLoggedIn()) {
    return
  }
  const socket = initSocket(store.getUserId())
  socket.on('orderCreated', (order) => {
    if (store.userRole === 'runner') {
      orders.value.unshift(order)
    }
  })
  socket.on('orderAccepted', (order) => {
    const index = orders.value.findIndex(o => o._id === order._id)
    if (index !== -1) {
      orders.value[index] = order
    }
  })
  socket.on('orderStatusUpdated', (order) => {
    const index = orders.value.findIndex(o => o._id === order._id)
    if (index !== -1) {
      orders.value[index] = order
    }
  })
}

async function login() {
  if (!phone.value || !name.value) {
    showToast('请填写完整信息')
    return
  }
  try {
    const res = await userApi.create({ phone: phone.value, name: name.value, role: role.value })
    store.setUser(res.data)
    showToast('登录成功')
    loadOrders()
    setupSocket()
  } catch (e) {
    showToast('登录失败')
  }
}

function logout() {
  store.logout()
  orders.value = []
}

async function loadOrders() {
  if (!store.isLoggedIn()) {
    loading.value = false
    return
  }
  try {
    let res
    if (store.userRole === 'runner') {
      res = await orderApi.getPending()
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
.home {
  padding-bottom: 50px;
}

.user-section {
  padding: 16px;
}

.role-select {
  padding: 12px 16px;
}

.orders-section {
  padding: 0 16px;
}

.orders-section h3 {
  margin: 16px 0;
  font-size: 16px;
}
</style>
