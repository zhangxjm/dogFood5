<template>
  <div class="page-container">
    <div class="page-header">
      <h2>服务评分录入</h2>
      <el-button type="primary" @click="showDialog = true">
        <el-icon><Plus /></el-icon>
        新增评分
      </el-button>
    </div>

    <div class="card-container">
      <el-table :data="ratings" stripe v-loading="loading">
        <el-table-column prop="id" label="评分ID" width="80" />
        <el-table-column label="客户姓名" width="120">
          <template #default="{ row }">
            {{ row.request?.customerName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="使用车型" width="120">
          <template #default="{ row }">
            {{ row.record?.vehicle?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="服务态度" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.serviceRating" disabled />
          </template>
        </el-table-column>
        <el-table-column label="准时度" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.timelinessRating" disabled />
          </template>
        </el-table-column>
        <el-table-column label="物品爱护" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.careRating" disabled />
          </template>
        </el-table-column>
        <el-table-column label="综合评分" width="140">
          <template #default="{ row }">
            <el-rate :model-value="row.overallRating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="评语" show-overflow-tooltip />
        <el-table-column label="评价时间" width="170">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </div>

    <el-dialog v-model="showDialog" title="新增服务评分" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="选择记录" prop="recordId">
          <el-select v-model="form.recordId" placeholder="请选择搬家记录" filterable style="width: 100%;" @change="handleRecordChange">
            <el-option
              v-for="rec in availableRecords"
              :key="rec.id"
              :label="`${rec.request?.customerName} - ${rec.vehicle?.name} - ¥${rec.totalAmount}`"
              :value="rec.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评价人姓名">
          <el-input v-model="form.reviewerName" placeholder="请输入评价人姓名" />
        </el-form-item>
        <el-form-item label="服务态度" prop="serviceRating" required>
          <el-rate v-model="form.serviceRating" />
        </el-form-item>
        <el-form-item label="准时度" prop="timelinessRating" required>
          <el-rate v-model="form.timelinessRating" />
        </el-form-item>
        <el-form-item label="物品爱护" prop="careRating" required>
          <el-rate v-model="form.careRating" />
        </el-form-item>
        <el-form-item label="综合评分" prop="overallRating" required>
          <el-rate v-model="form.overallRating" show-score text-color="#ff9900" />
        </el-form-item>
        <el-form-item label="评语">
          <el-input v-model="form.comment" type="textarea" :rows="3" placeholder="请输入评语" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRatings, createRating, getMoveRecords } from '../api'

const loading = ref(false)
const ratings = ref([])
const availableRecords = ref([])
const showDialog = ref(false)
const formRef = ref(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const form = reactive({
  recordId: null,
  requestId: null,
  overallRating: 5,
  serviceRating: 5,
  timelinessRating: 5,
  careRating: 5,
  comment: '',
  reviewerName: ''
})

const rules = {
  recordId: [{ required: true, message: '请选择记录', trigger: 'change' }],
  serviceRating: [{ required: true, message: '请选择服务态度评分', trigger: 'change' }],
  timelinessRating: [{ required: true, message: '请选择准时度评分', trigger: 'change' }],
  careRating: [{ required: true, message: '请选择物品爱护评分', trigger: 'change' }],
  overallRating: [{ required: true, message: '请选择综合评分', trigger: 'change' }]
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadData = async () => {
  loading.value = true
  try {
    const [ratingsRes, recordsRes] = await Promise.all([
      getRatings({ page: pagination.page, pageSize: pagination.pageSize }),
      getMoveRecords({ pageSize: 100 })
    ])
    ratings.value = ratingsRes.data.list || []
    pagination.total = ratingsRes.data.total || 0
    availableRecords.value = (recordsRes.data.list || []).filter(rec => !rec.rating)
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const handleRecordChange = (recordId) => {
  const record = availableRecords.value.find(r => r.id === recordId)
  if (record) {
    form.requestId = record.requestId
  }
}

const resetForm = () => {
  form.recordId = null
  form.requestId = null
  form.overallRating = 5
  form.serviceRating = 5
  form.timelinessRating = 5
  form.careRating = 5
  form.comment = ''
  form.reviewerName = ''
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    await createRating(form)
    ElMessage.success('评分成功')
    showDialog.value = false
    resetForm()
    loadData()
  } catch (error) {
    if (error !== false) {
      console.error('Failed to submit:', error)
    }
  }
}

onMounted(loadData)
</script>

<style scoped>
.card-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
