<template>
  <div class="reviews-page">
    <el-page-header content="服务评价" class="page-header" />
    
    <el-button type="primary" class="add-review-btn" @click="openReviewDialog">
      <el-icon><Plus /></el-icon>
      发表评价
    </el-button>

    <el-card v-for="review in reviews" :key="review.id" class="review-card" shadow="hover">
      <div class="review-header">
        <div class="review-info">
          <span class="service-name">{{ review.appointment?.service?.name }}</span>
          <el-rate v-model="review.rating" disabled show-score />
        </div>
        <span class="review-date">{{ formatDate(review.created_at) }}</span>
      </div>
      <div class="review-content" v-if="review.content">
        {{ review.content }}
      </div>
      <div class="review-footer">
        <span class="customer-info">
          <el-icon><User /></el-icon>
          {{ review.appointment?.customer_name }}
        </span>
      </div>
    </el-card>

    <el-empty v-if="reviews.length === 0" description="暂无评价" />

    <el-dialog v-model="reviewDialogVisible" title="发表服务评价" width="500px">
      <el-form :model="reviewForm" label-width="100px">
        <el-form-item label="选择预约" prop="appointment_id">
          <el-select v-model="reviewForm.appointment_id" placeholder="请选择已完成的预约" style="width: 100%">
            <el-option 
              v-for="apt in completedAppointments" 
              :key="apt.id" 
              :label="`${apt.service?.name} - ${apt.appointment_date}`"
              :value="apt.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="reviewForm.rating" show-score />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input v-model="reviewForm.content" type="textarea" :rows="4" placeholder="请分享您的服务体验" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview" :loading="submitting">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reviewApi, appointmentApi } from '../api'
import dayjs from 'dayjs'

const reviews = ref([])
const completedAppointments = ref([])
const reviewDialogVisible = ref(false)
const submitting = ref(false)

const reviewForm = ref({
  appointment_id: '',
  rating: 5,
  content: ''
})

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD HH:mm')

const loadReviews = async () => {
  try {
    const res = await reviewApi.getReviews()
    if (res.code === 200) {
      reviews.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载评价失败')
  }
}

const loadCompletedAppointments = async () => {
  try {
    const res = await appointmentApi.getAppointments()
    if (res.code === 200) {
      const reviewedIds = reviews.value.map(r => r.appointment_id)
      completedAppointments.value = res.data.filter(apt => 
        apt.status === 3 && !reviewedIds.includes(apt.id)
      )
    }
  } catch (error) {
    ElMessage.error('加载预约记录失败')
  }
}

const openReviewDialog = async () => {
  await loadCompletedAppointments()
  if (completedAppointments.value.length === 0) {
    ElMessage.warning('暂无已完成且未评价的服务')
    return
  }
  reviewForm.value = {
    appointment_id: completedAppointments.value[0]?.id || '',
    rating: 5,
    content: ''
  }
  reviewDialogVisible.value = true
}

const submitReview = async () => {
  if (!reviewForm.value.appointment_id) {
    ElMessage.warning('请选择预约记录')
    return
  }
  
  submitting.value = true
  try {
    const res = await reviewApi.createReview(reviewForm.value)
    if (res.code === 200) {
      ElMessage.success('评价提交成功')
      reviewDialogVisible.value = false
      loadReviews()
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadReviews()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.add-review-btn {
  margin-bottom: 20px;
}

.review-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.review-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.review-date {
  color: #999;
  font-size: 14px;
}

.review-content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #888;
  font-size: 14px;
}
</style>
