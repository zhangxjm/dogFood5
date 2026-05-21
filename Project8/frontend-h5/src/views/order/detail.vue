<template>
  <div class="page">
    <van-nav-bar
      title="订单详情"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content" v-if="order">
      <div class="status-card">
        <span class="status-icon">{{ order.status === 1 ? '⏳' : '✅' }}</span>
        <div class="status-info">
          <span class="status-text">{{ getStatusText(order.status) }}</span>
          <span class="status-desc" v-if="order.status === 1">请向顾客确认商品后核销</span>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">订单信息</div>
        <van-cell-group inset border={false}>
          <van-cell title="订单号" :value="order.order_no" />
          <van-cell title="下单时间" :value="order.created_at" />
          <van-cell title="支付时间" :value="order.payment_time || '-'" />
          <van-cell title="核销时间" :value="order.verify_time || '-'" v-if="order.verify_time" />
          <van-cell title="提货码" :value="order.pickup_code" v-if="order.pickup_code" />
        </van-cell-group>
      </div>
      
      <div class="card">
        <div class="card-title">顾客信息</div>
        <van-cell-group inset border={false}>
          <van-cell title="姓名" :value="order.user_name" />
          <van-cell title="手机号" :value="order.user_phone" />
        </van-cell-group>
      </div>
      
      <div class="card">
        <div class="card-title">商品清单</div>
        <div class="goods-list">
          <div class="goods-item" v-for="item in order.items" :key="item.id">
            <div class="goods-image">
              <span>📦</span>
            </div>
            <div class="goods-info">
              <span class="goods-name">{{ item.product_name }}</span>
              <span class="goods-spec">¥{{ item.price }} × {{ item.quantity }}</span>
            </div>
            <div class="goods-amount">
              <span>¥{{ item.total_price }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">金额明细</div>
        <van-cell-group inset border={false}>
          <van-cell title="订单金额" :value="`¥${order.total_amount}`" />
          <van-cell title="佣金收益" :value="`+¥${order.commission_amount}`" value-class="text-success" />
        </van-cell-group>
      </div>
      
      <van-button
        v-if="order.status === 1"
        type="primary"
        block
        class="verify-btn"
        @click="handleVerify"
      >
        确认核销
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

const order = ref(null)
const orderId = route.params.id
const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const getStatusText = (status) => {
  const texts = { 0: '待付款', 1: '待核销', 2: '已核销', 3: '已完成', 4: '已取消' }
  return texts[status] || '未知'
}

const loadDetail = async () => {
  try {
    const res = await request({ url: `/order/detail/${orderId}` })
    order.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleVerify = async () => {
  try {
    await showConfirmDialog({
      title: '确认核销',
      message: '确定核销该订单吗？'
    })
    
    await request({
      url: '/order/verify',
      method: 'POST',
      data: {
        leader_id: leaderId,
        order_id: orderId
      }
    })
    
    showToast('核销成功')
    setTimeout(() => {
      router.back()
    }, 500)
  } catch (e) {
    console.error(e)
  }
}

const onBack = () => {
  router.back()
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.status-icon {
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
.status-info {
  flex: 1;
}
.status-text {
  display: block;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 6px;
}
.status-desc {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}
.goods-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.goods-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.goods-image {
  width: 50px;
  height: 50px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.goods-name {
  font-size: 14px;
  color: #333;
}
.goods-spec {
  font-size: 12px;
  color: #999;
}
.goods-amount {
  font-size: 14px;
  color: #ff4d4f;
  font-weight: 500;
}
.verify-btn {
  margin-top: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
</style>
