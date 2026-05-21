<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>商品管理</h2>
      <el-button type="primary" @click="openDialog()">
        ➕ 添加商品
      </el-button>
    </div>

    <el-table :data="products" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column label="分类" width="120">
        <template #default="{ row }">
          {{ row.Category?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="120">
        <template #default="{ row }">
          ¥{{ parseFloat(row.price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="success" @click="openPriceDialog(row)">调价</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '添加商品'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.CategoryId" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="priceDialogVisible" title="价格调整" width="500px">
      <div style="text-align: center; padding: 20px;">
        <p>商品：{{ priceForm.name }}</p>
        <p>当前价格：¥{{ parseFloat(priceForm.oldPrice).toFixed(2) }}</p>
        <el-form label-width="80px" style="margin-top: 20px;">
          <el-form-item label="新价格">
            <el-input-number v-model="priceForm.newPrice" :min="0" :precision="2" style="width: 200px;" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="priceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePriceSubmit">确定调整</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { productApi, categoryApi } from '../api'

const products = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const priceDialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  name: '',
  CategoryId: null,
  price: 0,
  stock: 0,
  description: ''
})
const priceForm = ref({
  id: null,
  name: '',
  oldPrice: 0,
  newPrice: 0
})

const loadProducts = async () => {
  const res = await productApi.getAll()
  products.value = res.data
}

const loadCategories = async () => {
  const res = await categoryApi.getAll()
  categories.value = res.data
}

const openDialog = (row = null) => {
  isEdit.value = !!row
  if (row) {
    form.value = { ...row, CategoryId: row.CategoryId || row.Category?.id }
  } else {
    form.value = { id: null, name: '', CategoryId: null, price: 0, stock: 0, description: '' }
  }
  dialogVisible.value = true
}

const openPriceDialog = (row) => {
  priceForm.value = {
    id: row.id,
    name: row.name,
    oldPrice: row.price,
    newPrice: parseFloat(row.price)
  }
  priceDialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await productApi.update(form.value.id, form.value)
      ElMessage.success('编辑成功')
    } else {
      await productApi.create(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadProducts()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handlePriceSubmit = async () => {
  try {
    await productApi.updatePrice(priceForm.value.id, priceForm.value.newPrice)
    ElMessage.success('价格调整成功')
    priceDialogVisible.value = false
    loadProducts()
  } catch (error) {
    ElMessage.error('价格调整失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await productApi.delete(row.id)
    ElMessage.success('删除成功')
    loadProducts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>
