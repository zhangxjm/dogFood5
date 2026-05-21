<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>入库核验</span>
          <el-button type="primary" @click="handleAdd">新增入库</el-button>
        </div>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="stockInNo" label="入库单号" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag type="success">已入库</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stockInDate" label="入库时间" width="180" />
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增入库" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="采购订单">
          <el-select v-model="form.orderId" placeholder="请选择订单" style="width: 100%">
            <el-option v-for="order in approvedOrders" :key="order.id" :label="order.orderNo" :value="order.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="form.operator" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认入库</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const tableData = ref([])
const approvedOrders = ref([])
const dialogVisible = ref(false)

const form = ref({
  orderId: null,
  operator: '',
  remark: ''
})

const fetchData = async () => {
  const res = await request.get('/stockIn/list')
  tableData.value = res.data
}

const fetchApprovedOrders = async () => {
  const res = await request.get('/order/list')
  approvedOrders.value = res.data.filter(order => order.status === 1)
}

const handleAdd = () => {
  form.value = { orderId: null, operator: '', remark: '' }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await request.post('/stockIn', form.value)
  ElMessage.success('入库成功')
  dialogVisible.value = false
  fetchData()
  fetchApprovedOrders()
}

onMounted(() => {
  fetchData()
  fetchApprovedOrders()
})
</script>
