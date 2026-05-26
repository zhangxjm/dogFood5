<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Categories</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon> Add Category
      </el-button>
    </div>

    <el-table :data="categories" style="width: 100%" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="type" label="Type" width="120" />
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="stock" label="Stock" width="100" />
      <el-table-column prop="price" label="Price" width="100">
        <template #default="scope">¥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="Actions" width="180">
        <template #default="scope">
          <div class="table-actions">
            <el-button size="small" @click="showEditDialog(scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editMode ? 'Edit Category' : 'Add Category'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.type">
            <el-option label="Drinks" value="Drinks" />
            <el-option label="Desserts" value="Desserts" />
            <el-option label="Fruits" value="Fruits" />
            <el-option label="Dairy" value="Dairy" />
            <el-option label="Snacks" value="Snacks" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="Stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="Price">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryApi } from '../api'

const categories = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({
  id: null,
  name: '',
  type: '',
  description: '',
  stock: 0,
  price: 0
})

const loadData = async () => {
  categories.value = await categoryApi.list()
}

const showAddDialog = () => {
  editMode.value = false
  form.value = { id: null, name: '', type: '', description: '', stock: 0, price: 0 }
  dialogVisible.value = true
}

const showEditDialog = (row) => {
  editMode.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (editMode.value) {
      await categoryApi.update(form.value.id, form.value)
      ElMessage.success('Update success')
    } else {
      await categoryApi.create(form.value)
      ElMessage.success('Create success')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('Operation failed')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('Confirm to delete this category?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await categoryApi.delete(row.id)
    ElMessage.success('Delete success')
    loadData()
  }).catch(() => {})
}

onMounted(loadData)
</script>
