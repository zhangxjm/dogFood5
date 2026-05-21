<template>
  <div class="orders-page">
    <van-nav-bar title="订单管理" />
    
    <van-tabs v-model:active="activeStatus" @change="loadOrders">
      <van-tab title="全部" :name="-1" />
      <van-tab title="待制作" :name="1" />
      <van-tab title="制作中" :name="2" />
      <van-tab title="已完成" :name="3" />
      <van-tab title="已取消" :name="0" />
    </van-tabs>

    <div class="order-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadOrders"
        >
          <van-cell-group v-for="order in orders" :key="order.id" class="order-card">
            <van-cell :title="'订单号: ' + order.orderNo" :value="getStatusText(order.status)">
              <template #value>
                <van-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</van-tag>
              </template>
            </van-cell>
            <van-cell :title="'顾客: ' + order.customerName" :value="'电话: ' + order.customerPhone" />
            <van-cell title="订单金额">
              <template #value>
                <span class="order-amount">¥{{ order.totalAmount }}</span>
              </template>
            </van-cell>
            <van-cell title="下单时间" :value="formatTime(order.createTime)" />
            
            <van-cell v-if="order.items && order.items.length > 0" title="商品明细">
              <div class="order-items">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <span>{{ item.drinkName }}</span>
                  <span>x{{ item.quantity }}</span>
                  <span>¥{{ item.subtotal }}</span>
                </div>
              </div>
            </van-cell>
            
            <van-cell v-if="order.remark" title="备注" :value="order.remark" />
            
            <van-cell v-if="order.status === 1 || order.status === 2">
              <template #value>
                <van-button
                  size="small"
                  type="primary"
                  @click="updateOrderStatus(order.id, order.status + 1)"
                >
                  {{ order.status === 1 ? '开始制作' : '完成制作' }}
                </van-button>
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderApi } from '@/api'
import { showToast, showSuccessToast } from 'vant'
import dayjs from 'dayjs'

const activeStatus = ref(-1)
const orders = ref([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

const getStatusText = (status) => {
  const statusMap = {
    0: '已取消',
    1: '待制作',
    2: '制作中',
    3: '已完成'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'default',
    1: 'warning',
    2: 'primary',
    3: 'success'
  }
  return typeMap[status] || 'default'
}

const formatTime = (time) => {
  return dayjs(time).format('MM-DD HH:mm')
}

const loadOrders = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    let res
    if (activeStatus.value === -1) {
      res = await orderApi.getAll()
    } else {
      res = await orderApi.getByStatus(activeStatus.value)
    }
    
    if (res.code === 200) {
      orders.value = res.data
      finished.value = true
    }
  } catch (e) {
    showToast('加载订单失败')
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onRefresh = () => {
  finished.value = false
  loadOrders()
}

const updateOrderStatus = async (id, status) => {
  try {
    const res = await orderApi.updateStatus(id, status)
    if (res.code === 200) {
      showSuccessToast('状态更新成功')
      loadOrders()
    }
  } catch (e) {
    showToast('状态更新失败')
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-page {
  padding-bottom: 50px;
}
.order-list {
  padding: 12px;
}
.order-card {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
}
.order-amount {
  color: #f56c6c;
  font-weight: bold;
}
.order-items {
  width: 100%;
}
.order-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
  color: #666;
}
</style>
