<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Inventory Records</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon> Add Record
      </el-button>
    </div>

    <el-table :data="inventoryList" style="width: 100%" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="category.name" label="Category" />
      <el-table-column prop="changeQuantity" label="Change" width="120">
        <template #default="scope">
          <span :style="{ color: scope.row.changeQuantity > 0 ? '#67C23A' : '#F56C6C' }">
            {{ scope.row.changeQuantity > 0 ? '+' : '' }}{{ scope.row.changeQuantity }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="changeType" label="Type" width="120">
        <template #default="scope">
          <el-tag :type="getChangeTypeTag(scope.row.changeType)">{{ scope.row.changeType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="recordTime" label="Record Time" width="180" />
      <el-table-column prop="remark" label="Remark" />
      <el-table-column label="Actions" width="100">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="Add Inventory Record" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Category">
          <el-select v-model="form.categoryId" placeholder="Select category">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name + ' (Stock: ' + cat.stock + ')'" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Change Quantity">
          <el-input-number v-model="form.changeQuantity" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.changeType">
            <el-option label="INIT" value="INIT" />
            <el-option label="IN" value="IN" />
            <el-option label="OUT" value="OUT" />
            <el-option label="ADJUST" value="ADJUST" />
          </el-select>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="form.remark" type="textarea" />
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
import { inventoryApi, categoryApi } from '../api'

const inventoryList = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const form = ref({
  categoryId: null,
  changeQuantity: 0,
  changeType: 'IN',
  remark: ''
})

const getChangeTypeTag = (type) => {
  const types = {
    'INIT': 'info',
    'IN': 'success',
    'OUT': 'warning',
    'APPLY': 'danger',
    'ADJUST': ''
  }
  return types[type] || ''
}

const loadData = async () => {
  inventoryList.value = await inventoryApi.list()
}

const loadCategories = async () => {
  categories.value = await categoryApi.list()
}

const showAddDialog = () => {
  form.value = { categoryId: null, changeQuantity: 0, changeType: 'IN', remark: '' }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    const payload = {
      category: { id: form.value.categoryId },
      changeQuantity: form.value.changeQuantity,
      changeType: form.value.changeType,
      remark: form.value.remark
    }
    await inventoryApi.create(payload)
    ElMessage.success('Create success')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(error.response?.data || 'Operation failed')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('Confirm to delete this record?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await inventoryApi.delete(row.id)
    ElMessage.success('Delete success')
    loadData()
  }).catch(() => {})
}

onMounted(() => {
  loadData()
  loadCategories()
})
</script>
