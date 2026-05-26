<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">Hot Sales Ranking</div>
      <div class="page-subtitle">See which items are selling best</div>
    </div>

    <div class="card" style="display: flex; gap: 12px; padding: 16px;">
      <div
        v-for="period in periods"
        :key="period.value"
        :style="{
          flex: 1,
          padding: '10px',
          textAlign: 'center',
          borderRadius: '8px',
          background: selectedPeriod === period.value ? '#ff6b35' : '#f7f8fa',
          color: selectedPeriod === period.value ? 'white' : '#333',
          cursor: 'pointer'
        }"
        @click="selectPeriod(period.value)"
      >
        {{ period.label }}
      </div>
    </div>

    <div class="section-title">Top Sellers</div>
    <div class="card" style="padding: 0;">
      <div v-if="hotSales.length === 0" class="empty-state">
        <div class="empty-icon">🔥</div>
        <div class="empty-text">No sales data in this period</div>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in hotSales"
          :key="item.categoryId"
          class="rank-item"
        >
          <div class="rank-number" :class="getRankClass(index)">
            {{ index + 1 }}
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: #333; margin-bottom: 4px;">
              {{ item.categoryName }}
            </div>
            <div style="font-size: 13px; color: #999;">
              Total sold: {{ item.totalQuantity }} pcs
            </div>
            <div style="margin-top: 8px;">
              <div
                style="
                  height: 6px;
                  background: #f0f0f0;
                  border-radius: 3px;
                  overflow: hidden;
                "
              >
                <div
                  :style="{
                    width: (item.totalQuantity / maxQuantity * 100) + '%',
                    height: '100%',
                    background: getRankColor(index),
                    borderRadius: '3px',
                    transition: 'width 0.3s'
                  }"
                ></div>
              </div>
            </div>
          </div>
          <div style="text-align: right; margin-left: 12px;">
            <div style="font-size: 18px; font-weight: bold; color: #ff6b35;">
              ¥{{ item.totalAmount }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">Summary</div>
    <div class="card">
      <div class="record-item">
        <div class="record-info">
          <div class="record-name">Total Categories</div>
        </div>
        <div class="record-amount">{{ hotSales.length }}</div>
      </div>
      <div class="record-item">
        <div class="record-info">
          <div class="record-name">Total Items Sold</div>
        </div>
        <div class="record-amount">{{ totalQuantity }}</div>
      </div>
      <div class="record-item">
        <div class="record-info">
          <div class="record-name">Total Revenue</div>
        </div>
        <div class="record-amount">¥{{ totalRevenue }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'
import dayjs from 'dayjs'

const periods = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
]

const selectedPeriod = ref('today')
const hotSales = ref([])

const maxQuantity = computed(() => {
  if (hotSales.value.length === 0) return 1
  return Math.max(...hotSales.value.map(item => item.totalQuantity || 0))
})

const totalQuantity = computed(() => {
  return hotSales.value.reduce((sum, item) => sum + (item.totalQuantity || 0), 0)
})

const totalRevenue = computed(() => {
  return hotSales.value.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0).toFixed(2)
})

const getRankClass = (index) => {
  if (index === 0) return 'top1'
  if (index === 1) return 'top2'
  if (index === 2) return 'top3'
  return 'normal'
}

const getRankColor = (index) => {
  if (index === 0) return 'linear-gradient(135deg, #ffd700, #ffed4a)'
  if (index === 1) return 'linear-gradient(135deg, #c0c0c0, #e8e8e8)'
  if (index === 2) return 'linear-gradient(135deg, #cd7f32, #e8a959)'
  return 'linear-gradient(135deg, #667eea, #764ba2)'
}

const selectPeriod = (period) => {
  selectedPeriod.value = period
  const today = dayjs()
  let startDate
  let endDate = today.format('YYYY-MM-DD')
  
  switch (period) {
    case 'today':
      startDate = today.format('YYYY-MM-DD')
      break
    case 'week':
      startDate = today.startOf('week').format('YYYY-MM-DD')
      break
    case 'month':
      startDate = today.startOf('month').format('YYYY-MM-DD')
      break
  }
  
  loadData(startDate, endDate)
}

const loadData = async (startDate, endDate) => {
  try {
    hotSales.value = await api.getHotSales(startDate, endDate)
  } catch (e) {
    console.error('Failed to load hot sales:', e)
    hotSales.value = []
  }
}

onMounted(() => {
  selectPeriod('today')
})
</script>
