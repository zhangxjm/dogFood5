<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Departments</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon> Add Department
      </el-button>
    </div>

    <el-table :data="departments" style="width: 100%" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="manager" label="Manager" />
      <el-table-column prop="createTime" label="Create Time" width="180" />
      <el-table-column label="Actions" width="180">
        <template #default="scope">
          <div class="table-actions">
            <el-button size="small" @click="showEditDialog(scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editMode ? 'Edit Department' : 'Add Department'" width="400px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Manager">
          <el-input v-model="form.manager" />
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
import { departmentApi } from '../api'

const departments = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({
  id: null,
  name: '',
  manager: ''
})

const loadData = async () => {
  departments.value = await departmentApi.list()
}

const showAddDialog = () => {
  editMode.value = false
  form.value = { id: null, name: '', manager: '' }
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
      await departmentApi.update(form.value.id, form.value)
      ElMessage.success('Update success')
    } else {
      await departmentApi.create(form.value)
      ElMessage.success('Create success')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('Operation failed')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('Confirm to delete this department?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await departmentApi.delete(row.id)
    ElMessage.success('Delete success')
    loadData()
  }).catch(() => {})
}

onMounted(loadData)
</script>
