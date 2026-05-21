<template>
  <div class="appointments-page">
    <el-page-header content="我的预约" class="page-header" />
    
    <el-table :data="appointments" v-loading="loading" class="appointment-table">
      <el-table-column prop="id" label="订单号" width="100" />
      <el-table-column label="服务项目" width="200">
        <template #default="{ row }">
          {{ row.service?.name }}
        </template>
      </el-table-column>
      <el-table-column prop="customer_name" label="联系人" width="120" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="address" label="服务地址" min-width="200" show-overflow-tooltip />
      <el-table-column prop="appointment_date" label="预约日期" width="120" />
      <el-table-column prop="appointment_time" label="预约时段" width="150" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 0" type="primary" size="small" @click="updateStatus(row.id, 1)">
            确认
          </el-button>
          <el-button v-if="row.status === 1" type="warning" size="small" @click="updateStatus(row.id, 2)">
            开始服务
          </el-button>
          <el-button v-if="row.status === 2" type="success" size="small" @click="updateStatus(row.id, 3)">
            完成服务
          </el-button>
          <el-button v-if="row.status < 3" type="danger" size="small" @click="updateStatus(row.id, 4)">
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && appointments.length === 0" description="暂无预约记录" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { appointmentApi } from '../api'

const appointments = ref([])
const loading = ref(false)

const statusMap = {
  0: { text: '待确认', type: 'info' },
  1: { text: '已确认', type: 'primary' },
  2: { text: '进行中', type: 'warning' },
  3: { text: '已完成', type: 'success' },
  4: { text: '已取消', type: 'danger' }
}

const getStatusText = (status) => statusMap[status]?.text || '未知'
const getStatusType = (status) => statusMap[status]?.type || 'info'

const loadAppointments = async () => {
  loading.value = true
  try {
    const res = await appointmentApi.getAppointments()
    if (res.code === 200) {
      appointments.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载预约记录失败')
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status) => {
  const actionText = statusMap[status]?.text
  try {
    await ElMessageBox.confirm(`确定要${actionText}此预约吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const res = await appointmentApi.updateStatus(id, status)
    if (res.code === 200) {
      ElMessage.success(`操作成功`)
      loadAppointments()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.appointment-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
</style>
