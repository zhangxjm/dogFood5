<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>采购订单</span>
          <el-button type="primary" @click="handleAdd">新增订单</el-button>
        </div>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单编号" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">¥{{ scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看详情</el-button>
            <el-button v-if="scope.row.status === 0" size="small" type="success" @click="handleApprove(scope.row.id)">审核通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增采购订单" width="700px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="供应商">
          <el-input v-model="form.supplier" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="采购明细">
          <el-table :data="form.details" border style="width: 100%">
            <el-table-column prop="itemName" label="文具名称" />
            <el-table-column prop="specification" label="规格" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="unitPrice" label="单价" width="100">
              <template #default="scope">¥{{ scope.row.unitPrice }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="scope">¥{{ scope.row.amount }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="danger" @click="removeDetail(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="margin-top: 10px" @click="showItemDialog">添加文具</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="itemDialogVisible" title="选择文具" width="600px">
      <el-table :data="items" border style="width: 100%" @row-click="handleSelectItem">
        <el-table-column prop="itemName" label="文具名称" />
        <el-table-column prop="specification" label="规格" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="unitPrice" label="单价" width="100">
          <template #default="scope">¥{{ scope.row.unitPrice }}</template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; text-align: right">
        <span style="margin-right: 10px">数量：</span>
        <el-input-number v-model="selectedQuantity" :min="1" style="width: 150px" />
        <el-button type="primary" style="margin-left: 10px" @click="confirmAddItem">确认添加</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="订单详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ currentOrder.supplier }}</el-descriptions-item>
        <el-descriptions-item label="总金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentOrder.status)">{{ getStatusText(currentOrder.status) }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <h4>采购明细</h4>
      <el-table :data="orderDetails" border style="width: 100%; margin-top: 10px">
        <el-table-column prop="itemName" label="文具名称" />
        <el-table-column prop="specification" label="规格" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="unitPrice" label="单价" width="100">
          <template #default="scope">¥{{ scope.row.unitPrice }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="scope">¥{{ scope.row.amount }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const tableData = ref([])
const items = ref([])
const orderDetails = ref([])
const dialogVisible = ref(false)
const itemDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const selectedItem = ref(null)
const selectedQuantity = ref(1)
const currentOrder = ref({})

const form = ref({
  supplier: '',
  remark: '',
  details: []
})

const getStatusType = (status) => {
  const types = ['info', 'warning', 'success']
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = ['待审核', '已审核', '已入库']
  return texts[status] || '未知'
}

const fetchData = async () => {
  const res = await request.get('/order/list')
  tableData.value = res.data
}

const fetchItems = async () => {
  const res = await request.get('/item/list')
  items.value = res.data
}

const handleAdd = () => {
  form.value = { supplier: '', remark: '', details: [] }
  dialogVisible.value = true
}

const showItemDialog = () => {
  itemDialogVisible.value = true
}

const handleSelectItem = (row) => {
  selectedItem.value = row
}

const confirmAddItem = () => {
  if (!selectedItem.value) {
    ElMessage.warning('请选择文具')
    return
  }
  const detail = {
    itemId: selectedItem.value.id,
    itemName: selectedItem.value.itemName,
    specification: selectedItem.value.specification,
    unit: selectedItem.value.unit,
    unitPrice: selectedItem.value.unitPrice,
    quantity: selectedQuantity.value,
    amount: selectedItem.value.unitPrice * selectedQuantity.value
  }
  form.value.details.push(detail)
  itemDialogVisible.value = false
  selectedItem.value = null
  selectedQuantity.value = 1
}

const removeDetail = (index) => {
  form.value.details.splice(index, 1)
}

const handleSubmit = async () => {
  if (form.value.details.length === 0) {
    ElMessage.warning('请添加采购明细')
    return
  }
  await request.post('/order', form.value)
  ElMessage.success('订单创建成功')
  dialogVisible.value = false
  fetchData()
}

const handleApprove = async (id) => {
  await request.post(`/order/approve/${id}`)
  ElMessage.success('审核成功')
  fetchData()
}

const handleView = async (row) => {
  currentOrder.value = row
  const res = await request.get(`/order/${row.id}/details`)
  orderDetails.value = res.data
  detailDialogVisible.value = true
}

onMounted(() => {
  fetchData()
  fetchItems()
})
</script>
