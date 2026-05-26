<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <el-form :inline="true">
        <el-form-item label="Time Range">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start time"
            end-placeholder="End time"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">Query</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Department Statistics</h3>
          <el-table :data="departmentStats" style="width: 100%" stripe>
            <el-table-column prop="departmentName" label="Department" />
            <el-table-column prop="applicationCount" label="Applications" width="120" />
            <el-table-column prop="totalQuantity" label="Quantity" width="100" />
            <el-table-column prop="totalAmount" label="Amount" width="120">
              <template #default="scope">¥{{ scope.row.totalAmount?.toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Category Statistics</h3>
          <el-table :data="categoryStats" style="width: 100%" stripe>
            <el-table-column prop="categoryName" label="Category" />
            <el-table-column prop="totalQuantity" label="Quantity" width="100" />
            <el-table-column prop="totalAmount" label="Amount" width="120">
              <template #default="scope">¥{{ scope.row.totalAmount?.toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Department Applications Chart</h3>
          <v-chart class="chart" :option="departmentChartOption" autoresize />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Category Consumption Chart</h3>
          <v-chart class="chart" :option="categoryChartOption" autoresize />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">Overall Statistics</h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="Total Applications">{{ overallStats.totalApplications || 0 }}</el-descriptions-item>
            <el-descriptions-item label="Total Quantity">{{ overallStats.totalQuantity || 0 }}</el-descriptions-item>
            <el-descriptions-item label="Total Amount">¥{{ (overallStats.totalAmount || 0).toFixed(2) }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
import { statisticsApi } from '../api'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const timeRange = ref(null)
const departmentStats = ref([])
const categoryStats = ref([])
const overallStats = ref({})

const departmentChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: departmentStats.value.map(d => d.departmentName),
    axisLabel: { rotate: 30 }
  },
  yAxis: { type: 'value' },
  series: [{
    name: 'Amount',
    type: 'bar',
    data: departmentStats.value.map(d => d.totalAmount),
    itemStyle: { color: '#67C23A' }
  }]
}))

const categoryChartOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    name: 'Quantity',
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

const loadData = async () => {
  try {
    const params = {}
    if (timeRange.value && timeRange.value.length === 2) {
      params.startTime = timeRange.value[0]
      params.endTime = timeRange.value[1]
    }

    const [deptStats, catStats, overall] = await Promise.all([
      statisticsApi.departmentStats(params),
      statisticsApi.categoryStats(params),
      statisticsApi.overallStats()
    ])

    departmentStats.value = deptStats
    categoryStats.value = catStats
    overallStats.value = overall
  } catch (error) {
    console.error('Failed to load statistics:', error)
  }
}

onMounted(loadData)
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
