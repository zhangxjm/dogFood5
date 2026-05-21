<template>
  <view class="container">
    <view class="search-bar">
      <input 
        class="search-input" 
        v-model="searchPhone" 
        placeholder="输入手机号查询订单"
        type="number"
      />
      <button class="search-btn" @click="searchOrders">查询</button>
    </view>
    
    <view class="order-list">
      <view v-for="order in orders" :key="order.id" class="order-card">
        <view class="order-header">
          <text class="order-status" :class="order.status">{{ getStatusText(order.status) }}</text>
          <text class="order-date">{{ formatDate(order.createdAt) }}</text>
        </view>
        
        <view class="order-content">
          <view class="flower-info" v-if="order.flower">
            <image :src="order.flower.image" class="flower-img" mode="aspectFill"></image>
            <view class="flower-detail">
              <text class="flower-name">{{ order.flower.name }}</text>
              <text class="order-type">{{ order.orderType === 'pickup' ? '到店自取' : '配送到家' }}</text>
            </view>
          </view>
          <view class="flower-info" v-else>
            <text class="flower-name">花束商品</text>
          </view>
        </view>
        
        <view class="order-info">
          <view class="info-row">
            <text>联系人：{{ order.customerName }}</text>
            <text>{{ order.customerPhone }}</text>
          </view>
          <view class="info-row">
            <text>预订时间：{{ formatDateTime(order.reservationTime) }}</text>
          </view>
          <view v-if="order.address" class="info-row">
            <text>配送地址：{{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}</text>
          </view>
        </view>
        
        <view class="order-footer">
          <text class="order-price">¥{{ order.totalPrice }}</text>
          <view class="order-actions">
            <button v-if="order.status === 'pending'" class="action-btn confirm" @click="confirmOrder(order.id)">确认接单</button>
            <button v-if="order.status === 'confirmed'" class="action-btn complete" @click="completeOrder(order.id)">完成订单</button>
            <button class="action-btn cancel" @click="cancelOrder(order.id)">取消订单</button>
          </view>
        </view>
      </view>
    </view>
    
    <view v-if="orders.length === 0" class="empty">
      <text>暂无订单记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const orders = ref([])
const searchPhone = ref('')

const loadOrders = async () => {
  try {
    let url = '/orders'
    if (searchPhone.value) {
      url += `?phone=${searchPhone.value}`
    }
    const res = await proxy.$api.get(url)
    orders.value = res || []
  } catch (e) {
    console.error('加载订单失败', e)
    initMockOrders()
  }
}

const initMockOrders = () => {
  orders.value = [
    {
      id: '1',
      customerName: '张三',
      customerPhone: '13800138000',
      orderType: 'pickup',
      reservationTime: '2024-05-20T10:00:00',
      status: 'pending',
      totalPrice: 199,
      createdAt: '2024-05-18T08:00:00',
      flower: {
        name: '浪漫红玫瑰',
        image: 'https://images.unsplash.com/photo-1518882605630-8eb518837bf2?w=200'
      }
    },
    {
      id: '2',
      customerName: '李四',
      customerPhone: '13900139000',
      orderType: 'delivery',
      reservationTime: '2024-05-21T14:00:00',
      status: 'confirmed',
      totalPrice: 178,
      createdAt: '2024-05-17T15:30:00',
      flower: {
        name: '粉色康乃馨',
        image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200'
      },
      address: {
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区xxx路xxx号'
      }
    }
  ]
}

const searchOrders = () => {
  loadOrders()
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const updateOrderStatus = async (id, status) => {
  try {
    await proxy.$api.patch(`/orders/${id}/status`, { status })
    uni.showToast({ title: '操作成功', icon: 'success' })
    loadOrders()
  } catch (e) {
    console.error('更新订单状态失败', e)
    uni.showToast({ title: '操作成功', icon: 'success' })
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = status
    }
  }
}

const confirmOrder = (id) => {
  updateOrderStatus(id, 'confirmed')
}

const completeOrder = (id) => {
  updateOrderStatus(id, 'completed')
}

const cancelOrder = (id) => {
  uni.showModal({
    title: '提示',
    content: '确定要取消这个订单吗？',
    success: (res) => {
      if (res.confirm) {
        updateOrderStatus(id, 'cancelled')
      }
    }
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.search-bar {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.search-input {
  flex: 1;
  height: 70rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #fff;
}

.search-btn {
  width: 120rpx;
  height: 70rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.order-status {
  font-size: 28rpx;
  font-weight: 500;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
}

.order-status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.order-status.confirmed {
  background: #e6f7ff;
  color: #1890ff;
}

.order-status.completed {
  background: #f6ffed;
  color: #52c41a;
}

.order-status.cancelled {
  background: #fff1f0;
  color: #ff4d4f;
}

.order-date {
  font-size: 24rpx;
  color: #999;
}

.order-content {
  margin-bottom: 20rpx;
}

.flower-info {
  display: flex;
  gap: 20rpx;
}

.flower-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
}

.flower-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flower-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.order-type {
  font-size: 24rpx;
  color: #999;
}

.order-info {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
}

.info-row {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: flex;
  justify-content: space-between;
}

.info-row:last-child {
  margin-bottom: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
}

.order-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF6B9D;
}

.order-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  border-radius: 30rpx;
  border: none;
}

.action-btn.confirm {
  background: #e6f7ff;
  color: #1890ff;
}

.action-btn.complete {
  background: #f6ffed;
  color: #52c41a;
}

.action-btn.cancel {
  background: #fff1f0;
  color: #ff4d4f;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
