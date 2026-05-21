<template>
  <div class="inventory">
    <h2>库存管理</h2>
    
    <el-card class="inventory-card">
      <template #header>
        <div class="card-header">
          <span>当前库存状态</span>
        </div>
      </template>
      <div class="inventory-status">
        <div class="status-item">
          <span class="label">可用库存：</span>
          <span class="value highlight">{{ inventory.availableQuantity || 0 }} 桶</span>
        </div>
        <div class="status-item">
          <span class="label">总入库量：</span>
          <span class="value">{{ inventory.totalQuantity || 0 }} 桶</span>
        </div>
        <div class="status-item">
          <span class="label">品牌：</span>
          <span class="value">{{ inventory.brand || '-' }}</span>
        </div>
        <div class="status-item">
          <span class="label">单价：</span>
          <span class="value">¥ {{ inventory.pricePerBucket || 0 }}</span>
        </div>
      </div>
    </el-card>

    <el-card class="operation-card">
      <template #header>
        <div class="card-header">
          <span>库存入库</span>
        </div>
      </template>
      <el-form :model="stockInForm" label-width="100px">
        <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="入库数量">
                <el-input-number v-model="stockInForm.quantity" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌">
                <el-input v-model="stockInForm.brand" placeholder="请输入品牌" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单价(元)">
                <el-input-number v-model="stockInForm.pricePerBucket" :min="0" :precision="2" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="操作员">
                <el-input v-model="stockInForm.operator" placeholder="请输入操作员姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input v-model="stockInForm.remark" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="handleStockIn" :loading="loading">
            <el-icon><Upload /></el-icon>
              确认入库
            </el-button>
          </el-form-item>
        </el-form>
    </el-card>

    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>操作记录</span>
        </div>
      </template>
      <el-table :data="operations" stripe>
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.operationType === '入库' ? 'success' : 'primary'">
              {{ row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="beforeQuantity" label="操作前库存" width="120" />
        <el-table-column prop="afterQuantity" label="操作后库存" width="120" />
        <el-table-column prop="operator" label="操作员" width="120" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getInventory, stockIn, getOperationHistory } from '../api/inventory'

const inventory = ref({})
const operations = ref([])
const loading = ref(false)

const stockInForm = ref({
  quantity: 10,
  brand: '',
  pricePerBucket: 15,
  operator: '',
  remark: ''
})

const loadInventory = async () => {
  const res = await getInventory()
  inventory.value = res.data
}

const loadOperations = async () => {
  const res = await getOperationHistory()
  operations.value = res.data
}

const handleStockIn = async () => {
  if (stockInForm.value.quantity <= 0) {
    ElMessage.warning('请输入入库数量')
    return
  }
  
  loading.value = true
  try {
    await stockIn(stockInForm.value)
    ElMessage.success('入库成功')
    stockInForm.value.quantity = 10
    stockInForm.value.remark = ''
    await loadInventory()
    await loadOperations()
  } catch (error) {
    console.error('入库失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInventory()
  loadOperations()
})
</script>

<style scoped>
.inventory h2 {
  margin-bottom: 20px;
  color: #333;
}

.inventory-card,
.operation-card,
.history-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  font-weight: bold;
  color: #333;
}

.inventory-status {
  display: flex;
  gap: 40px;
  padding: 10px 0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-item .label {
  color: #606266;
}

.status-item .value {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.status-item .value.highlight {
  font-size: 24px;
  color: #67c23a;
  font-weight: bold;
}
</style>