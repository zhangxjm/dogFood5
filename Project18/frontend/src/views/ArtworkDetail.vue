<template>
  <div class="detail-page" v-loading="loading">
    <el-card v-if="artwork" class="detail-card">
      <div class="detail-content">
        <div class="image-section">
          <img :src="getImageUrl(artwork.image_path)" :alt="artwork.title" class="artwork-image" />
        </div>
        <div class="info-section">
          <h1 class="artwork-title">{{ artwork.title }}</h1>
          
          <div class="meta-info">
            <el-tag type="success" size="large">{{ artwork.category_name }}</el-tag>
            <span class="author" v-if="artwork.author">作者：{{ artwork.author }}</span>
          </div>

          <div class="stats-row">
            <div class="stat-item">
              <el-icon size="20" color="#409EFF"><View /></el-icon>
              <span class="stat-value">{{ artwork.views }}</span>
              <span class="stat-label">浏览</span>
            </div>
            <div class="stat-item">
              <el-icon size="20" color="#E6A23C"><Star /></el-icon>
              <span class="stat-value">{{ artwork.likes }}</span>
              <span class="stat-label">点赞</span>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" size="large" @click="handleLike" :loading="liking">
              <el-icon><Star /></el-icon>
              点赞作品
            </el-button>
            <el-button size="large" @click="$router.back()">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
          </div>

          <div class="description-section" v-if="artwork.description">
            <h3 class="section-title">作品简介</h3>
            <p class="description">{{ artwork.description }}</p>
          </div>

          <div class="upload-time">
            <span>上传时间：{{ formatDate(artwork.created_at) }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { artworkAPI } from '../api'

const route = useRoute()

const artwork = ref(null)
const loading = ref(false)
const liking = ref(false)

const getImageUrl = (path) => {
  if (path.startsWith('http')) return path
  return `http://localhost:5001${path}`
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadArtwork = async () => {
  loading.value = true
  try {
    const res = await artworkAPI.getById(route.params.id)
    artwork.value = res.data
  } catch (error) {
    console.error('加载作品失败:', error)
    ElMessage.error('加载作品失败')
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  if (liking.value) return
  liking.value = true
  try {
    const res = await artworkAPI.like(route.params.id)
    artwork.value.likes = res.data.likes
    ElMessage.success('点赞成功！')
  } catch (error) {
    if (error.response?.data?.error) {
      ElMessage.warning(error.response.data.error)
    } else {
      ElMessage.error('点赞失败')
    }
  } finally {
    liking.value = false
  }
}

onMounted(() => {
  loadArtwork()
})
</script>

<style scoped>
.detail-page {
  min-height: 60vh;
}

.detail-card {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-content {
  display: flex;
  gap: 40px;
}

.image-section {
  flex: 1;
}

.artwork-image {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.info-section {
  flex: 0 0 350px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.artwork-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author {
  font-size: 16px;
  color: #606266;
}

.stats-row {
  display: flex;
  gap: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons .el-button {
  width: 100%;
}

.description-section {
  border-top: 1px solid #ebeef5;
  padding-top: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.description {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0;
}

.upload-time {
  font-size: 13px;
  color: #909399;
  margin-top: auto;
}

@media (max-width: 900px) {
  .detail-content {
    flex-direction: column;
  }
  
  .info-section {
    flex: none;
  }
}
</style>
