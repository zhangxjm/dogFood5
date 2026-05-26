<template>
  <div class="home-page">
    <el-card class="banner-card" shadow="never">
      <div class="banner-content">
        <h1>Exchange Idle Books on Campus</h1>
        <p>Give your books a new reader. Find treasures from fellow students.</p>
      </div>
    </el-card>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="Search by title or author..."
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">Search</el-button>
        </template>
      </el-input>
    </div>

    <div class="filter-bar">
      <el-select v-model="filterCategory" placeholder="All categories" clearable @change="loadBooks" style="width: 200px">
        <el-option
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
        />
      </el-select>
      <el-select v-model="filterStatus" placeholder="All status" clearable @change="loadBooks" style="width: 160px">
        <el-option label="Available" value="available" />
        <el-option label="Reserved" value="reserved" />
        <el-option label="Exchanged" value="exchanged" />
      </el-select>
    </div>

    <div v-loading="loading" class="book-grid">
      <el-card
        v-for="book in books"
        :key="book.id"
        class="book-card"
        shadow="hover"
        @click="goDetail(book.id)"
      >
        <div class="book-cover">
          <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" />
          <div v-else class="cover-placeholder">
            <el-icon><Notebook /></el-icon>
          </div>
          <el-tag
            :type="book.status === 'available' ? 'success' : book.status === 'reserved' ? 'warning' : 'info'"
            size="small"
            class="status-tag"
          >
            {{ book.status }}
          </el-tag>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">by {{ book.author }}</p>
          <p class="book-meta">
            <el-icon><Collection /></el-icon> {{ book.category?.name || 'N/A' }}
          </p>
          <p class="book-meta">
            <el-icon><User /></el-icon> {{ book.owner?.username || 'Unknown' }}
          </p>
          <p class="book-condition">
            Condition: <el-tag size="small">{{ book.condition }}</el-tag>
          </p>
        </div>
      </el-card>
    </div>

    <el-empty v-if="!loading && books.length === 0" description="No books found" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const books = ref([])
const categories = ref([])
const keyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const loading = ref(false)

onMounted(() => {
  loadCategories()
  loadBooks()
})

async function loadCategories() {
  try {
    const res = await api.get('/api/categories')
    categories.value = res.data
  } catch (e) {}
}

async function loadBooks() {
  loading.value = true
  try {
    const params = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterCategory.value) params.category_id = filterCategory.value
    if (filterStatus.value) params.status = filterStatus.value
    const res = await api.get('/api/books', { params })
    books.value = res.data
  } catch (e) {
    ElMessage.error('Failed to load books')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  loadBooks()
}

function goDetail(id) {
  router.push(`/book/${id}`)
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
}
.banner-card {
  border-radius: 12px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.banner-card :deep(.el-card__body) {
  padding: 0;
}
.banner-content {
  color: #fff;
  padding: 40px;
  text-align: center;
}
.banner-content h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
}
.banner-content p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}
.search-bar {
  margin-bottom: 16px;
}
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.book-card {
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s;
}
.book-card:hover {
  transform: translateY(-4px);
}
.book-cover {
  position: relative;
  height: 180px;
  background: #f0f2f5;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-placeholder {
  font-size: 64px;
  color: #c0c4cc;
}
.status-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}
.book-info h3 {
  margin: 0 0 6px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-author {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
}
.book-meta {
  margin: 4px 0;
  color: #909399;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.book-condition {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #606266;
}
</style>
