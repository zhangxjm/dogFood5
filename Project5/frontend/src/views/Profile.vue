<template>
  <div class="profile">
    <van-nav-bar title="个人中心" left-arrow @click-left="$router.back()" />
    
    <van-cell-group v-if="store.currentUser">
      <van-cell title="姓名" :value="store.currentUser.name" />
      <van-cell title="手机号" :value="store.currentUser.phone" />
      <van-cell title="角色" :value="store.userRole === 'customer' ? '顾客' : '跑腿员'" />
      <van-cell v-if="store.currentUser.rating" title="评分" :value="store.currentUser.rating.toFixed(1)" />
      <van-cell v-if="store.currentUser.orderCount" title="完成订单" :value="store.currentUser.orderCount" />
    </van-cell-group>

    <div v-if="store.userRole === 'runner'" class="reviews-section">
      <h3>我的评价</h3>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="review in reviews" :key="review._id" :title="review.customerId?.name">
            <template #value>
              <van-rate v-model="review.rating" readonly />
            </template>
            <template #desc>
              {{ review.comment || '暂无评价' }}
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <div class="action">
      <van-button type="danger" block @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { store } from '../store'
import { reviewApi } from '../api'

const router = useRouter()
const reviews = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

onMounted(() => {
  store.loadUser()
  if (store.userRole === 'runner' && store.isLoggedIn()) {
    loadReviews()
  }
})

async function loadReviews() {
  if (!store.isLoggedIn()) {
    loading.value = false
    return
  }
  try {
    const res = await reviewApi.getByRunner(store.getUserId())
    reviews.value = res.data || []
    finished.value = true
  } catch (e) {
    console.error('Load reviews error:', e)
    showToast(e.response?.data?.message || '加载评价失败')
  }
  loading.value = false
}

function onLoad() {
  loading.value = true
  loadReviews()
}

function onRefresh() {
  finished.value = false
  loading.value = false
  loadReviews()
  refreshing.value = false
}

function logout() {
  store.logout()
  router.push('/')
}
</script>

<style scoped>
.profile {
  padding-bottom: 20px;
}

.reviews-section {
  padding: 16px;
}

.reviews-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.action {
  margin-top: 20px;
  padding: 0 16px;
}
</style>
