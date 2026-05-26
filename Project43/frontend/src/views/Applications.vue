<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Applications</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon> New Application
      </el-button>
    </div>

    <el-table :data="applications" style="width: 100%" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="employee.name" label="Employee" width="120" />
      <el-table-column prop="department.name" label="Department" width="150" />
      <el-table-column prop="status" label="Status" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Items">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.items" :key="index">
            {{ item.category?.name }} x{{ item.quantity }}<span v-if="index < scope.row.items.length - 1">, </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="Apply Time" width="180" />
      <el-table-column label="Actions" width="100">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="New Application" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Employee">
          <el-select v-model="form.employeeId" placeholder="Select employee" @change="onEmployeeChange">
            <el-option v-for="emp in employees" :key="emp.id" :label="emp.name" :value="emp.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Department">
          <el-select v-model="form.departmentId" placeholder="Select department">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Items">
          <div v-for="(item, index) in form.items" :key="index" style="display: flex; gap: 10px; margin-bottom: 10px;">
            <el-select v-model="item.categoryId" placeholder="Select category" style="flex: 1;">
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name + ' (Stock: ' + cat.stock + ')'" :value="cat.id" />
            </el-select>
            <el-input-number v-model="item.quantity" :min="1" />
            <el-button type="danger" @click="removeItem(index)" :disabled="form.items.length <= 1">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button type="primary" link @click="addItem">
            <el-icon><Plus /></el-icon> Add Item
          </el-button>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit (Auto Approve)</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { applicationApi, employeeApi, departmentApi, categoryApi } from '../api'

const applications = ref([])
const employees = ref([])
const departments = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const form = ref({
  employeeId: null,
  departmentId: null,
  items: [{ categoryId: null, quantity: 1 }],
  remark: ''
})

const getStatusType = (status) => {
  const types = {
    'AUTO_APPROVED': 'success',
    'PENDING': 'warning',
    'REJECTED': 'danger'
  }
  return types[status] || 'info'
}

const loadData = async () => {
  applications.value = await applicationApi.list()
}

const loadOptions = async () => {
  employees.value = await employeeApi.list()
  departments.value = await departmentApi.list()
  categories.value = await categoryApi.list()
}

const showAddDialog = () => {
  form.value = {
    employeeId: null,
    departmentId: null,
    items: [{ categoryId: null, quantity: 1 }],
    remark: ''
  }
  dialogVisible.value = true
}

const addItem = () => {
  form.value.items.push({ categoryId: null, quantity: 1 })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

const onEmployeeChange = (empId) => {
  const emp = employees.value.find(e => e.id === empId)
  if (emp && emp.department) {
    form.value.departmentId = emp.department.id
  }
}

const handleSubmit = async () => {
  try {
    const payload = {
      employee: { id: form.value.employeeId },
      department: { id: form.value.departmentId },
      remark: form.value.remark,
      items: form.value.items.map(item => ({
        category: { id: item.categoryId },
        quantity: item.quantity
      }))
    }
    await applicationApi.create(payload)
    ElMessage.success('Application submitted and auto-approved')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(error.response?.data || 'Submission failed')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('Confirm to delete this application?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await applicationApi.delete(row.id)
    ElMessage.success('Delete success')
    loadData()
  }).catch(() => {})
}

onMounted(() => {
  loadData()
  loadOptions()
})
</script>
