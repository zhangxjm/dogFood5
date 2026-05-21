<template>
  <div class="claim">
    <h2>申领登记</h2>
    
    <el-card class="claim-card">
      <template #header>
        <div class="card-header">
          <span>员工申领登记</span>
          <el-tag type="warning" v-if="inventory.availableQuantity">
            当前库存: {{ inventory.availableQuantity }} 桶
          </el-tag>
        </div>
      </template>
      <el-form :model="claimForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="员工姓名">
              <el-input v-model="claimForm.employeeName" placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工编号">
              <el-input v-model="claimForm.employeeNo" placeholder="请输入员工编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门">
              <el-select v-model="claimForm.department" placeholder="请选择部门" style="width: 100%">
                <el-option label="技术部" value="技术部" />
                <el-option label="产品部" value="产品部" />
                <el-option label="市场部" value="市场部" />
                <el-option label="人力资源部" value="人力资源部" />
                <el-option label="财务部" value="财务部" />
                <el-option label="行政部" value="行政部" />
                <el-option label="运营部" value="运营部" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="申领数量">
              <el-input-number v-model="claimForm.quantity" :min="1" :max="inventory.availableQuantity || 100" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input v-model="claimForm.remark" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleClaim" :loading="loading">
            <el-icon><Check /></el-icon>
            提交申领
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>申领记录</span>
          <el-select v-model="selectedMonth" @change="loadClaims" size="small" style="width: 150px">
            <el-option v-for="m in months" :key="m.value" :label="m.label" :value="m.value" />
          </el-select>
        </div>
      </template>
      <el-table :data="claims" stripe>
        <el-table-column prop="employeeName" label="员工姓名" width="120" />
        <el-table-column prop="employeeNo" label="员工编号" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="quantity" label="数量(桶)" width="100" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="claimTime" label="申领时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getInventory } from '../api/inventory'
import { createClaim, getAllClaims, getClaimsByMonth } from '../api/claim'

const inventory = ref({})
const claims = ref([])
const loading = ref(false)

const claimForm = ref({
  employeeName: '',
  employeeNo: '',
  department: '',
  quantity: 1,
  remark: ''
})

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1

const months = computed(() => {
  const result = []
  for (let y = currentYear; y >= currentYear - 1; y--) {
    for (let m = 12; m >= 1; m--) {
      if (y === currentYear && m > currentMonth) continue
      result.push({
        label: `${y}年${m}月`,
        value: `${y}-${m}`
      })
    }
  }
  return result
})

const selectedMonth = ref(`${currentYear}-${currentMonth}`)

const loadInventory = async () => {
  const res = await getInventory()
  inventory.value = res.data
}

const loadClaims = async () => {
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const res = await getClaimsByMonth(year, month)
  claims.value = res.data
}

const handleClaim = async () => {
  if (!claimForm.value.employeeName || !claimForm.value.employeeNo) {
    ElMessage.warning('请填写员工姓名和编号')
    return
  }
  
  loading.value = true
  try {
    await createClaim(claimForm.value)
    ElMessage.success('申领成功')
    resetForm()
    await loadInventory()
    await loadClaims()
  } catch (error) {
    console.error('申领失败', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  claimForm.value = {
    employeeName: '',
    employeeNo: '',
    department: '',
    quantity: 1,
    remark: ''
  }
}

onMounted(() => {
  loadInventory()
  loadClaims()
})
</script>

<style scoped>
.claim h2 {
  margin-bottom: 20px;
  color: #333;
}

.claim-card,
.history-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #333;
}
</style>