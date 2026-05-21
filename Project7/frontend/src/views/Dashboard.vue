<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon project">
              <el-icon size="30"><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ projectCount }}</div>
              <div class="stat-label">项目总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon task">
              <el-icon size="30"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ taskCount }}</div>
              <div class="stat-label">任务总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon done">
              <el-icon size="30"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ doneCount }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon progress">
              <el-icon size="30"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ progressRate }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>任务状态分布</span>
            </div>
          </template>
          <div class="chart-container">
            <Pie :data="pieChartData" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>最近项目</span>
            </div>
          </template>
          <el-table :data="recentProjects" style="width: 100%">
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import api from '@/utils/request'

ChartJS.register(ArcElement, Tooltip, Legend)

const projectCount = ref(0)
const taskCount = ref(0)
const todoCount = ref(0)
const inProgressCount = ref(0)
const doneCount = ref(0)
const blockedCount = ref(0)
const recentProjects = ref([])

const progressRate = computed(() => {
  if (taskCount.value === 0) return 0
  return Math.round((doneCount.value / taskCount.value) * 100)
})

const pieChartData = computed(() => ({
  labels: ['待办', '进行中', '已完成', '阻塞'],
  datasets: [
    {
      backgroundColor: ['#909399', '#409EFF', '#67C23A', '#F56C6C'],
      data: [todoCount.value, inProgressCount.value, doneCount.value, blockedCount.value]
    }
  ]
}))

const getStatusType = (status) => {
  const types = {
    PLANNING: 'info',
    IN_PROGRESS: 'primary',
    ON_HOLD: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    PLANNING: '规划中',
    IN_PROGRESS: '进行中',
    ON_HOLD: '暂停',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return texts[status] || status
}

const loadData = async () => {
  try {
    const projectRes = await api.get('/projects')
    recentProjects.value = projectRes.data.slice(0, 5)
    projectCount.value = projectRes.data.length
  } catch (e) {
    console.error(e)
  }
  try {
    const taskRes = await api.get('/tasks')
    taskCount.value = taskRes.data.length
    todoCount.value = taskRes.data.filter(t => t.status === 'TODO').length
    inProgressCount.value = taskRes.data.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REVIEW').length
    doneCount.value = taskRes.data.filter(t => t.status === 'DONE').length
    blockedCount.value = taskRes.data.filter(t => t.status === 'BLOCKED').length
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #fff;
}

.stat-icon.project {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.task {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.done {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.progress {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 8px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
