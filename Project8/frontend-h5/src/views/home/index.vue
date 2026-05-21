<template>
  <div class="page">
    <div class="header">
      <div class="user-info">
        <div class="avatar">
          <span>{{ leaderInfo.name ? leaderInfo.name.charAt(0) : '团' }}</span>
        </div>
        <div class="info">
          <span class="name">{{ leaderInfo.name || '团长' }}</span>
          <span class="phone">{{ leaderInfo.phone || '' }}</span>
        </div>
      </div>
    </div>
    
    <div class="page-content">
      <div class="stats-card">
        <div class="stats-item" @click="goPage('/earnings')">
          <span class="stats-value">¥{{ earnings.total_earnings || '0.00' }}</span>
          <span class="stats-label">累计收益</span>
        </div>
        <div class="stats-item">
          <span class="stats-value">¥{{ earnings.today_earnings || '0.00' }}</span>
          <span class="stats-label">今日收益</span>
        </div>
        <div class="stats-item">
          <span class="stats-value">¥{{ earnings.available_balance || '0.00' }}</span>
          <span class="stats-label">可提现</span>
        </div>
      </div>
      
      <van-grid :column-num="3" class="menu-grid">
        <van-grid-item icon="scan" text="订单核销" @click="goPage('/order/verify')" />
        <van-grid-item icon="goods-collect" text="商品管理" @click="goPage('/product')" />
        <van-grid-item icon="orders-o" text="订单管理" @click="goPage('/order')" />
        <van-grid-item icon="location-o" text="自提点" @click="goPage('/pickup')" />
        <van-grid-item icon="balance-o" text="收益统计" @click="goPage('/earnings')" />
        <van-grid-item icon="underway-o" text="申请提现" @click="goPage('/withdrawal/apply')" />
      </van-grid>
      
      <div class="card">
        <div class="card-title">订单统计</div>
        <div class="order-grid">
          <div class="order-item">
            <span class="order-num">{{ orderStats.total_orders || 0 }}</span>
            <span class="order-label">总订单</span>
          </div>
          <div class="order-item">
            <span class="order-num">{{ orderStats.today_orders || 0 }}</span>
            <span class="order-label">今日订单</span>
          </div>
          <div class="order-item">
            <span class="order-num">{{ orderStats.pending_orders || 0 }}</span>
            <span class="order-label">待核销</span>
          </div>
          <div class="order-item">
            <span class="order-num">{{ orderStats.completed_orders || 0 }}</span>
            <span class="order-label">已完成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const leaderInfo = ref({})
const earnings = ref({})
const orderStats = ref({})

const loadData = async () => {
  const leader = JSON.parse(localStorage.getItem('leaderInfo') || '{}')
  leaderInfo.value = leader
  
  if (leader.id) {
    await Promise.all([
      loadEarnings(leader.id),
      loadOrderStats(leader.id)
    ])
  }
}

const loadEarnings = async (leaderId) => {
  try {
    const res = await request({ url: `/earnings/statistics/${leaderId}` })
    earnings.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadOrderStats = async (leaderId) => {
  try {
    const res = await request({ url: `/order/statistics/${leaderId}` })
    orderStats.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const goPage = (url) => {
  router.push(url)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  margin-bottom: 16px;
}
.user-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 56px;
  height: 56px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}
.avatar span {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
}
.info {
  display: flex;
  flex-direction: column;
}
.name {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}
.phone {
  color: rgba(255,255,255,0.8);
  font-size: 14px;
}
.stats-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 12px;
  display: flex;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 16px;
}
.stats-item {
  flex: 1;
  text-align: center;
}
.stats-value {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 6px;
}
.stats-label {
  font-size: 12px;
  color: #999;
}
.menu-grid {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
}
.order-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.order-item {
  text-align: center;
}
.order-num {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 6px;
}
.order-label {
  font-size: 12px;
  color: #999;
}
</style>
