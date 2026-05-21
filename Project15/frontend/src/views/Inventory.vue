<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>库存管理</span>
          <div>
            <el-button type="success" @click="handleIn">入库</el-button>
            <el-button type="warning" @click="handleOut">出库</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="库存列表" name="list">
          <el-form :inline="true" @submit.prevent="handleSearch">
            <el-form-item label="货品名称">
              <el-input v-model="searchForm.keyword" placeholder="请输入货品名称" style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="Product.name" label="货品名称" />
            <el-table-column prop="Product.spec" label="规格" />
            <el-table-column prop="Product.unit" label="单位" />
            <el-table-column prop="quantity" label="库存数量" />
            <el-table-column prop="totalIn" label="累计入库" />
            <el-table-column prop="totalOut" label="累计出库" />
            <el-table-column label="库存价值">
              <template #default="scope">
                {{ (scope.row.Product?.price * scope.row.quantity).toFixed(2) }}
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
        </el-tab-pane>
        <el-tab-pane label="出入库记录" name="logs">
          <el-table :data="logsData" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="Product.name" label="货品名称" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'in' ? 'success' : 'warning'" size="small">
                  {{ scope.row.type === 'in' ? '入库' : '出库' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="operator" label="操作人" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column prop="created_at" label="时间" />
          </el-table>
          <el-pagination
            style="margin-top: 20px; justify-content: flex-end"
            layout="total, sizes, prev, pager, next, jumper"
            :total="logsTotal"
            :page-size="logsPageSize"
            :current-page="logsCurrentPage"
            @size-change="handleLogsSizeChange"
            @current-change="handleLogsPageChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="inOutVisible" :title="isIn ? '入库' : '出库'" width="400px">
      <el-form :model="inOutForm" label-width="80px">
        <el-form-item label="货品">
          <el-select v-model="inOutForm.productId" placeholder="请选择货品" style="width: 100%">
            <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="inOutForm.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="inOutForm.operator" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="inOutForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inOutVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveInOut">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { inventoryApi, productApi } from '../api'

const activeTab = ref('list')
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = ref({ keyword: '' })

const logsData = ref([])
const logsTotal = ref(0)
const logsCurrentPage = ref(1)
const logsPageSize = ref(10)

const inOutVisible = ref(false)
const isIn = ref(true)
const products = ref([])
const inOutForm = ref({ productId: null, quantity: 1, operator: '', remark: '' })

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
    const res = await inventoryApi.getList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.value.keyword
    })
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const loadLogs = async () => {
  try {
    const res = await inventoryApi.getLogs({
      page: logsCurrentPage.value,
      pageSize: logsPageSize.value
    })
    logsData.value = res.data?.list || []
    logsTotal.value = res.data?.total || 0
  } catch (error) {
    ElMessage.error('加载记录失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  searchForm.value.keyword = ''
  handleSearch()
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

const handleLogsPageChange = (page) => {
  logsCurrentPage.value = page
  loadLogs()
}

const handleLogsSizeChange = (size) => {
  logsPageSize.value = size
  logsCurrentPage.value = 1
  loadLogs()
}

const handleIn = () => {
  isIn.value = true
  inOutForm.value = { productId: null, quantity: 1, operator: '', remark: '' }
  inOutVisible.value = true
}

const handleOut = () => {
  isIn.value = false
  inOutForm.value = { productId: null, quantity: 1, operator: '', remark: '' }
  inOutVisible.value = true
}

const handleSaveInOut = async () => {
  if (!inOutForm.value.productId) {
    ElMessage.warning('请选择货品')
    return
  }
  try {
    if (isIn.value) {
      await inventoryApi.stockIn(inOutForm.value)
      ElMessage.success('入库成功')
    } else {
      await inventoryApi.stockOut(inOutForm.value)
      ElMessage.success('出库成功')
    }
    inOutVisible.value = false
    loadData()
    loadLogs()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  }
}

onMounted(() => {
  loadProducts()
  loadData()
  loadLogs()
})
</script>