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
      <div class="wallet-card" @click="goPage('/earnings')">
        <div class="wallet-item">
          <span class="wallet-label">累计收益</span>
          <span class="wallet-value">¥{{ wallet.total_earnings || '0.00' }}</span>
        </div>
        <div class="wallet-item">
          <span class="wallet-label">可提现</span>
          <span class="wallet-value">¥{{ wallet.available_balance || '0.00' }}</span>
        </div>
        <div class="wallet-item">
          <span class="wallet-label">冻结中</span>
          <span class="wallet-value">¥{{ wallet.frozen_balance || '0.00' }}</span>
        </div>
      </div>
      
      <van-cell-group inset class="menu-list">
        <van-cell title="商品管理" is-link icon="goods-collect" @click="goPage('/product')" />
        <van-cell title="订单管理" is-link icon="orders-o" @click="goPage('/order')" />
        <van-cell title="订单核销" is-link icon="scan" @click="goPage('/order/verify')" />
        <van-cell title="自提点管理" is-link icon="location-o" @click="goPage('/pickup')" />
        <van-cell title="收益统计" is-link icon="balance-o" @click="goPage('/earnings')" />
        <van-cell title="提现记录" is-link icon="underway-o" @click="goPage('/withdrawal')" />
      </van-cell-group>
      
      <van-button
        type="danger"
        block
        class="logout-btn"
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const leaderInfo = ref({})
const wallet = ref({})

const loadData = async () => {
  const leader = JSON.parse(localStorage.getItem('leaderInfo') || '{}')
  leaderInfo.value = leader
  
  if (leader.id) {
    try {
      const res = await request({ url: `/earnings/statistics/${leader.id}` })
      wallet.value = res.data
    } catch (e) {
      console.error(e)
    }
  }
}

const goPage = (url) => {
  router.push(url)
}

const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: '确定要退出登录吗？'
    })
    
    userStore.logout()
    showToast('已退出')
    setTimeout(() => {
      router.replace('/login')
    }, 500)
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px 48px;
  margin-bottom: 16px;
}
.user-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 60px;
  height: 60px;
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
  gap: 6px;
}
.name {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}
.phone {
  color: rgba(255,255,255,0.8);
  font-size: 14px;
}
.wallet-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 12px;
  display: flex;
  margin-bottom: 16px;
}
.wallet-item {
  flex: 1;
  text-align: center;
}
.wallet-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}
.wallet-value {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}
.menu-list {
  margin-bottom: 24px;
}
.logout-btn {
  background: #fff;
  color: #ff4d4f;
  border: none;
}
</style>
