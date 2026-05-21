<template>
  <div>
    <div class="page-title">库存管理</div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品">
          <el-select v-model="searchForm.productId" placeholder="请选择商品" style="width: 200px">
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="quantity" label="库存数量" width="120">
          <template #default="{ row }">
            <el-tag :type="row.quantity <= row.warningQuantity ? 'danger' : 'success'">
              {{ row.quantity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warningQuantity" label="预警数量" width="120" />
        <el-table-column prop="lastCheckTime" label="上次盘点时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleCheck(row)">盘点</el-button>
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

    <el-dialog v-model="dialogVisible" title="库存盘点" width="500px">
      <el-form :model="checkForm" :rules="checkRules" ref="checkFormRef" label-width="100px">
        <el-form-item label="当前库存">
          <el-input :value="currentInventory" disabled />
        </el-form-item>
        <el-form-item label="盘点后数量" prop="afterQuantity">
          <el-input-number v-model="checkForm.afterQuantity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="checkForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCheckSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const productList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const checkFormRef = ref(null)
const currentInventory = ref(0)

const searchForm = ref({
  productId: null
})

const checkForm = ref({
  inventoryId: null,
  afterQuantity: 0,
  remark: ''
})

const checkRules = {
  afterQuantity: [{ required: true, message: '请输入盘点后数量', trigger: 'blur' }]
}

const fetchProductList = async () => {
  const res = await request.get('/product/all')
  productList.value = res.data
}

const fetchData = async () => {
  const res = await request.get('/inventory/list', {
    params: {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      productId: searchForm.value.productId
    }
  })
  tableData.value = res.data.records
  total.value = res.data.total
}

const resetSearch = () => {
  searchForm.value = { productId: null }
  fetchData()
}

const handleCheck = (row) => {
  checkForm.value = {
    inventoryId: row.id,
    afterQuantity: row.quantity,
    remark: ''
  }
  currentInventory.value = row.quantity
  dialogVisible.value = true
}

const handleCheckSubmit = async () => {
  await checkFormRef.value.validate()
  await request.post('/inventory/check', checkForm.value)
  ElMessage.success('盘点成功')
  dialogVisible.value = false
  fetchData()
}

onMounted(() => {
  fetchProductList()
  fetchData()
})
</script>
