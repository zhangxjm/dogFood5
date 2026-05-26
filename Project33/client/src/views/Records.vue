<template>
  <div class="records-page">
    <el-card class="page-header" shadow="never">
      <div class="header-left">
        <h2 class="page-title">服务记录</h2>
        <p class="page-desc">查看所有已完成的服务记录</p>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-table :data="records" v-loading="loading" stripe>
        <el-table-column prop="id" label="记录ID" width="80" />
        <el-table-column prop="service_name" label="服务项目" min-width="120" />
        <el-table-column prop="user_name" label="客户姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column label="预约时间" width="160">
          <template #default="{ row }">
            {{ row.appointment_date }} {{ row.appointment_time }}
          </template>
        </el-table-column>
        <el-table-column label="实际开始" width="160">
          <template #default="{ row }">
            {{ row.actual_start_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="实际结束" width="160">
          <template #default="{ row }">
            {{ row.actual_end_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="service_content" label="服务内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="address" label="服务地址" min-width="160" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { recordApi } from '../api'

const records = ref([])
const loading = ref(false)

const fetchRecords = async () => {
  loading.value = true
  try {
    const res = await recordApi.getAll()
    records.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.page-desc {
  margin: 4px 0 0;
  color: #999;
  font-size: 14px;
}
</style>
