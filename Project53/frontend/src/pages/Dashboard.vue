<template>
  <div>
    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="今日订单数" :value="stats.todaySales" suffix="单" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="今日营业额" :value="stats.todayRevenue" prefix="¥" :precision="2" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="今日销量" :value="stats.todayCount" suffix="件" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="本月营业额" :value="stats.monthRevenue" prefix="¥" :precision="2" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="临期酒水提醒">
          <a-list :data-source="expiryProducts" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>{{ item.name }}</template>
                  <template #description>
                    过期日期: {{ formatDate(item.expiryDate) }}
                    <a-tag color="orange" style="margin-left: 8px">{{ getDaysLeft(item.expiryDate) }}天</a-tag>
                  </template>
                </a-list-item-meta>
                <a-tag color="red" v-if="isExpired(item.expiryDate)">已过期</a-tag>
              </a-list-item>
            </template>
            <template v-if="expiryProducts.length === 0">
              <a-empty description="暂无临期商品" />
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="最近售卖记录">
          <a-list :data-source="recentSales" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>{{ item.productName }}</template>
                  <template #description>
                    {{ formatDateTime(item.saleTime) }} - {{ item.quantity }}件
                  </template>
                </a-list-item-meta>
                <div>¥{{ item.totalPrice.toFixed(2) }}</div>
              </a-list-item>
            </template>
            <template v-if="recentSales.length === 0">
              <a-empty description="暂无售卖记录" />
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { saleApi, productApi } from '../services/api'

const stats = ref({
  todaySales: 0,
  todayRevenue: 0,
  todayCount: 0,
  monthRevenue: 0
})

const expiryProducts = ref([])
const recentSales = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getDaysLeft = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(date)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry - today) / (24 * 60 * 60 * 1000))
}

const isExpired = (date) => {
  return getDaysLeft(date) < 0
}

const loadData = async () => {
  try {
    const [statsRes, expiryRes, salesRes] = await Promise.all([
      saleApi.getStats(),
      productApi.getExpiryAlert(),
      saleApi.getAll({})
    ])
    if (statsRes.success) stats.value = statsRes.data
    if (expiryRes.success) {
      expiryProducts.value = [
        ...expiryRes.data.expiringSoon,
        ...expiryRes.data.expired
      ].slice(0, 10)
    }
    if (salesRes.success) recentSales.value = salesRes.data.slice(0, 10)
  } catch (error) {
    console.error(error)
  }
}

onMounted(loadData)
</script>
