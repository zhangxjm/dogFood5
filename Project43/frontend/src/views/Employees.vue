<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Employees</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon> Add Employee
      </el-button>
    </div>

    <el-table :data="employees" style="width: 100%" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="department.name" label="Department" width="150" />
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

    <el-dialog v-model="dialogVisible" :title="editMode ? 'Edit Employee' : 'Add Employee'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Department">
          <el-select v-model="form.departmentId" placeholder="Select department">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
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
import { employeeApi, departmentApi } from '../api'

const employees = ref([])
const departments = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({
  id: null,
  name: '',
  email: '',
  departmentId: null
})

const loadData = async () => {
  employees.value = await employeeApi.list()
}

const loadDepartments = async () => {
  departments.value = await departmentApi.list()
}

const showAddDialog = () => {
  editMode.value = false
  form.value = { id: null, name: '', email: '', departmentId: null }
  dialogVisible.value = true
}

const showEditDialog = (row) => {
  editMode.value = true
  form.value = {
    id: row.id,
    name: row.name,
    email: row.email,
    departmentId: row.department?.id
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      department: { id: form.value.departmentId }
    }
    if (editMode.value) {
      await employeeApi.update(form.value.id, payload)
      ElMessage.success('Update success')
    } else {
      await employeeApi.create(payload)
      ElMessage.success('Create success')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('Operation failed')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('Confirm to delete this employee?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await employeeApi.delete(row.id)
    ElMessage.success('Delete success')
    loadData()
  }).catch(() => {})
}

onMounted(() => {
  loadData()
  loadDepartments()
})
</script>
