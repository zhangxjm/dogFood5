<template>
  <div class="upload-page">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span class="title">上传作品</span>
          <span class="subtitle">分享您的艺术创作</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="作品图片" prop="image">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :on-change="handleImageChange"
            :before-upload="beforeUpload"
            accept="image/*"
            :auto-upload="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持 JPG、PNG、GIF 格式，建议尺寸 1920x1080</div>
        </el-form-item>

        <el-form-item label="作品标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入作品标题" maxlength="50" />
        </el-form-item>

        <el-form-item label="作者名称" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者名称" maxlength="50" />
        </el-form-item>

        <el-form-item label="作品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="作品简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入作品简介，介绍作品的创作背景、风格特点等"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="submitForm" :loading="uploading">
            <el-icon><Upload /></el-icon>
            上传作品
          </el-button>
          <el-button size="large" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { categoryAPI, artworkAPI } from '../api'

const router = useRouter()
const formRef = ref(null)
const imageUrl = ref('')
const uploading = ref(false)
const categories = ref([])

const form = reactive({
  title: '',
  author: '',
  category_id: null,
  description: '',
  image: null
})

const rules = {
  title: [
    { required: true, message: '请输入作品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择作品分类', trigger: 'change' }
  ],
  image: [
    { required: true, message: '请上传作品图片', trigger: 'change' }
  ]
}

const loadCategories = async () => {
  try {
    const res = await categoryAPI.getAll()
    categories.value = res.data
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB！')
    return false
  }
  return true
}

const handleImageChange = (file) => {
  if (file.raw) {
    form.image = file.raw
    imageUrl.value = URL.createObjectURL(file.raw)
  }
}

const submitForm = async () => {
  if (!form.image) {
    ElMessage.warning('请先上传作品图片')
    return
  }

  await formRef.value.validate(async (valid) => {
    if (valid) {
      uploading.value = true
      try {
        const formData = new FormData()
        formData.append('image', form.image)
        formData.append('title', form.title)
        formData.append('author', form.author)
        formData.append('category_id', form.category_id)
        formData.append('description', form.description)

        await artworkAPI.create(formData)
        ElMessage.success('作品上传成功！')
        router.push('/')
      } catch (error) {
        console.error('上传失败:', error)
        ElMessage.error(error.response?.data?.error || '上传失败，请重试')
      } finally {
        uploading.value = false
      }
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  imageUrl.value = ''
  form.image = null
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.upload-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

.image-uploader {
  display: block;
}

.uploader-icon {
  font-size: 67px;
  color: #8c939d;
}

.uploaded-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

:deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-upload:hover) {
  border-color: #409eff;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
