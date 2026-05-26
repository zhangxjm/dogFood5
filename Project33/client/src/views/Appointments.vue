<template>
  <div class="appointments-page">
    <el-card class="page-header" shadow="never">
      <div class="header-left">
        <h2 class="page-title">预约管理</h2>
        <p class="page-desc">管理所有服务预约订单</p>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable @change="fetchAppointments">
            <el-option label="待服务" value="pending" />
            <el-option label="服务中" value="in_progress" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table :data="appointments" v-loading="loading" stripe>
        <el-table-column prop="id" label="订单号" width="80" />
        <el-table-column prop="service_name" label="服务项目" min-width="120" />
        <el-table-column prop="user_name" label="客户姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column label="预约时间" width="160">
          <template #default="{ row }">
            {{ row.appointment_date }} {{ row.appointment_time }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="服务地址" min-width="160" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">详情</el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="success"
              size="small"
              @click="handleComplete(row)"
            >
              完成服务
            </el-button>
            <el-button
              v-if="row.status === 'completed' && !row.has_review"
              type="warning"
              size="small"
              @click="handleReview(row)"
            >
              评价
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDetailDialog" title="预约详情" width="600px">
      <el-descriptions v-if="currentAppointment" :column="2" border>
        <el-descriptions-item label="订单号">{{ currentAppointment.id }}</el-descriptions-item>
        <el-descriptions-item label="服务项目">{{ currentAppointment.service_name }}</el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ currentAppointment.user_name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentAppointment.phone }}</el-descriptions-item>
        <el-descriptions-item label="预约日期">{{ currentAppointment.appointment_date }}</el-descriptions-item>
        <el-descriptions-item label="预约时间">{{ currentAppointment.appointment_time }}</el-descriptions-item>
        <el-descriptions-item label="服务地址" :span="2">{{ currentAppointment.address }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentAppointment.remark || '无' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType(currentAppointment.status)">{{ statusText(currentAppointment.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentAppointment.created_at }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="showCompleteDialog" title="完成服务" width="500px">
      <el-form :model="completeForm" label-width="100px">
        <el-form-item label="实际开始时间">
          <el-date-picker
            v-model="completeForm.actual_start_time"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="实际结束时间">
          <el-date-picker
            v-model="completeForm.actual_end_time"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="服务内容">
          <el-input v-model="completeForm.service_content" type="textarea" :rows="4" placeholder="请输入服务内容描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCompleteDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitComplete">确认完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showReviewDialog" title="服务评价" width="500px">
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item label="评分">
          <el-rate v-model="reviewForm.rating" :max="5" />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="reviewForm.content" type="textarea" :rows="4" placeholder="请输入您的评价" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReviewDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReview">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { appointmentApi, reviewApi } from '../api'

const appointments = ref([])
const loading = ref(false)
const filterStatus = ref('')
const showDetailDialog = ref(false)
const showCompleteDialog = ref(false)
const showReviewDialog = ref(false)
const currentAppointment = ref(null)
const currentAppointmentId = ref(null)

const completeForm = ref({
  actual_start_time: '',
  actual_end_time: '',
  service_content: ''
})

const reviewForm = ref({
  rating: 5,
  content: ''
})

const statusType = (status) => {
  const map = {
    pending: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = {
    pending: '待服务',
    in_progress: '服务中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const fetchAppointments = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterStatus.value) params.status = filterStatus.value
    const res = await appointmentApi.getAll(params)
    appointments.value = res.data
    for (const apt of appointments.value) {
      try {
        await reviewApi.getByAppointmentId(apt.id)
        apt.has_review = true
      } catch {
        apt.has_review = false
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleView = (row) => {
  currentAppointment.value = row
  showDetailDialog.value = true
}

const handleComplete = (row) => {
  currentAppointmentId.value = row.id
  completeForm.value = {
    actual_start_time: '',
    actual_end_time: '',
    service_content: ''
  }
  showCompleteDialog.value = true
}

const handleSubmitComplete = async () => {
  try {
    await appointmentApi.complete(currentAppointmentId.value, completeForm.value)
    ElMessage.success('服务已完成')
    showCompleteDialog.value = false
    fetchAppointments()
  } catch (err) {
    console.error(err)
  }
}

const handleReview = (row) => {
  currentAppointmentId.value = row.id
  reviewForm.value = {
    rating: 5,
    content: ''
  }
  showReviewDialog.value = true
}

const handleSubmitReview = async () => {
  if (!reviewForm.value.rating) {
    ElMessage.warning('请选择评分')
    return
  }
  try {
    const apt = appointments.value.find(a => a.id === currentAppointmentId.value)
    await reviewApi.create({
      appointment_id: currentAppointmentId.value,
      service_id: apt.service_id,
      user_id: apt.user_id,
      ...reviewForm.value
    })
    ElMessage.success('评价提交成功')
    showReviewDialog.value = false
    fetchAppointments()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchAppointments()
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

.filter-form {
  margin-bottom: 16px;
}
</style>
