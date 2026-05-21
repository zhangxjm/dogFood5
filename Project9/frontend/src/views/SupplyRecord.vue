<template>
  <div>
    <div class="page-title">供货记录</div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierId" placeholder="请选择供应商" style="width: 200px">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="searchForm.productId" placeholder="请选择商品" style="width: 200px">
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleAdd">新增供货记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="supplierName" label="供应商" />
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="{ row }">¥{{ row.totalAmount }}</template>
        </el-table-column>
        <el-table-column prop="supplyDate" label="供货日期" width="150" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        style="margin-top: 20px; justify-content: flex-end"
        @current-change="fetchData"
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="form.supplierId" style="width: 100%">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="productId">
          <el-select v-model="form.productId" style="width: 100%">
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="供货日期" prop="supplyDate">
          <el-date-picker v-model="form.supplyDate" type="date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const supplierList = ref([])
const productList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const searchForm = ref({
  supplierId: null,
  productId: null
})

const form = ref({
  id: null,
  supplierId: null,
  productId: null,
  quantity: 0,
  price: 0,
  totalAmount: 0,
  supplyDate: '',
  remark: ''
})

const rules = {
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  supplyDate: [{ required: true, message: '请选择供货日期', trigger: 'change' }]
}

const fetchSupplierList = async () => {
  const res = await request.get('/supplier/all')
  supplierList.value = res.data
}

const fetchProductList = async () => {
  const res = await request.get('/product/all')
  productList.value = res.data
}

const fetchData = async () => {
  const res = await request.get('/supplyRecord/list', {
    params: {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      supplierId: searchForm.value.supplierId,
      productId: searchForm.value.productId
    }
  })
  tableData.value = res.data.records
  total.value = res.data.total
}

const resetSearch = () => {
  searchForm.value = { supplierId: null, productId: null }
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '新增供货记录'
  isEdit.value = false
  form.value = { id: null, supplierId: null, productId: null, quantity: 0, price: 0, totalAmount: 0, supplyDate: '', remark: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑供货记录'
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  form.value.totalAmount = form.value.quantity * form.value.price
  if (isEdit.value) {
    await request.put('/supplyRecord', form.value)
    ElMessage.success('编辑成功')
  } else {
    await request.post('/supplyRecord', form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchData()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该供货记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await request.delete(`/supplyRecord/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  })
}

onMounted(() => {
  fetchSupplierList()
  fetchProductList()
  fetchData()
})
</script>
