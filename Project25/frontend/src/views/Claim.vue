<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>部门申领</span>
          <el-button type="primary" @click="handleAdd">新增申领</el-button>
        </div>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="itemName" label="文具名称" />
        <el-table-column prop="quantity" label="申领数量" width="120" />
        <el-table-column prop="applicant" label="申领人" width="120" />
        <el-table-column prop="claimDate" label="申领时间" width="180" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增申领" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="部门">
          <el-select v-model="form.deptId" placeholder="请选择部门" style="width: 100%">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.deptName" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="文具">
          <el-select v-model="form.itemId" placeholder="请选择文具" style="width: 100%">
            <el-option v-for="item in items" :key="item.id" :label="`${item.itemName} (库存:${item.stockQuantity})`" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="申领数量">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="申领人">
          <el-input v-model="form.applicant" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const tableData = ref([])
const departments = ref([])
const items = ref([])
const dialogVisible = ref(false)

const form = ref({
  deptId: null,
  itemId: null,
  quantity: 1,
  applicant: '',
  remark: ''
})

const fetchData = async () => {
  const res = await request.get('/claim/list')
  tableData.value = res.data
}

const fetchDepartments = async () => {
  const res = await request.get('/department/list')
  departments.value = res.data
}

const fetchItems = async () => {
  const res = await request.get('/item/list')
  items.value = res.data.filter(item => item.stockQuantity > 0)
}

const handleAdd = () => {
  form.value = { deptId: null, itemId: null, quantity: 1, applicant: '', remark: '' }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const selectedItem = items.value.find(item => item.id === form.value.itemId)
  if (selectedItem && form.value.quantity > selectedItem.stockQuantity) {
    ElMessage.error('申领数量超过库存数量')
    return
  }
  await request.post('/claim', form.value)
  ElMessage.success('申领成功')
  dialogVisible.value = false
  fetchData()
  fetchItems()
}

onMounted(() => {
  fetchData()
  fetchDepartments()
  fetchItems()
})
</script>
