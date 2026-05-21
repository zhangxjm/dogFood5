<template>
  <div>
    <el-card>
      <template #header>
        <span>部门申领统计</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>文具库存概况</span>
              </div>
            </template>
            <div style="text-align: center">
              <div style="font-size: 48px; color: #409eff; font-weight: bold">{{ totalItems }}</div>
              <div style="color: #909399; margin-top: 10px">文具种类总数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>采购订单数</span>
              </div>
            </template>
            <div style="text-align: center">
              <div style="font-size: 48px; color: #67c23a; font-weight: bold">{{ totalOrders }}</div>
              <div style="color: #909399; margin-top: 10px">总订单数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>申领记录</span>
              </div>
            </template>
            <div style="text-align: center">
              <div style="font-size: 48px; color: #e6a23c; font-weight: bold">{{ totalClaims }}</div>
              <div style="color: #909399; margin-top: 10px">总申领次数</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <h4 style="margin-bottom: 20px">各部门申领数量统计</h4>
      <el-table :data="deptStats" border style="width: 100%">
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="totalQuantity" label="总申领数量" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const totalItems = ref(0)
const totalOrders = ref(0)
const totalClaims = ref(0)
const deptStats = ref([])
const departments = ref([])

const fetchData = async () => {
  const itemsRes = await request.get('/item/list')
  totalItems.value = itemsRes.data.length

  const ordersRes = await request.get('/order/list')
  totalOrders.value = ordersRes.data.length

  const claimsRes = await request.get('/claim/list')
  totalClaims.value = claimsRes.data.length

  const statsRes = await request.get('/claim/statistics')
  const deptsRes = await request.get('/department/list')
  departments.value = deptsRes.data

  deptStats.value = statsRes.data.map(item => {
    const dept = departments.value.find(d => d.id === item.deptId)
    return {
      deptName: dept ? dept.deptName : '未知部门',
      totalQuantity: item.totalQuantity
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
