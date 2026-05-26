<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">Stall Sales Dashboard</div>
      <div class="page-subtitle">Welcome back! Here's your business overview</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Today's Revenue</div>
      <div class="stat-value">¥{{ stats.todayAmount || '0.00' }}</div>
    </div>

    <div style="display: flex; margin: 0 12px;">
      <div class="stat-card green" style="flex: 1; margin: 0 6px 0 0;">
        <div class="stat-label">This Week</div>
        <div class="stat-value" style="font-size: 20px;">¥{{ stats.weekAmount || '0.00' }}</div>
      </div>
      <div class="stat-card orange" style="flex: 1; margin: 0 0 0 6px;">
        <div class="stat-label">This Month</div>
        <div class="stat-value" style="font-size: 20px;">¥{{ stats.monthAmount || '0.00' }}</div>
      </div>
    </div>

    <div class="section-title" style="margin-top: 16px;">Today's Hot Items</div>
    <div class="card">
      <div v-if="hotSalesToday.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <div class="empty-text">No sales data today</div>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in hotSalesToday.slice(0, 5)"
          :key="item.categoryId"
          class="rank-item"
        >
          <div class="rank-number" :class="getRankClass(index)">
            {{ index + 1 }}
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: #333;">{{ item.categoryName }}</div>
            <div style="font-size: 13px; color: #999;">
              Sold {{ item.totalQuantity }} pcs
            </div>
          </div>
          <div style="color: #ff6b35; font-weight: bold;">
            ¥{{ item.totalAmount }}
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">Quick Actions</div>
    <div class="card" style="display: flex; flex-wrap: wrap;">
      <div
        style="width: 50%; padding: 16px; text-align: center; cursor: pointer;"
        @click="$router.push('/add-sale')"
      >
        <div style="font-size: 32px;">➕</div>
        <div style="margin-top: 8px; color: #333;">Record Sale</div>
      </div>
      <div
        style="width: 50%; padding: 16px; text-align: center; cursor: pointer;"
        @click="$router.push('/sales')"
      >
        <div style="font-size: 32px;">📋</div>
        <div style="margin-top: 8px; color: #333;">View Records</div>
      </div>
      <div
        style="width: 50%; padding: 16px; text-align: center; cursor: pointer;"
        @click="$router.push('/statistics')"
      >
        <div style="font-size: 32px;">📊</div>
        <div style="margin-top: 8px; color: #333;">Statistics</div>
      </div>
      <div
        style="width: 50%; padding: 16px; text-align: center; cursor: pointer;"
        @click="$router.push('/categories')"
      >
        <div style="font-size: 32px;">🍜</div>
        <div style="margin-top: 8px; color: #333;">Categories</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const stats = ref({})
const hotSalesToday = ref([])

const loadData = async () => {
  try {
    const [statsData, hotSales] = await Promise.all([
      api.getOverallStats(),
      api.getHotSales(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0])
    ])
    stats.value = statsData
    hotSalesToday.value = hotSales || []
  } catch (e) {
    console.error('Failed to load data:', e)
  }
}

const getRankClass = (index) => {
  if (index === 0) return 'top1'
  if (index === 1) return 'top2'
  if (index === 2) return 'top3'
  return 'normal'
}

onMounted(() => {
  loadData()
})
</script>
