<template>
  <div class="page-container">
    <div class="page-header">
      <h2>数据概览</h2>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card green">
          <div class="stat-value">{{ stats.totalRequests || 0 }}</div>
          <div class="stat-label">总需求数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card orange">
          <div class="stat-value">{{ stats.pendingRequests || 0 }}</div>
          <div class="stat-label">待处理需求</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card blue">
          <div class="stat-value">{{ stats.completedRequests || 0 }}</div>
          <div class="stat-label">已完成需求</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ stats.avgOverall || 0 }}</div>
          <div class="stat-label">平均评分</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="card-container">
          <h3 style="margin-bottom: 16px;">评分详情</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="服务态度">
              <el-rate :model-value="stats.avgService" disabled />
              <span style="margin-left: 8px;">{{ stats.avgService || 0 }} 分</span>
            </el-descriptions-item>
            <el-descriptions-item label="准时度">
              <el-rate :model-value="stats.avgTimeliness" disabled />
              <span style="margin-left: 8px;">{{ stats.avgTimeliness || 0 }} 分</span>
            </el-descriptions-item>
            <el-descriptions-item label="物品爱护">
              <el-rate :model-value="stats.avgCare" disabled />
              <span style="margin-left: 8px;">{{ stats.avgCare || 0 }} 分</span>
            </el-descriptions-item>
            <el-descriptions-item label="综合评分">
              <el-rate :model-value="stats.avgOverall" disabled />
              <span style="margin-left: 8px;">{{ stats.avgOverall || 0 }} 分</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-container">
          <h3 style="margin-bottom: 16px;">运营数据</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="完成记录数">{{ stats.totalRecords || 0 }}</el-descriptions-item>
            <el-descriptions-item label="服务评分数">{{ stats.totalRatings || 0 }}</el-descriptions-item>
            <el-descriptions-item label="完成率">
              <span v-if="stats.totalRequests">
                {{ ((stats.completedRequests / stats.totalRequests) * 100).toFixed(1) }}%
              </span>
              <span v-else>0%</span>
            </el-descriptions-item>
            <el-descriptions-item label="待处理率">
              <span v-if="stats.totalRequests">
                {{ ((stats.pendingRequests / stats.totalRequests) * 100).toFixed(1) }}%
              </span>
              <span v-else>0%</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <div class="card-container">
          <h3 style="margin-bottom: 16px;">最近搬家需求</h3>
          <el-table :data="recentRequests" stripe>
            <el-table-column prop="customerName" label="客户姓名" width="120" />
            <el-table-column prop="phone" label="联系电话" width="140" />
            <el-table-column prop="moveFrom" label="搬出地址" show-overflow-tooltip />
            <el-table-column prop="moveTo" label="搬入地址" show-overflow-tooltip />
            <el-table-column label="搬家日期" width="120">
              <template #default="{ row }">
                {{ formatDate(row.moveDate) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <span :class="['status-tag', `status-${row.status}`]">
                  {{ getStatusText(row.status) }}
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
import { ref, onMounted } from 'vue'
import { getStats, getMoveRequests } from '../api'

const stats = ref({})
const recentRequests = ref([])

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const getStatusText = (status) => {
  const map = {
    pending: '待处理',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(async () => {
  try {
    const [statsRes, requestsRes] = await Promise.all([
      getStats(),
      getMoveRequests({ page: 1, pageSize: 5 })
    ])
    stats.value = statsRes.data
    recentRequests.value = requestsRes.data.list || []
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>

<style scoped>
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.stat-card.green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.card-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
