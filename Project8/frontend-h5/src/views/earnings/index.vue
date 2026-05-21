<template>
  <div class="page">
    <van-nav-bar
      title="收益统计"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="stats-card">
      <div class="stats-main">
        <span class="stats-label">累计收益(元)</span>
        <span class="stats-value">¥{{ stats.total_earnings || '0.00' }}</span>
      </div>
      <div class="stats-grid">
        <div class="stats-item">
          <span class="item-value">¥{{ stats.today_earnings || '0.00' }}</span>
          <span class="item-label">今日收益</span>
        </div>
        <div class="stats-item">
          <span class="item-value">¥{{ stats.month_earnings || '0.00' }}</span>
          <span class="item-label">本月收益</span>
        </div>
        <div class="stats-item">
          <span class="item-value">¥{{ stats.available_balance || '0.00' }}</span>
          <span class="item-label">可提现</span>
        </div>
      </div>
    </div>
    
    <div class="page-content">
      <van-button type="primary" block @click="goWithdraw">申请提现</van-button>
      
      <div class="list-card" style="margin-top: 16px;">
        <div class="card-title">收益明细</div>
        
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div class="earnings-item" v-for="item in list" :key="item.id">
              <div class="item-info">
                <span class="item-title">销售佣金</span>
                <span class="item-order">订单: {{ item.order_no }}</span>
                <span class="item-time">{{ item.created_at }}</span>
              </div>
              <div class="item-amount">
                <span class="amount">+{{ item.amount }}</span>
                <span class="status" :class="{ settled: item.status === 1 }">
                  {{ item.status === 1 ? '已结算' : '待结算' }}
                </span>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
        
        <van-empty v-if="list.length === 0 && !loading" description="暂无收益记录" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const stats = ref({})
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = 10

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const loadStats = async () => {
  try {
    const res = await request({ url: `/earnings/statistics/${leaderId}` })
    stats.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadList = async () => {
  if (!leaderId) return
  
  try {
    const res = await request({ 
      url: `/earnings/list/${leaderId}?page=${page.value}&page_size=${pageSize}` 
    })
    const data = res.data
    
    if (refreshing.value) {
      list.value = data.list
      refreshing.value = false
    } else {
      list.value = [...list.value, ...data.list]
    }
    
    loading.value = false
    if (data.list.length < pageSize) {
      finished.value = true
    }
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

const onLoad = () => {
  if (!refreshing.value) {
    page.value++
    loadList()
  }
}

const onRefresh = () => {
  finished.value = false
  page.value = 1
  loadList()
}

const goWithdraw = () => {
  router.push('/withdrawal/apply')
}

const onBack = () => {
  router.back()
}

onMounted(() => {
  loadStats()
  loadList()
})
</script>

<style scoped>
.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
}
.stats-main {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.stats-label {
  display: block;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 8px;
}
.stats-value {
  font-size: 36px;
  font-weight: bold;
  color: #fff;
}
.stats-grid {
  display: flex;
  padding-top: 24px;
}
.stats-item {
  flex: 1;
  text-align: center;
}
.item-value {
  display: block;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 6px;
}
.item-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}
.list-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}
.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}
.earnings-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}
.earnings-item:last-child {
  border-bottom: none;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.item-title {
  font-size: 15px;
  color: #333;
}
.item-order {
  font-size: 12px;
  color: #999;
}
.item-time {
  font-size: 12px;
  color: #999;
}
.item-amount {
  text-align: right;
}
.amount {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #52c41a;
  margin-bottom: 4px;
}
.status {
  font-size: 12px;
  color: #999;
}
.status.settled {
  color: #52c41a;
}
</style>
