<template>
  <div class="services-page">
    <el-card class="page-header" shadow="never">
      <div class="header-left">
        <h2 class="page-title">养护服务项目</h2>
        <p class="page-desc">专业绿植养护服务，让您的植物健康成长</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="showAddDialog = true">
        新增服务
      </el-button>
    </el-card>

    <el-row :gutter="20" class="service-grid">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="service in services" :key="service.id">
        <el-card class="service-card" shadow="hover">
          <div class="card-image">
            <img :src="service.image || defaultImage" :alt="service.name" />
            <el-tag v-if="service.status === 'active'" type="success" class="status-tag">上架中</el-tag>
            <el-tag v-else type="info" class="status-tag">已下架</el-tag>
          </div>
          <div class="card-content">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-desc">{{ service.description }}</p>
            <div class="service-info">
              <span class="price">¥{{ service.price }}</span>
              <span class="duration">{{ service.duration }}分钟</span>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" size="small" @click="handleBook(service)">
              立即预约
            </el-button>
            <el-button size="small" @click="handleEdit(service)">编辑</el-button>
            <el-button
              size="small"
              :type="service.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(service)"
            >
              {{ service.status === 'active' ? '下架' : '上架' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showAddDialog" :title="editingService ? '编辑服务' : '新增服务'" width="500px">
      <el-form :model="serviceForm" label-width="80px">
        <el-form-item label="服务名称">
          <el-input v-model="serviceForm.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="服务描述">
          <el-input v-model="serviceForm.description" type="textarea" :rows="3" placeholder="请输入服务描述" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="serviceForm.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="时长(分钟)">
          <el-input-number v-model="serviceForm.duration" :min="15" :step="15" />
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="serviceForm.image" placeholder="请输入图片URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showBookDialog" title="预约服务" width="500px">
      <div v-if="selectedService" class="book-info">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="服务名称">{{ selectedService.name }}</el-descriptions-item>
          <el-descriptions-item label="服务价格">¥{{ selectedService.price }}</el-descriptions-item>
          <el-descriptions-item label="服务时长">{{ selectedService.duration }}分钟</el-descriptions-item>
        </el-descriptions>
      </div>
      <el-form :model="bookForm" label-width="80px" class="book-form">
        <el-form-item label="您的姓名">
          <el-input v-model="bookForm.user_name" placeholder="请输入您的姓名" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="bookForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker v-model="bookForm.appointment_date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="预约时间">
          <el-time-picker v-model="bookForm.appointment_time" placeholder="选择时间" style="width: 100%" format="HH:mm" value-format="HH:mm" />
        </el-form-item>
        <el-form-item label="服务地址">
          <el-input v-model="bookForm.address" type="textarea" :rows="2" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="bookForm.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBookDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBook">确认预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { serviceApi, appointmentApi } from '../api'

const services = ref([])
const showAddDialog = ref(false)
const showBookDialog = ref(false)
const editingService = ref(null)
const selectedService = ref(null)
const defaultImage = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'

const serviceForm = ref({
  name: '',
  description: '',
  price: 0,
  duration: 60,
  image: ''
})

const bookForm = ref({
  user_name: '',
  phone: '',
  appointment_date: '',
  appointment_time: '',
  address: '',
  remark: ''
})

const fetchServices = async () => {
  try {
    const res = await serviceApi.getAll()
    services.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const handleEdit = (service) => {
  editingService.value = service
  serviceForm.value = { ...service }
  showAddDialog.value = true
}

const handleSave = async () => {
  if (!serviceForm.value.name) {
    ElMessage.warning('请输入服务名称')
    return
  }
  try {
    if (editingService.value) {
      await serviceApi.update(editingService.value.id, serviceForm.value)
      ElMessage.success('更新成功')
    } else {
      await serviceApi.create(serviceForm.value)
      ElMessage.success('创建成功')
    }
    showAddDialog.value = false
    editingService.value = null
    serviceForm.value = { name: '', description: '', price: 0, duration: 60, image: '' }
    fetchServices()
  } catch (err) {
    console.error(err)
  }
}

const handleToggleStatus = async (service) => {
  try {
    await ElMessageBox.confirm(
      `确定要${service.status === 'active' ? '下架' : '上架'}该服务吗？`,
      '提示',
      { type: 'warning' }
    )
    await serviceApi.update(service.id, { status: service.status === 'active' ? 'inactive' : 'active' })
    ElMessage.success('操作成功')
    fetchServices()
  } catch (err) {
    if (err !== 'cancel') console.error(err)
  }
}

const handleBook = (service) => {
  selectedService.value = service
  bookForm.value = {
    user_name: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    address: '',
    remark: ''
  }
  showBookDialog.value = true
}

const handleSubmitBook = async () => {
  if (!bookForm.value.user_name || !bookForm.value.phone || !bookForm.value.appointment_date || !bookForm.value.appointment_time || !bookForm.value.address) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await appointmentApi.create({
      ...bookForm.value,
      service_id: selectedService.value.id
    })
    ElMessage.success('预约成功')
    showBookDialog.value = false
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.services-page {
  padding: 0;
}

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

.service-grid {
  margin: 0;
}

.service-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-content {
  padding: 16px 0;
}

.service-name {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.service-desc {
  margin: 0 0 12px;
  color: #666;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #67C23A;
  font-size: 20px;
  font-weight: bold;
}

.duration {
  color: #999;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.book-info {
  margin-bottom: 20px;
}

.book-form {
  margin-top: 20px;
}
</style>
