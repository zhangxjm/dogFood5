<template>
  <div>
    <div class="page-title">滞销商品统计</div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="统计天数">
          <el-select v-model="searchForm.days" style="width: 150px">
            <el-option :label="7天" :value="7" />
            <el-option :label="30天" :value="30" />
            <el-option :label="90天" :value="90" />
          </el-select>
        </el-form-item>
        <el-form-item label="最小销量">
          <el-input-number v-model="searchForm.minQuantity" :min="0" style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="productId" label="商品ID" width="100" />
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="saleQuantity" label="销量" width="120">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.saleQuantity }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="120">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <el-tag type="warning">滞销</el-tag>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const tableData = ref([])

const searchForm = ref({
  days: 30,
  minQuantity: 10
})

const fetchData = async () => {
  const res = await request.get('/dashboard/unsalable', {
    params: searchForm.value
  })
  tableData.value = res.data
}

onMounted(() => {
  fetchData()
})
</script>
