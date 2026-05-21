<template>
  <div class="services-page">
    <el-page-header content="绿植养护服务" class="page-header" />
    
    <el-row :gutter="24" class="service-list">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="service in services" :key="service.id">
        <el-card class="service-card" shadow="hover">
          <img :src="service.image || defaultImage" class="service-image" />
          <div class="service-content">
            <h3>{{ service.name }}</h3>
            <p class="description">{{ service.description }}</p>
            <div class="service-meta">
              <span class="duration">
                <el-icon><Timer /></el-icon>
                {{ service.duration || '待定' }}
              </span>
              <span class="price">¥{{ service.price }}</span>
            </div>
            <el-button type="success" class="book-btn" @click="openBookDialog(service)">
              立即预约
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="bookDialogVisible" title="预约服务" width="500px">
      <el-form :model="bookForm" label-width="100px">
        <el-form-item label="服务项目">
          <el-input v-model="selectedService?.name" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="customer_name">
          <el-input v-model="bookForm.customer_name" placeholder="请输入您的姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="bookForm.phone" placeholder="请输入您的手机号" />
        </el-form-item>
        <el-form-item label="服务地址" prop="address">
          <el-input v-model="bookForm.address" type="textarea" :rows="2" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="预约日期" prop="appointment_date">
          <el-date-picker v-model="bookForm.appointment_date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="预约时段" prop="appointment_time">
          <el-select v-model="bookForm.appointment_time" placeholder="选择时段" style="width: 100%">
            <el-option label="上午 09:00-11:00" value="上午 09:00-11:00" />
            <el-option label="下午 14:00-16:00" value="下午 14:00-16:00" />
            <el-option label="傍晚 16:00-18:00" value="傍晚 16:00-18:00" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="bookForm.remark" type="textarea" :rows="2" placeholder="特殊要求备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bookDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBooking" :loading="submitting">确认预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { serviceApi, appointmentApi } from '../api'
import dayjs from 'dayjs'

const services = ref([])
const bookDialogVisible = ref(false)
const selectedService = ref(null)
const submitting = ref(false)
const defaultImage = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'

const bookForm = ref({
  customer_name: '',
  phone: '',
  address: '',
  appointment_date: '',
  appointment_time: '',
  remark: ''
})

const loadServices = async () => {
  try {
    const res = await serviceApi.getServices()
    if (res.code === 200) {
      services.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载服务失败')
  }
}

const openBookDialog = (service) => {
  selectedService.value = service
  bookForm.value = {
    customer_name: '',
    phone: '',
    address: '',
    appointment_date: '',
    appointment_time: '',
    remark: ''
  }
  bookDialogVisible.value = true
}

const submitBooking = async () => {
  if (!bookForm.value.customer_name || !bookForm.value.phone || !bookForm.value.address || 
      !bookForm.value.appointment_date || !bookForm.value.appointment_time) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  submitting.value = true
  try {
    const res = await appointmentApi.createAppointment({
      service_id: selectedService.value.id,
      ...bookForm.value,
      appointment_date: dayjs(bookForm.value.appointment_date).format('YYYY-MM-DD')
    })
    if (res.code === 200) {
      ElMessage.success('预约成功！我们会尽快与您联系确认')
      bookDialogVisible.value = false
    }
  } catch (error) {
    ElMessage.error('预约失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadServices()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.service-list {
  margin-top: 20px;
}

.service-card {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
}

.service-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.service-content {
  padding: 20px 0;
}

.service-content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  min-height: 40px;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.duration {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #888;
  font-size: 14px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
}

.book-btn {
  width: 100%;
}
</style>
