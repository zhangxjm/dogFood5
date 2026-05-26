<template>
  <div class="page-container">
    <div class="page-header">
      <h2>搬家需求登记</h2>
      <el-button type="primary" @click="showDialog = true">
        <el-icon><Plus /></el-icon>
        新增需求
      </el-button>
    </div>

    <div class="card-container">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable @change="loadData">
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="requests" stripe v-loading="loading">
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="moveFrom" label="搬出地址" show-overflow-tooltip />
        <el-table-column prop="moveTo" label="搬入地址" show-overflow-tooltip />
        <el-table-column label="搬家日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.moveDate) }}
          </template>
        </el-table-column>
        <el-table-column label="楼层" width="100">
          <template #default="{ row }">
            {{ row.floorFrom }}楼 → {{ row.floorTo }}楼
            <el-tag v-if="row.hasElevator" type="success" size="small" style="margin-left: 4px;">有电梯</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="distance" label="距离(km)" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-tag', `status-${row.status}`]">
              {{ getStatusText(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="warning" link @click="handleEdit(row)" v-if="row.status !== 'completed'">编辑</el-button>
            <el-button type="success" link @click="handleComplete(row)" v-if="row.status !== 'completed'">完成</el-button>
            <el-button type="danger" link @click="handleDelete(row)" v-if="row.status === 'pending'">删除</el-button>
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

    <el-dialog v-model="showDialog" :title="isEdit ? '编辑需求' : '新增需求'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="搬出地址" prop="moveFrom">
          <el-input v-model="form.moveFrom" placeholder="请输入搬出地址" />
        </el-form-item>
        <el-form-item label="搬入地址" prop="moveTo">
          <el-input v-model="form.moveTo" placeholder="请输入搬入地址" />
        </el-form-item>
        <el-form-item label="搬家日期" prop="moveDate">
          <el-date-picker v-model="form.moveDate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="搬出楼层">
              <el-input-number v-model="form.floorFrom" :min="1" :max="50" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="搬入楼层">
              <el-input-number v-model="form.floorTo" :min="1" :max="50" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有电梯">
              <el-switch v-model="form.hasElevator" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="距离(km)">
          <el-input-number v-model="form.distance" :min="0" :precision="1" :step="0.5" />
        </el-form-item>
        <el-form-item label="物品描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请描述需要搬运的物品" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDetail" title="需求详情" width="600px">
      <el-descriptions :column="2" border v-if="currentRequest">
        <el-descriptions-item label="客户姓名">{{ currentRequest.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRequest.phone }}</el-descriptions-item>
        <el-descriptions-item label="搬出地址" :span="2">{{ currentRequest.moveFrom }}</el-descriptions-item>
        <el-descriptions-item label="搬入地址" :span="2">{{ currentRequest.moveTo }}</el-descriptions-item>
        <el-descriptions-item label="搬家日期">{{ formatDate(currentRequest.moveDate) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <span :class="['status-tag', `status-${currentRequest.status}`]">
            {{ getStatusText(currentRequest.status) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="搬出楼层">{{ currentRequest.floorFrom }}楼</el-descriptions-item>
        <el-descriptions-item label="搬入楼层">{{ currentRequest.floorTo }}楼</el-descriptions-item>
        <el-descriptions-item label="有电梯">{{ currentRequest.hasElevator ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="距离">{{ currentRequest.distance }} km</el-descriptions-item>
        <el-descriptions-item label="物品描述" :span="2">{{ currentRequest.description || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="showDetail = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMoveRequests, createMoveRequest, updateMoveRequest, deleteMoveRequest } from '../api'

const loading = ref(false)
const requests = ref([])
const showDialog = ref(false)
const showDetail = ref(false)
const isEdit = ref(false)
const currentRequest = ref(null)
const formRef = ref(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const filterForm = reactive({
  status: ''
})

const form = reactive({
  id: null,
  customerName: '',
  phone: '',
  moveFrom: '',
  moveTo: '',
  moveDate: '',
  floorFrom: 1,
  floorTo: 1,
  hasElevator: false,
  distance: 0,
  description: ''
})

const rules = {
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  moveFrom: [{ required: true, message: '请输入搬出地址', trigger: 'blur' }],
  moveTo: [{ required: true, message: '请输入搬入地址', trigger: 'blur' }],
  moveDate: [{ required: true, message: '请选择搬家日期', trigger: 'change' }]
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const getStatusText = (status) => {
  const map = {
    pending: '待处理',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getMoveRequests({
      status: filterForm.status || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    requests.value = res.data.list || []
    pagination.total = res.data.total || 0
  } catch (error) {
    console.error('Failed to load requests:', error)
  } finally {
    loading.value = false
  }
}

const resetFilter = () => {
  filterForm.status = ''
  pagination.page = 1
  loadData()
}

const resetForm = () => {
  form.id = null
  form.customerName = ''
  form.phone = ''
  form.moveFrom = ''
  form.moveTo = ''
  form.moveDate = ''
  form.floorFrom = 1
  form.floorTo = 1
  form.hasElevator = false
  form.distance = 0
  form.description = ''
}

const handleView = (row) => {
  currentRequest.value = row
  showDetail.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  form.moveDate = new Date(row.moveDate)
  showDialog.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条需求吗？', '提示', { type: 'warning' })
    await deleteMoveRequest(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete request:', error)
    }
  }
}

const handleComplete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要将此需求标记为完成吗？', '提示', { type: 'warning' })
    await updateMoveRequest(row.id, { status: 'completed' })
    ElMessage.success('操作成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to complete request:', error)
    }
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await updateMoveRequest(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createMoveRequest(form)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    resetForm()
    loadData()
  } catch (error) {
    if (error !== false) {
      console.error('Failed to submit:', error)
    }
  }
}

watch(showDialog, (val) => {
  if (!val && !isEdit.value) {
    resetForm()
  }
  if (val && !isEdit.value) {
    resetForm()
  }
})

onMounted(loadData)
</script>

<style scoped>
.filter-form {
  margin-bottom: 20px;
}

.card-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
