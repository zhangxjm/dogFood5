<template>
  <div class="home">
    <h2>首页概览</h2>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon available"><Box /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ inventory.availableQuantity || 0 }}</div>
              <div class="stat-label">可用库存</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon total"><Collection /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ inventory.totalQuantity || 0 }}</div>
              <div class="stat-label">总入库量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon consumption"><CoffeeCup /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ monthlyConsumption || 0 }}</div>
              <div class="stat-label">本月消耗</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon brand"><ShoppingBag /></el-icon>
            <div class="stat-info">
              <div class="stat-value brand-text">{{ inventory.brand || '默认' }}</div>
              <div class="stat-label">桶装水品牌</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>最近申领记录</span>
            </div>
          </template>
          <el-table :data="recentClaims" stripe>
            <el-table-column prop="employeeName" label="员工姓名" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="quantity" label="数量(桶)" />
            <el-table-column prop="claimTime" label="申领时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>库存操作记录</span>
            </div>
          </template>
          <el-table :data="recentOperations" stripe>
            <el-table-column prop="operationType" label="操作类型">
              <template #default="{ row }">
                <el-tag :type="row.operationType === '入库' ? 'success' : 'primary'">
                  {{ row.operationType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="beforeQuantity" label="操作前" />
            <el-table-column prop="afterQuantity" label="操作后" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getInventory, getOperationHistory } from '../api/inventory'
import { getAllClaims, getMonthlyConsumption } from '../api/claim'

const inventory = ref({})
const recentClaims = ref([])
const recentOperations = ref([])
const monthlyConsumption = ref(0)

const loadData = async () => {
  try {
    const [invRes, claimsRes, opsRes, consumptionRes] = await Promise.all([
      getInventory(),
      getAllClaims(),
      getOperationHistory(),
      getMonthlyConsumption()
    ])
    
    inventory.value = invRes.data
    recentClaims.value = claimsRes.data.slice(-5).reverse()
    recentOperations.value = opsRes.data.slice(0, 5)
    monthlyConsumption.value = consumptionRes.data
  } catch (error) {
    console.error('加载数据失败', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home h2 {
  margin-bottom: 20px;
  color: #333;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 40px;
  padding: 10px;
  border-radius: 8px;
}

.stat-icon.available {
  color: #67c23a;
  background: #f0f9eb;
}

.stat-icon.total {
  color: #409eff;
  background: #ecf5ff;
}

.stat-icon.consumption {
  color: #e6a23c;
  background: #fdf6ec;
}

.stat-icon.brand {
  color: #909399;
  background: #f4f4f5;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-value.brand-text {
  font-size: 18px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.content-row {
  margin-top: 20px;
}

.content-card {
  height: 100%;
}

.card-header {
  font-weight: bold;
  color: #333;
}
</style>