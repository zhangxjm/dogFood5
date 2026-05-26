<template>
  <div class="my-books-page">
    <div class="page-header">
      <h2>My Books</h2>
      <el-button type="primary" :icon="Plus" @click="$router.push('/publish')">Publish New</el-button>
    </div>
    <el-table v-loading="loading" :data="books" stripe style="width: 100%">
      <el-table-column label="Cover" width="100">
        <template #default="{ row }">
          <img v-if="row.cover_url" :src="row.cover_url" class="thumb" />
          <div v-else class="thumb-placeholder"><el-icon><Notebook /></el-icon></div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Title" min-width="180" />
      <el-table-column prop="author" label="Author" width="140" />
      <el-table-column label="Category" width="140">
        <template #default="{ row }">{{ row.category?.name }}</template>
      </el-table-column>
      <el-table-column label="Condition" width="120">
        <template #default="{ row }"><el-tag size="small">{{ row.condition }}</el-tag></template>
      </el-table-column>
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 'available' ? 'success' : row.status === 'reserved' ? 'warning' : 'info'"
            size="small"
          >{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Messages" width="100">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewMessages(row)">
            <el-icon><ChatDotRound /></el-icon>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="editBook(row)">Edit</el-button>
          <el-popconfirm title="Delete this book?" @confirm="deleteBook(row)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="!loading && books.length === 0" description="You haven't published any books yet" />

    <el-dialog v-model="showEditDialog" title="Edit Book" width="600px">
      <el-form :model="editForm" label-position="top">
        <el-form-item label="Title"><el-input v-model="editForm.title" /></el-form-item>
        <el-form-item label="Author"><el-input v-model="editForm.author" /></el-form-item>
        <el-form-item label="Condition">
          <el-select v-model="editForm.condition" style="width: 100%">
            <el-option label="Excellent" value="Excellent" />
            <el-option label="Good" value="Good" />
            <el-option label="Fair" value="Fair" />
            <el-option label="Poor" value="Poor" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="editForm.status" style="width: 100%">
            <el-option label="Available" value="available" />
            <el-option label="Reserved" value="reserved" />
            <el-option label="Exchanged" value="exchanged" />
          </el-select>
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="editForm.category_id" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="editForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="saveEdit">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import api from '../api'
import { ElMessage } from 'element-plus'

const books = ref([])
const loading = ref(false)
const categories = ref([])
const showEditDialog = ref(false)
const saving = ref(false)
const editForm = ref({})
const editingId = ref(null)

onMounted(async () => {
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
    const res = await api.get('/api/books/my')
    books.value = res.data
  } catch (e) {
    ElMessage.error('Failed to load books')
  } finally {
    loading.value = false
  }
}

function editBook(book) {
  editingId.value = book.id
  editForm.value = {
    title: book.title,
    author: book.author,
    condition: book.condition,
    status: book.status,
    category_id: book.category_id,
    description: book.description
  }
  showEditDialog.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    await api.put(`/api/books/${editingId.value}`, editForm.value)
    ElMessage.success('Book updated!')
    showEditDialog.value = false
    loadBooks()
  } catch (e) {} finally {
    saving.value = false
  }
}

async function deleteBook(book) {
  try {
    await api.delete(`/api/books/${book.id}`)
    ElMessage.success('Book deleted!')
    loadBooks()
  } catch (e) {}
}

function viewMessages(book) {
  ElMessage.info(`This book has messages feature. Check Messages page.`)
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
}
.thumb {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.thumb-placeholder {
  width: 60px;
  height: 80px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #c0c4cc;
  font-size: 24px;
}
</style>
