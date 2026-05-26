<template>
  <div>
    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :span="12">
        <a-card title="即将过期 (30天内)">
          <a-table
            :columns="expiringColumns"
            :data-source="expiringProducts"
            :loading="loading"
            row-key="_id"
            :pagination="false"
            size="small"
            :scroll="{ x: 800 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'category'">
                {{ record.categoryId?.name || '-' }}
              </template>
              <template v-if="column.key === 'expiryDate'">
                <div>{{ formatDate(record.expiryDate) }}</div>
                <a-tag color="orange">{{ getDaysLeft(record.expiryDate) }}天</a-tag>
              </template>
              <template v-if="column.key === 'stock'">
                <a-tag color="blue">{{ record.stock }}件</a-tag>
              </template>
            </template>
          </a-table>
          <a-empty v-if="!loading && expiringProducts.length === 0" description="暂无即将过期商品" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="已过期商品">
          <a-table
            :columns="expiredColumns"
            :data-source="expiredProducts"
            :loading="loading"
            row-key="_id"
            :pagination="false"
            size="small"
            :scroll="{ x: 800 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'category'">
                {{ record.categoryId?.name || '-' }}
              </template>
              <template v-if="column.key === 'expiryDate'">
                <div>{{ formatDate(record.expiryDate) }}</div>
                <a-tag color="red">已过期{{ Math.abs(getDaysLeft(record.expiryDate)) }}天</a-tag>
              </template>
              <template v-if="column.key === 'stock'">
                <a-tag color="blue">{{ record.stock }}件</a-tag>
              </template>
            </template>
          </a-table>
          <a-empty v-if="!loading && expiredProducts.length === 0" description="暂无已过期商品" />
        </a-card>
      </a-col>
    </a-row>

    <a-alert
      type="warning"
      show-icon
      :message="'提示：建议及时处理临期和过期商品，避免损失'"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productApi } from '../services/api'
import dayjs from 'dayjs'

const loading = ref(false)
const expiringProducts = ref([])
const expiredProducts = ref([])

const expiringColumns = [
  { title: '商品名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '品类', key: 'category', width: 80 },
  { title: '库存', key: 'stock', width: 80 },
  { title: '过期日期', key: 'expiryDate', width: 200 }
]

const expiredColumns = [
  { title: '商品名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '品类', key: 'category', width: 80 },
  { title: '库存', key: 'stock', width: 80 },
  { title: '过期日期', key: 'expiryDate', width: 200 }
]

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const getDaysLeft = (date) => {
  return dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day')
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await productApi.getExpiryAlert()
    if (res.success) {
      expiringProducts.value = res.data.expiringSoon
      expiredProducts.value = res.data.expired
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
