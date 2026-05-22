<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>线下销售记录</h2>
      <el-button type="primary" @click="openDialog()">
        ➕ 新增销售
      </el-button>
    </div>

    <el-table :data="sales" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="商品名称" width="180">
        <template #default="{ row }">
          {{ row.Product?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="100" />
      <el-table-column label="单价" width="120">
        <template #default="{ row }">
          ¥{{ parseFloat(row.unitPrice).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="总价" width="120">
        <template #default="{ row }">
          ¥{{ parseFloat(row.totalPrice).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="saleDate" label="销售时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.saleDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="handleDelete(row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="新增销售" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="选择商品">
          <el-select v-model="form.ProductId" placeholder="请选择商品" style="width: 100%;" @change="onProductChange">
            <el-option v-for="product in products" :key="product.id" :label="`${product.name} (库存: ${product.stock})`" :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售数量">
          <el-input-number v-model="form.quantity" :min="1" :max="maxStock" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="单价">
          <span>¥{{ currentPrice.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="总价">
          <span style="color: #f56c6c; font-weight: bold; font-size: 18px;">¥{{ (currentPrice * form.quantity).toFixed(2) }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认销售</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { saleApi, productApi } from '../api'

const sales = ref([])
const products = ref([])
const dialogVisible = ref(false)
const form = ref({
  ProductId: null,
  quantity: 1
})
const currentPrice = ref(0)
const maxStock = ref(0)

const loadSales = async () => {
  const res = await saleApi.getAll()
  sales.value = res.data
}

const loadProducts = async () => {
  const res = await productApi.getAll()
  products.value = res.data
}

const onProductChange = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) {
    currentPrice.value = parseFloat(product.price)
    maxStock.value = product.stock
    if (form.value.quantity > maxStock.value) {
      form.value.quantity = maxStock.value
    }
  }
}

const openDialog = () => {
  form.value = { ProductId: null, quantity: 1 }
  currentPrice.value = 0
  maxStock.value = 0
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await saleApi.create(form.value)
    ElMessage.success('销售记录成功')
    dialogVisible.value = false
    loadSales()
    loadProducts()
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '销售失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要撤销该销售记录吗？库存将被恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await saleApi.delete(row.id)
    ElMessage.success('撤销成功，库存已恢复')
    loadSales()
    loadProducts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('撤销失败')
    }
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadSales()
  loadProducts()
})
</script>
