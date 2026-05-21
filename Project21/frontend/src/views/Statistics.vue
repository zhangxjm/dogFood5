<template>
  <div class="statistics">
    <h2>统计报表</h2>
    
    <el-row :gutter="20" class="filter-row">
      <el-col :span="4">
        <el-select v-model="selectedYear" @change="loadStatistics" style="width: 100%">
          <el-option v-for="y in years" :key="y" :label="y + '年'" :value="y" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="selectedMonth" @change="loadStatistics" style="width: 100%">
          <el-option v-for="m in 12" :key="m" :label="m + '月'" :value="m" />
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="14">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">月度消耗趋势</div>
          </template>
          <div ref="monthlyChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">部门消耗排行</div>
          </template>
          <div ref="departmentChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="stats-card">
      <template #header>
        <div class="card-header">年度统计数据</div>
      </template>
      <el-table :data="monthlyStats" stripe>
        <el-table-column prop="month" label="月份" width="120" />
        <el-table-column prop="totalClaims" label="申领次数" width="120" />
        <el-table-column prop="totalBuckets" label="消耗桶数" width="120" />
        <el-table-column label="平均单次申领">
          <template #default="{ row }">
            {{ row.totalClaims > 0 ? (row.totalBuckets / row.totalClaims).toFixed(1) : 0 }} 桶
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getMonthlyStatistics, getDepartmentStatistics } from '../api/claim'

const monthlyChartRef = ref(null)
const departmentChartRef = ref(null)

let monthlyChart = null
let departmentChart = null

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const years = [currentYear, currentYear - 1]
const selectedYear = ref(currentYear)
const selectedMonth = ref(currentMonth)

const monthlyStats = ref([])
const departmentStats = ref([])

const initMonthlyChart = () => {
  monthlyChart = echarts.init(monthlyChartRef.value)
  updateMonthlyChart()
}

const updateMonthlyChart = () => {
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: monthlyStats.value.map(item => item.month)
    },
    yAxis: {
      type: 'value',
      name: '桶数'
    },
    series: [
      {
        name: '消耗桶数',
        type: 'bar',
        data: monthlyStats.value.map(item => item.totalBuckets),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        }
      },
      {
        name: '申领次数',
        type: 'line',
        data: monthlyStats.value.map(item => item.totalClaims),
        smooth: true,
        itemStyle: {
          color: '#f56c6c'
        }
      }
    ]
  }
  monthlyChart.setOption(option)
}

const initDepartmentChart = () => {
  departmentChart = echarts.init(departmentChartRef.value)
  updateDepartmentChart()
}

const updateDepartmentChart = () => {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '消耗桶数',
        type: 'pie',
        radius: ['40%', '70%'],
        data: departmentStats.value.map((item, index) => ({
          value: item.totalBuckets,
          name: item.department,
          itemStyle: {
            color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][index % 6]
          }
        }))
      }
    ]
  }
  departmentChart.setOption(option)
}

const loadStatistics = async () => {
  try {
    const [monthlyRes, deptRes] = await Promise.all([
      getMonthlyStatistics(selectedYear.value),
      getDepartmentStatistics(selectedYear.value, selectedMonth.value)
    ])
    
    monthlyStats.value = monthlyRes.data
    departmentStats.value = deptRes.data
    
    if (monthlyChart) updateMonthlyChart()
    if (departmentChart) updateDepartmentChart()
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

const handleResize = () => {
  monthlyChart?.resize()
  departmentChart?.resize()
}

onMounted(() => {
  setTimeout(() => {
    initMonthlyChart()
    initDepartmentChart()
    loadStatistics()
  }, 100)
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  monthlyChart?.dispose()
  departmentChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.statistics h2 {
  margin-bottom: 20px;
  color: #333;
}

.filter-row {
  margin-bottom: 20px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card,
.stats-card {
  border-radius: 8px;
}

.card-header {
  font-weight: bold;
  color: #333;
}

.chart {
  height: 350px;
  width: 100%;
}
</style>