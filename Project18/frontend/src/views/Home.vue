<template>
  <div class="home-page">
    <div class="hero-section">
      <h1 class="hero-title">探索艺术之美</h1>
      <p class="hero-subtitle">发现优秀书画作品，感受传统与现代的艺术碰撞</p>
    </div>

    <div class="filter-section">
      <el-row :gutter="20" align="middle">
        <el-col :span="16">
          <el-radio-group v-model="sortBy" @change="loadArtworks">
            <el-radio-button value="created_at">最新上传</el-radio-button>
            <el-radio-button value="likes">最受欢迎</el-radio-button>
            <el-radio-button value="views">浏览最多</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-select v-model="selectedCategory" placeholder="选择分类" @change="loadArtworks" clearable style="width: 200px;">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <div class="artworks-grid">
      <el-row :gutter="24">
        <el-col v-for="artwork in artworks" :key="artwork.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="artwork-card" shadow="hover" @click="goToDetail(artwork.id)">
            <div class="card-image">
              <img :src="getImageUrl(artwork.image_path)" :alt="artwork.title" />
            </div>
            <div class="card-content">
              <h3 class="artwork-title">{{ artwork.title }}</h3>
              <p class="artwork-author" v-if="artwork.author">作者：{{ artwork.author }}</p>
              <div class="card-footer">
                <el-tag size="small" type="info">{{ artwork.category_name }}</el-tag>
                <div class="stats">
                  <span class="stat-item">
                    <el-icon size="14"><View /></el-icon>
                    {{ artwork.views }}
                  </span>
                  <span class="stat-item">
                    <el-icon size="14"><Star /></el-icon>
                    {{ artwork.likes }}
                  </span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="pagination-section" v-if="pages > 1">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="perPage"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadArtworks"
      />
    </div>

    <el-empty v-if="artworks.length === 0 && !loading" description="暂无作品" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { artworkAPI, categoryAPI } from '../api'

const route = useRoute()
const router = useRouter()

const artworks = ref([])
const categories = ref([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(12)
const total = ref(0)
const sortBy = ref('created_at')
const selectedCategory = ref(null)

const pages = computed(() => Math.ceil(total.value / perPage.value))

const getImageUrl = (path) => {
  if (path.startsWith('http')) return path
  return `http://localhost:5001${path}`
}

const loadCategories = async () => {
  try {
    const res = await categoryAPI.getAll()
    categories.value = res.data
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const loadArtworks = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      sort_by: sortBy.value
    }
    if (selectedCategory.value) {
      params.category_id = selectedCategory.value
    }
    const res = await artworkAPI.getAll(params)
    artworks.value = res.data.artworks
    total.value = res.data.total
  } catch (error) {
    console.error('加载作品失败:', error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push(`/artwork/${id}`)
}

onMounted(() => {
  loadCategories()
  
  if (route.params.id) {
    selectedCategory.value = parseInt(route.params.id)
  }
  
  loadArtworks()
})
</script>

<style scoped>
.hero-section {
  text-align: center;
  padding: 40px 0;
  margin-bottom: 30px;
}

.hero-title {
  font-size: 36px;
  color: #303133;
  margin-bottom: 15px;
  font-weight: 600;
}

.hero-subtitle {
  font-size: 16px;
  color: #909399;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.artworks-grid {
  margin-bottom: 30px;
}

.artwork-card {
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.artwork-card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.artwork-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 15px 0 0 0;
}

.artwork-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artwork-author {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.pagination-section {
  text-align: center;
}
</style>
