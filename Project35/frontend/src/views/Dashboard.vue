<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Dashboard</h2>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#409eff"><Document /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalDocuments }}</div>
              <div class="stat-label">Total Documents</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#67c23a"><UserFilled /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalUsers }}</div>
              <div class="stat-label">Total Users</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#e6a23c"><Clock /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ stats.pendingCount }}</div>
              <div class="stat-label">Pending Documents</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#67c23a"><CircleCheck /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ stats.readCount }}</div>
              <div class="stat-label">Read Documents</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Recent Uploaded Documents</span>
              <el-button type="primary" link @click="$router.push('/documents')">View All</el-button>
            </div>
          </template>
          <el-table :data="recentDocuments" stripe>
            <el-table-column prop="fileName" label="File Name" min-width="200" />
            <el-table-column prop="uploaderName" label="Uploader" width="120" />
            <el-table-column prop="createdAt" label="Upload Time" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="Status" width="120">
              <template #default="{ row }">
                <el-tag :type="row.pendingCount > 0 ? 'warning' : 'success'">
                  {{ row.pendingCount > 0 ? 'Pending' : 'All Read' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>My Pending Tasks</span>
              <el-button type="primary" link @click="$router.push('/my-tasks')">View All</el-button>
            </div>
          </template>
          <el-table :data="myPendingTasks" stripe>
            <el-table-column prop="documentName" label="Document Name" min-width="200" />
            <el-table-column prop="readerName" label="Assigned To" width="120" />
            <el-table-column prop="createdAt" label="Assigned Time" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="Action" width="100">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="markRead(row)">Mark Read</el-button>
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
import { ElMessage } from 'element-plus'
import { Document, UserFilled, Clock, CircleCheck } from '@element-plus/icons-vue'
import { fetchDocuments, fetchCirculationsByReaderAndStatus, markAsRead } from '../api'

const recentDocuments = ref([])
const myPendingTasks = ref([])
const currentUserId = ref(1)

const stats = computed(() => ({
  totalDocuments: recentDocuments.value.length,
  totalUsers: 6,
  pendingCount: recentDocuments.value.filter(d => d.pendingCount > 0).length,
  readCount: recentDocuments.value.filter(d => d.pendingCount === 0).length
}))

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const markRead = async (row) => {
  try {
    await markAsRead(row.documentId, currentUserId.value)
    ElMessage.success('Marked as read successfully')
    loadData()
  } catch (error) {
    ElMessage.error('Failed to mark as read')
  }
}

const loadData = async () => {
  const savedUserId = localStorage.getItem('currentUserId')
  if (savedUserId) {
    currentUserId.value = parseInt(savedUserId)
  }

  try {
    const [docResponse, taskResponse] = await Promise.all([
      fetchDocuments(),
      fetchCirculationsByReaderAndStatus(currentUserId.value, 'PENDING')
    ])
    recentDocuments.value = docResponse.data.slice(0, 5)
    myPendingTasks.value = taskResponse.data.slice(0, 5)
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(loadData)
</script>

<style scoped>
.stats-row {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
