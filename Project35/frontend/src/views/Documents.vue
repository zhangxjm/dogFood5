<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">Document Management</h2>
      <el-button type="primary" @click="showUploadDialog = true">
        <el-icon><Upload /></el-icon>
        Upload Document
      </el-button>
    </div>

    <el-card>
      <el-table :data="documents" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fileName" label="File Name" min-width="200" />
        <el-table-column prop="fileType" label="Type" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="getFileTypeColor(row.fileType)">{{ row.fileType?.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="Size" width="100">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploaderName" label="Uploader" width="120" />
        <el-table-column prop="createdAt" label="Upload Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Reading Status" width="180">
          <template #default="{ row }">
            <el-progress
              :percentage="row.totalReaders > 0 ? Math.round((row.readCount / row.totalReaders) * 100) : 0"
              :status="row.pendingCount > 0 ? 'warning' : 'success'"
              :format="() => `${row.readCount}/${row.totalReaders}`"
            />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">
              <el-icon><View /></el-icon>
              View
            </el-button>
            <el-button type="success" link size="small" @click="downloadFile(row)">
              <el-icon><Download /></el-icon>
              Download
            </el-button>
            <el-button type="warning" link size="small" @click="openAddReaders(row)">
              <el-icon><UserAdd /></el-icon>
              Add Readers
            </el-button>
            <el-button type="danger" link size="small" @click="confirmDelete(row)">
              <el-icon><Delete /></el-icon>
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showUploadDialog" title="Upload Document" width="600px">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="Select File">
          <el-upload
            drag
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="() => ElMessage.warning('Only one file can be uploaded')"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">Drag file here or <em>click to upload</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="uploadForm.description" type="textarea" :rows="3" placeholder="Enter document description" />
        </el-form-item>
        <el-form-item label="Select Readers">
          <el-select v-model="uploadForm.readerIds" multiple placeholder="Select readers to circulate" style="width: 100%">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="`${user.name} (${user.department})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUploadDialog = false">Cancel</el-button>
        <el-button type="primary" @click="uploadFile" :loading="uploading">Upload</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showAddReadersDialog" title="Add Readers" width="500px">
      <el-form label-width="80px">
        <el-form-item label="Document">
          <span>{{ selectedDocument?.fileName }}</span>
        </el-form-item>
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
        <el-button @click="showAddReadersDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addReadersToDocument">Add</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, View, Download, UserAdd, Delete, UploadFilled } from '@element-plus/icons-vue'
import { fetchDocuments, uploadDocument, addReaders, downloadDocument, deleteDocument, fetchUsers } from '../api'

const router = useRouter()
const documents = ref([])
const users = ref([])
const loading = ref(false)
const showUploadDialog = ref(false)
const showAddReadersDialog = ref(false)
const uploading = ref(false)
const selectedDocument = ref(null)
const newReaderIds = ref([])
const uploadForm = ref({
  file: null,
  description: '',
  readerIds: []
})

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

const loadData = async () => {
  loading.value = true
  try {
    const [docResponse, userResponse] = await Promise.all([
      fetchDocuments(),
      fetchUsers()
    ])
    documents.value = docResponse.data
    users.value = userResponse.data
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const handleFileChange = (file) => {
  uploadForm.value.file = file.raw
}

const uploadFile = async () => {
  if (!uploadForm.value.file) {
    ElMessage.warning('Please select a file')
    return
  }

  uploading.value = true
  try {
    const currentUserId = localStorage.getItem('currentUserId') || '1'
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('uploaderId', currentUserId)
    if (uploadForm.value.description) {
      formData.append('description', uploadForm.value.description)
    }
    if (uploadForm.value.readerIds?.length > 0) {
      uploadForm.value.readerIds.forEach(id => {
        formData.append('readerIds', id)
      })
    }

    await uploadDocument(formData)
    ElMessage.success('Document uploaded successfully')
    showUploadDialog.value = false
    uploadForm.value = { file: null, description: '', readerIds: [] }
    loadData()
  } catch (error) {
    ElMessage.error('Failed to upload document')
  } finally {
    uploading.value = false
  }
}

const viewDetail = (row) => {
  router.push(`/documents/${row.id}`)
}

const downloadFile = async (row) => {
  try {
    const response = await downloadDocument(row.id)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const disposition = response.headers['content-disposition']
    let filename = row.fileName
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

const openAddReaders = (row) => {
  selectedDocument.value = row
  newReaderIds.value = []
  showAddReadersDialog.value = true
}

const isReaderAlreadySelected = (userId) => {
  if (!selectedDocument.value?.circulations) return false
  return selectedDocument.value.circulations.some(c => c.readerId === userId)
}

const addReadersToDocument = async () => {
  if (newReaderIds.value.length === 0) {
    ElMessage.warning('Please select at least one reader')
    return
  }

  try {
    await addReaders(selectedDocument.value.id, newReaderIds.value)
    ElMessage.success('Readers added successfully')
    showAddReadersDialog.value = false
    loadData()
  } catch (error) {
    ElMessage.error('Failed to add readers')
  }
}

const confirmDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${row.fileName}"?`,
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    await deleteDocument(row.id)
    ElMessage.success('Document deleted successfully')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete document')
    }
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
