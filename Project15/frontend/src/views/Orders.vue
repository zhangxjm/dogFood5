<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>订单管理</span>
          <el-button type="primary" @click="handleAdd">新增订单</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="customerName" label="客户名称" />
        <el-table-column prop="customerPhone" label="客户电话" />
        <el-table-column prop="totalAmount" label="总金额(元)" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 'pending'" size="small" type="success" @click="handleComplete(scope.row)">完成</el-button>
            <el-button v-if="scope.row.status === 'pending'" size="small" type="danger" @click="handleCancel(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增订单" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="客户名称">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input v-model="form.customerPhone" placeholder="请输入客户电话" />
        </el-form-item>
        <el-form-item label="订单项">
          <div style="margin-bottom: 10px">
            <el-button type="primary" size="small" @click="addOrderItem">+ 添加货品</el-button>
          </div>
          <div v-for="(item, index) in form.items" :key="index" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center">
            <el-select v-model="item.productId" placeholder="选择货品" style="flex: 2">
              <el-option v-for="p in products" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
            <el-input-number v-model="item.quantity" :min="1" placeholder="数量" style="width: 120px" />
            <el-button type="danger" size="small" @click="removeOrderItem(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="订单详情" width="600px">
      <el-descriptions :column="2" border v-if="orderDetail">
        <el-descriptions-item label="订单号">{{ orderDetail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(orderDetail.status)">{{ getStatusText(orderDetail.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ orderDetail.customerName }}</el-descriptions-item>
        <el-descriptions-item label="客户电话">{{ orderDetail.customerPhone }}</el-descriptions-item>
        <el-descriptions-item label="总金额">{{ orderDetail.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ orderDetail.remark }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="orderDetail?.items || []" style="width: 100%; margin-top: 20px" border size="small">
        <el-table-column prop="Product.name" label="货品名称" />
        <el-table-column prop="Product.spec" label="规格" />
        <el-table-column prop="Product.unit" label="单位" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="amount" label="小计" />
      </el-table>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi, productApi } from '../api'

const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const products = ref([])
const orderDetail = ref(null)
const form = ref({
  customerName: '',
  customerPhone: '',
  items: [{ productId: null, quantity: 1 }],
  remark: ''
})

const getStatusType = (status) => {
  const map = { pending: 'warning', completed: 'success', cancelled: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { pending: '待处理', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const loadProducts = async () => {
  try {
    const res = await productApi.getAll()
    products.value = res.data || []
  } catch (error) {
    console.error('加载货品失败', error)
  }
}

const loadData = async () => {
  try {
    const res = await orderApi.getList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

const handleAdd = () => {
  form.value = {
    customerName: '',
    customerPhone: '',
    items: [{ productId: null, quantity: 1 }],
    remark: ''
  }
  dialogVisible.value = true
}

const addOrderItem = () => {
  form.value.items.push({ productId: null, quantity: 1 })
}

const removeOrderItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

const handleSave = async () => {
  if (!form.value.customerName) {
    ElMessage.warning('请输入客户名称')
    return
  }
  for (const item of form.value.items) {
    if (!item.productId) {
      ElMessage.warning('请选择所有货品')
      return
    }
  }
  try {
    await orderApi.create(form.value)
    ElMessage.success('创建成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '创建失败')
  }
}

const handleDetail = async (row) => {
  try {
    const res = await orderApi.getDetail(row.id)
    orderDetail.value = res.data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('加载详情失败')
  }
}

const handleComplete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要完成该订单吗？完成后库存将自动扣减。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderApi.complete(row.id)
    ElMessage.success('订单已完成')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '操作失败')
    }
  }
}

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderApi.cancel(row.id)
    ElMessage.success('订单已取消')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  loadProducts()
  loadData()
})
</script>