<template>
  <div>
    <div class="page-title">数据概览</div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="dashboard-card">
          <div class="label">商品总数</div>
          <div class="number">{{ dashboardData.productCount || 0 }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="dashboard-card">
          <div class="label">总销售量</div>
          <div class="number">{{ dashboardData.totalSaleQuantity || 0 }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="dashboard-card">
          <div class="label">滞销商品数</div>
          <div class="number">{{ dashboardData.unsalableCount || 0 }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const dashboardData = ref({})

const fetchData = async () => {
  const res = await request.get('/dashboard/data')
  dashboardData.value = res.data
}

onMounted(() => {
  fetchData()
})
</script>
