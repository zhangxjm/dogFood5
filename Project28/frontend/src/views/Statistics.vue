<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">Revenue Statistics</div>
      <div class="page-subtitle">Track your business performance</div>
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

    <div class="stat-card">
      <div class="stat-label">{{ currentLabel }} Total Revenue</div>
      <div class="stat-value">¥{{ totalAmount }}</div>
    </div>

    <div class="section-title">Revenue Trend</div>
    <div class="card">
      <div ref="chartRef" style="height: 250px;"></div>
    </div>

    <div class="section-title">Summary</div>
    <div class="card">
      <div class="record-item">
        <div class="record-info">
          <div class="record-name">Total Records</div>
        </div>
        <div class="record-amount">{{ summary.recordCount || 0 }}</div>
      </div>
      <div class="record-item">
        <div class="record-info">
          <div class="record-name">Total Items Sold</div>
        </div>
        <div class="record-amount">{{ summary.totalQuantity || 0 }}</div>
      </div>
      <div class="record-item">
        <div class="record-info">
          <div class="record-name">Average per Record</div>
        </div>
        <div class="record-amount">
          ¥{{ summary.recordCount ? (summary.totalAmount / summary.recordCount).toFixed(2) : '0.00' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { api } from '../api'
import dayjs from 'dayjs'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

const periods = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Custom', value: 'custom' }
]

const selectedPeriod = ref('today')
const currentLabel = ref("Today's")
const totalAmount = ref('0.00')
const summary = ref({})
const dateRange = ref({
  startDate: '',
  endDate: ''
})

const selectPeriod = (period) => {
  selectedPeriod.value = period
  const today = dayjs()
  
  switch (period) {
    case 'today':
      currentLabel.value = "Today's"
      dateRange.value = {
        startDate: today.format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD')
      }
      break
    case 'week':
      currentLabel.value = "Week's"
      dateRange.value = {
        startDate: today.startOf('week').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD')
      }
      break
    case 'month':
      currentLabel.value = "Month's"
      dateRange.value = {
        startDate: today.startOf('month').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD')
      }
      break
  }
  
  loadData()
}

const loadData = async () => {
  try {
    const [records, amount] = await Promise.all([
      api.getRecordsByDateRange(dateRange.value.startDate, dateRange.value.endDate),
      api.getTotalAmountByDate(dateRange.value.endDate)
    ])
    
    totalAmount.value = amount || '0.00'
    
    const recordCount = records.length
    const totalQuantity = records.reduce((sum, r) => sum + (r.quantity || 0), 0)
    const totalAmountSum = records.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0)
    
    summary.value = {
      recordCount,
      totalQuantity,
      totalAmount: totalAmountSum
    }
    
    renderChart(records)
  } catch (e) {
    console.error('Failed to load statistics:', e)
  }
}

const renderChart = (records) => {
  if (!chartRef.value) return
  
  if (!chart) {
    chart = echarts.init(chartRef.value)
  }
  
  const dateMap = {}
  records.forEach(record => {
    const date = record.salesDate
    if (!dateMap[date]) {
      dateMap[date] = 0
    }
    dateMap[date] += parseFloat(record.totalAmount) || 0
  })
  
  const dates = Object.keys(dateMap).sort()
  const amounts = dates.map(d => dateMap[d].toFixed(2))
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>Revenue: ¥{c}'
    },
    grid: {
      left: 50,
      right: 20,
      top: 20,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [{
      type: 'bar',
      data: amounts,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#ff6b35' },
          { offset: 1, color: '#f7931e' }
        ]),
        borderRadius: [4, 4, 0, 0]
      }
    }]
  }
  
  chart.setOption(option)
}

onMounted(() => {
  selectPeriod('today')
})

watch(selectedPeriod, () => {
  nextTick(() => {
    if (chart) {
      chart.resize()
    }
  })
})
</script>
