<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 18px; font-weight: bold;">文件上传</span>
      </div>
    </template>
    
    <el-form :model="uploadForm" label-width="100px">
      <el-form-item label="选择文件">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          drag
          style="width: 100%;"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持办公文档、PDF、图片等格式，单个文件最大100MB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件描述">
        <el-input v-model="uploadForm.description" type="textarea" :rows="3" placeholder="请输入文件描述" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpload" :loading="uploading">上传文件</el-button>
      </el-form-item>
    </el-form>

    <el-divider>我的上传记录</el-divider>
    
    <el-table :data="fileList" border stripe style="width: 100%;">
      <el-table-column prop="fileName" label="文件名" min-width="200" />
      <el-table-column prop="fileType" label="文件类型" width="150" />
      <el-table-column prop="fileSize" label="文件大小" width="120" :formatter="formatFileSize" />
      <el-table-column prop="uploadTime" label="上传时间" width="180" />
      <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" link @click="handleDownload(scope.row.id)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { UploadFilled } from '@element-plus/icons-vue'

export default {
  name: 'FileUpload',
  components: { UploadFilled },
  setup() {
    const uploadRef = ref(null)
    const uploading = ref(false)
    const fileList = ref([])
    const currentFile = ref(null)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    const uploadForm = ref({
      description: ''
    })

    const handleFileChange = (file) => {
      currentFile.value = file.raw
    }

    const handleUpload = async () => {
      if (!currentFile.value) {
        alert('请选择要上传的文件')
        return
      }

      uploading.value = true
      const formData = new FormData()
      formData.append('file', currentFile.value)
      formData.append('uploaderId', user.id)
      formData.append('uploaderName', user.realName)
      formData.append('description', uploadForm.value.description)

      try {
        const response = await axios.post('/api/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.data.code === 200) {
          alert('文件上传成功')
          uploadRef.value?.clearFiles()
          uploadForm.value.description = ''
          currentFile.value = null
          loadFileList()
        }
      } catch (error) {
        alert('文件上传失败')
      } finally {
        uploading.value = false
      }
    }

    const loadFileList = async () => {
      try {
        const response = await axios.get(`/api/file/uploader/${user.id}`)
        if (response.data.code === 200) {
          fileList.value = response.data.data
        }
      } catch (error) {
        console.error('加载文件列表失败')
      }
    }

    const handleDownload = (fileId) => {
      window.open(`/api/file/download/${fileId}`, '_blank')
    }

    const formatFileSize = (row) => {
      const size = row.fileSize
      if (size < 1024) return size + ' B'
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
      return (size / (1024 * 1024)).toFixed(2) + ' MB'
    }

    onMounted(() => {
      loadFileList()
    })

    return {
      uploadRef,
      uploading,
      fileList,
      uploadForm,
      handleFileChange,
      handleUpload,
      handleDownload,
      formatFileSize
    }
  }
}
</script>
