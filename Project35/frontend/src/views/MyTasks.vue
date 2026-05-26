<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">My Tasks</h2>
      <el-radio-group v-model="activeTab" @change="loadData">
        <el-radio-button label="PENDING">Pending</el-radio-button>
        <el-radio-button label="READ">Already Read</el-radio-button>
        <el-radio-button label="ALL">All</el-radio-button>
      </el-radio-group>
    </div>

    <el-card>
      <el-table :data="tasks" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="documentName" label="Document Name" min-width="200" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'READ'" type="success">Read</el-tag>
            <el-tag v-else type="warning">Pending</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Assigned Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="readAt" label="Read Time" width="180">
          <template #default="{ row }">
            {{ row.readAt ? formatDate(row.readAt) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'PENDING'"
              type="primary"
              link
              size="small"
              @click="markAsReadTask(row)"
            >
              <el-icon><Check /></el-icon>
              Mark as Read
            </el-button>
            <el-button type="success" link size="small" @click="viewDocument(row)">
              <el-icon><View /></el-icon>
              View Details
            </el-button>
            <el-button type="primary" link size="small" @click="downloadFile(row)">
              <el-icon><Download /></el-icon>
              Download
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, View, Download } from '@element-plus/icons-vue'
import { fetchCirculationsByReader, fetchCirculationsByReaderAndStatus, markAsRead, downloadDocument } from '../api'

const router = useRouter()
const tasks = ref([])
const loading = ref(false)
const activeTab = ref('PENDING')

const currentUserId = computed(() => {
  return parseInt(localStorage.getItem('currentUserId') || '1')
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const loadData = async () => {
  loading.value = true
  try {
    let response
    if (activeTab.value === 'ALL') {
      response = await fetchCirculationsByReader(currentUserId.value)
    } else {
      response = await fetchCirculationsByReaderAndStatus(currentUserId.value, activeTab.value)
    }
    tasks.value = response.data
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    loading.value = false
  }
}

const markAsReadTask = async (row) => {
  try {
    await markAsRead(row.documentId, currentUserId.value)
    ElMessage.success('Marked as read successfully')
    loadData()
  } catch (error) {
    ElMessage.error('Failed to mark as read')
  }
}

const viewDocument = (row) => {
  router.push(`/documents/${row.documentId}`)
}

const downloadFile = async (row) => {
  try {
    const response = await downloadDocument(row.documentId)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const disposition = response.headers['content-disposition']
    let filename = row.documentName
    if (disposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '')
        filename = decodeURIComponent(filename)
      }
    }
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    ElMessage.error('Failed to download document')
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
</style>
