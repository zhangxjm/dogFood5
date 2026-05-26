<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <el-button @click="$router.back()" link>
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h2 class="page-title" style="margin-top: 10px">Document Details</h2>
      </div>
      <div>
        <el-button type="success" @click="downloadFile">
          <el-icon><Download /></el-icon>
          Download
        </el-button>
        <el-button type="primary" @click="showAddReaders = true">
          <el-icon><UserAdd /></el-icon>
          Add Readers
        </el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><Document /></el-icon> Basic Information</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="File Name">{{ document?.fileName }}</el-descriptions-item>
            <el-descriptions-item label="File Type">
              <el-tag :type="getFileTypeColor(document?.fileType)">{{ document?.fileType?.toUpperCase() }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="File Size">{{ formatFileSize(document?.fileSize) }}</el-descriptions-item>
            <el-descriptions-item label="Uploader">{{ document?.uploaderName }}</el-descriptions-item>
            <el-descriptions-item label="Upload Time">{{ formatDate(document?.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="Description">{{ document?.description || 'N/A' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span><el-icon><DataAnalysis /></el-icon> Reading Statistics</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ document?.totalReaders || 0 }}</div>
                <div class="stat-label">Total Readers</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number text-success">{{ document?.readCount || 0 }}</div>
                <div class="stat-label">Already Read</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number text-warning">{{ document?.pendingCount || 0 }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><User /></el-icon> Circulation List</span>
            </div>
          </template>
          <el-table :data="document?.circulations || []" stripe>
            <el-table-column prop="readerName" label="Name" width="120" />
            <el-table-column prop="readerDepartment" label="Department" width="150" />
            <el-table-column prop="status" label="Status" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.status === 'READ'" type="success">Read</el-tag>
                <el-tag v-else type="warning">Pending</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="readAt" label="Read Time" min-width="180">
              <template #default="{ row }">
                {{ row.readAt ? formatDate(row.readAt) : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showAddReaders" title="Add Readers" width="500px">
      <el-form label-width="80px">
        <el-form-item label="Select Readers">
          <el-select v-model="newReaderIds" multiple placeholder="Select readers to add" style="width: 100%">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="`${user.name} (${user.department})`"
              :value="user.id"
              :disabled="isReaderAlreadySelected(user.id)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddReaders = false">Cancel</el-button>
        <el-button type="primary" @click="addReadersToDocument">Add</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download, UserAdd, Document, DataAnalysis, User } from '@element-plus/icons-vue'
import { fetchDocumentById, downloadDocument, addReaders, fetchUsers } from '../api'

const route = useRoute()
const document = ref(null)
const users = ref([])
const showAddReaders = ref(false)
const newReaderIds = ref([])

const getFileTypeColor = (type) => {
  const colors = {
    pdf: 'danger',
    doc: 'primary',
    docx: 'primary',
    xls: 'success',
    xlsx: 'success',
    ppt: 'warning',
    pptx: 'warning'
  }
  return colors[type] || 'info'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const isReaderAlreadySelected = (userId) => {
  if (!document.value?.circulations) return false
  return document.value.circulations.some(c => c.readerId === userId)
}

const loadData = async () => {
  try {
    const [docResponse, userResponse] = await Promise.all([
      fetchDocumentById(route.params.id),
      fetchUsers()
    ])
    document.value = docResponse.data
    users.value = userResponse.data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const downloadFile = async () => {
  try {
    const response = await downloadDocument(document.value.id)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const disposition = response.headers['content-disposition']
    let filename = document.value.fileName
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

const addReadersToDocument = async () => {
  if (newReaderIds.value.length === 0) {
    ElMessage.warning('Please select at least one reader')
    return
  }

  try {
    await addReaders(document.value.id, newReaderIds.value)
    ElMessage.success('Readers added successfully')
    showAddReaders.value = false
    newReaderIds.value = []
    loadData()
  } catch (error) {
    ElMessage.error('Failed to add readers')
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
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  color: #409eff;
}

.stat-number.text-success {
  color: #67c23a;
}

.stat-number.text-warning {
  color: #e6a23c;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}
</style>
