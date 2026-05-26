<template>
  <div class="categories-page">
    <h2>Book Categories</h2>
    <el-row :gutter="20">
      <el-col v-for="cat in categories" :key="cat.id" :span="6" style="margin-bottom: 20px">
        <el-card class="category-card" shadow="hover" @click="goCategory(cat.id)">
          <el-icon class="cat-icon"><Collection /></el-icon>
          <h3>{{ cat.name }}</h3>
          <p>{{ cat.description || 'Browse books in this category' }}</p>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!loading && categories.length === 0" description="No categories" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const categories = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/api/categories')
    categories.value = res.data
  } catch (e) {
    ElMessage.error('Failed to load categories')
  } finally {
    loading.value = false
  }
})

function goCategory(id) {
  router.push({ path: '/', query: { category_id: id } })
}
</script>

<style scoped>
.categories-page h2 {
  margin-bottom: 20px;
}
.category-card {
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.category-card:hover {
  transform: translateY(-4px);
  border-color: #409eff;
}
.cat-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 12px;
}
.category-card h3 {
  margin: 8px 0;
}
.category-card p {
  color: #909399;
  font-size: 13px;
  margin: 0;
}
</style>
