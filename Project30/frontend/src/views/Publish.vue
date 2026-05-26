<template>
  <div class="publish-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span><el-icon><Plus /></el-icon> Publish a Book</span>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" :inline="false">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Title" prop="title">
              <el-input v-model="form.title" placeholder="Book title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Author" prop="author">
              <el-input v-model="form.author" placeholder="Book author" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="form.isbn" placeholder="ISBN (optional)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Publisher" prop="publisher">
              <el-input v-model="form.publisher" placeholder="Publisher (optional)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Publish Year" prop="publish_year">
              <el-input-number v-model="form.publish_year" :min="1900" :max="2030" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Category" prop="category_id">
              <el-select v-model="form.category_id" placeholder="Select category" style="width: 100%">
                <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Condition" prop="condition">
              <el-select v-model="form.condition" style="width: 100%">
                <el-option label="Excellent" value="Excellent" />
                <el-option label="Good" value="Good" />
                <el-option label="Fair" value="Fair" />
                <el-option label="Poor" value="Poor" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Status" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="Available" value="available" />
                <el-option label="Reserved" value="reserved" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Cover Image URL" prop="cover_url">
          <el-input v-model="form.cover_url" placeholder="https://... (optional)" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="Describe your book, what would you like to exchange..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit" :icon="Check">
            Publish
          </el-button>
          <el-button @click="$router.push('/')">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Check } from '@element-plus/icons-vue'
import api from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const categories = ref([])
const form = ref({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  publish_year: null,
  category_id: null,
  condition: 'Good',
  status: 'available',
  cover_url: '',
  description: ''
})
const rules = {
  title: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
  author: [{ required: true, message: 'Please enter author', trigger: 'blur' }],
  category_id: [{ required: true, message: 'Please select category', trigger: 'change' }]
}

onMounted(async () => {
  try {
    const res = await api.get('/api/categories')
    categories.value = res.data
  } catch (e) {}
})

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await api.post('/api/books', form.value)
      ElMessage.success('Book published successfully!')
      router.push(`/book/${res.data.id}`)
    } catch (e) {
      // error handled by interceptor
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.publish-page {
  max-width: 900px;
  margin: 0 auto;
}
.card-header {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
