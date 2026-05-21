<template>
  <div class="summary-page">
    <van-nav-bar title="营业汇总" />
    
    <div class="date-selector">
      <van-calendar
        v-model:show="showCalendar"
        :show-confirm="false"
        @select="onDateSelect"
      />
      <van-cell
        title="选择日期"
        :value="selectedDate"
        is-link
        @click="showCalendar = true"
      />
    </div>

    <van-cell-group class="summary-card">
      <van-cell title="总订单数">
        <template #value>
          <span class="summary-value">{{ summary.totalOrders || 0 }} 单</span>
        </template>
      </van-cell>
      <van-cell title="总营业额">
        <template #value>
          <span class="summary-value highlight">¥{{ summary.totalRevenue || 0 }}</span>
        </template>
      </van-cell>
      <van-cell v-if="summary.totalOrders > 0" title="客单价">
        <template #value>
          <span class="summary-value">¥{{ avgPrice.toFixed(2) }}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <div class="order-list-title">当日订单明细</div>
    
    <van-cell-group v-if="summary.orders && summary.orders.length > 0">
      <van-cell
        v-for="order in summary.orders"
        :key="order.id"
        :title="order.customerName"
        :label="order.orderNo + ' · ' + formatTime(order.createTime)"
      >
        <template #value>
          <div>
            <van-tag :type="getStatusType(order.status)" size="small">
              {{ getStatusText(order.status) }}
            </van-tag>
            <div class="order-amount">¥{{ order.totalAmount }}</div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    
    <van-empty v-else description="当日暂无订单" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orderApi } from '@/api'
import { showToast } from 'vant'
import dayjs from 'dayjs'

const showCalendar = ref(false)
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const summary = ref({})

const avgPrice = computed(() => {
  if (summary.value.totalOrders && summary.value.totalOrders > 0) {
    return summary.value.totalRevenue / summary.value.totalOrders
  }
  return 0
})

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
  return dayjs(time).format('HH:mm')
}

const onDateSelect = (value) => {
  selectedDate.value = dayjs(value).format('YYYY-MM-DD')
  showCalendar.value = false
  loadSummary()
}

const loadSummary = async () => {
  try {
    const res = await orderApi.getDailySummary(selectedDate.value)
    if (res.code === 200) {
      summary.value = res.data
    }
  } catch (e) {
    showToast('加载汇总失败')
  }
}

onMounted(() => {
  loadSummary()
})
</script>

<style scoped>
.summary-page {
  padding-bottom: 50px;
}
.date-selector {
  margin-bottom: 12px;
}
.summary-card {
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
}
.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.summary-value.highlight {
  color: #f56c6c;
}
.order-list-title {
  padding: 12px;
  font-weight: bold;
  color: #333;
}
.order-amount {
  color: #f56c6c;
  font-weight: bold;
  text-align: right;
  margin-top: 4px;
}
</style>
