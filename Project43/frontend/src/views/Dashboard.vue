<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <div class="stat-card">
          <el-row>
            <el-col :span="16">
              <div class="stat-label">Total Categories</div>
              <div class="stat-value">{{ stats.totalCategories }}</div>
            </el-col>
            <el-col :span="8">
              <el-icon class="stat-icon"><Goods /></el-icon>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <el-row>
            <el-col :span="16">
              <div class="stat-label">Total Applications</div>
              <div class="stat-value">{{ stats.totalApplications }}</div>
            </el-col>
            <el-col :span="8">
              <el-icon class="stat-icon"><Document /></el-icon>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <el-row>
            <el-col :span="16">
              <div class="stat-label">Total Quantity</div>
              <div class="stat-value">{{ stats.totalQuantity }}</div>
            </el-col>
            <el-col :span="8">
              <el-icon class="stat-icon"><ShoppingCart /></el-icon>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <el-row>
            <el-col :span="16">
              <div class="stat-label">Total Amount</div>
              <div class="stat-value">¥{{ stats.totalAmount?.toFixed(2) }}</div>
            </el-col>
            <el-col :span="8">
              <el-icon class="stat-icon"><Money /></el-icon>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Department Applications</h3>
          <v-chart class="chart" :option="departmentChartOption" autoresize />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Category Consumption</h3>
          <v-chart class="chart" :option="categoryChartOption" autoresize />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Recent Applications</h3>
          <el-table :data="recentApplications" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="employee.name" label="Employee" width="120" />
            <el-table-column prop="department.name" label="Department" width="150" />
            <el-table-column prop="status" label="Status" width="120">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="applyTime" label="Apply Time" width="180" />
            <el-table-column label="Items">
              <template #default="scope">
                <span v-for="(item, index) in scope.row.items" :key="index">
                  {{ item.category?.name }} x{{ item.quantity }}<span v-if="index < scope.row.items.length - 1">, </span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { statisticsApi, applicationApi } from '../api'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const stats = ref({
  totalCategories: 0,
  totalApplications: 0,
  totalQuantity: 0,
  totalAmount: 0
})

const departmentStats = ref([])
const categoryStats = ref([])
const recentApplications = ref([])

const departmentChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: departmentStats.value.map(d => d.departmentName)
  },
  yAxis: { type: 'value' },
  series: [{
    name: 'Applications',
    type: 'bar',
    data: departmentStats.value.map(d => d.applicationCount),
    itemStyle: { color: '#667eea' }
  }]
}))

const categoryChartOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    name: 'Consumption',
    type: 'pie',
    radius: '60%',
    data: categoryStats.value.map(c => ({ name: c.categoryName, value: c.totalQuantity })),
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}))

const getStatusType = (status) => {
  const types = {
    'AUTO_APPROVED': 'success',
    'PENDING': 'warning',
    'REJECTED': 'danger'
  }
  return types[status] || 'info'
}

onMounted(async () => {
  try {
    const [overall, deptStats, catStats, applications] = await Promise.all([
      statisticsApi.overallStats(),
      statisticsApi.departmentStats(),
      statisticsApi.categoryStats(),
      applicationApi.list()
    ])

    stats.value = {
      totalCategories: 10,
      totalApplications: overall.totalApplications || 0,
      totalQuantity: overall.totalQuantity || 0,
      totalAmount: overall.totalAmount || 0
    }

    departmentStats.value = deptStats
    categoryStats.value = catStats
    recentApplications.value = applications.slice(-5).reverse()
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
