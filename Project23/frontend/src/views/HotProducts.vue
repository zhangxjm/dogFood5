<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>热销商品统计</h2>
      <el-input-number v-model="limit" :min="5" :max="20" @change="loadHotProducts" placeholder="显示数量" />
    </div>

    <el-card shadow="never" v-if="hotProducts.length > 0">
      <el-table :data="hotProducts" border stripe>
        <el-table-column label="排名" width="80" type="index">
          <template #default="{ $index }">
            <el-tag v-if="$index === 0" type="danger" effect="dark">🥇 第1</el-tag>
            <el-tag v-else-if="$index === 1" type="warning" effect="dark">🥈 第2</el-tag>
            <el-tag v-else-if="$index === 2" type="success" effect="dark">🥉 第3</el-tag>
            <span v-else>第{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="200" />
        <el-table-column prop="totalSold" label="销售数量" width="150">
          <template #default="{ row }">
            <span style="color: #409EFF; font-weight: bold;">{{ row.totalSold || 0 }}</span> 件
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120">
          <template #default="{ row }">
            ¥{{ parseFloat(row.price).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalRevenue" label="销售额" width="150">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold;">¥{{ parseFloat(row.totalRevenue || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售热度">
          <template #default="{ row }">
            <el-progress 
              :percentage="getPercentage(row.totalSold)" 
              :color="getColor($index)"
              :stroke-width="12"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-empty v-else description="暂无销售数据" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { productApi } from '../api'

const hotProducts = ref([])
const limit = ref(10)

const maxSold = computed(() => {
  if (hotProducts.value.length === 0) return 1
  return Math.max(...hotProducts.value.map(p => p.totalSold || 0))
})

const getPercentage = (sold) => {
  if (maxSold.value === 0) return 0
  return Math.round((sold || 0) / maxSold.value * 100)
}

const getColor = (index) => {
  const colors = ['#f56c6c', '#e6a23c', '#67c23a', '#409eff', '#909399']
  return colors[index] || colors[4]
}

const loadHotProducts = async () => {
  try {
    const res = await productApi.getHot(limit.value)
    hotProducts.value = res.data
  } catch (error) {
    console.error('加载热销商品失败')
  }
}

onMounted(() => {
  loadHotProducts()
})
</script>
