<template>
  <div class="page">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span class="title">场次开本记录</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增场次
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="sessionName" label="场次名称" align="center" />
        <el-table-column prop="scriptId" label="剧本" align="center">
          <template #default="{ row }">
            <el-tag type="info">{{ scriptMap[row.scriptId] || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hostName" label="主持人" align="center" width="100" />
        <el-table-column prop="startTime" label="开始时间" align="center" width="160" />
        <el-table-column prop="endTime" label="结束时间" align="center" width="160" />
        <el-table-column prop="playerCount" label="玩家数" align="center" width="90" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" width="180" />
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item label="场次名称" prop="sessionName" :rules="[{ required: true, message: '请输入场次名称', trigger: 'blur' }]">
          <el-input v-model="form.sessionName" placeholder="请输入场次名称" />
        </el-form-item>
        <el-form-item label="选择剧本" prop="scriptId" :rules="[{ required: true, message: '请选择剧本', trigger: 'change' }]">
          <el-select v-model="form.scriptId" placeholder="请选择剧本" style="width: 100%">
            <el-option v-for="s in scripts" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主持人">
              <el-input v-model="form.hostName" placeholder="请输入主持人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="玩家数">
              <el-input-number v-model="form.playerCount" :min="1" :max="20" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已完成" :value="2" />
            <el-option label="已取消" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSessionRecordList, addSessionRecord, updateSessionRecord, deleteSessionRecord, getScriptInventoryList } from '../api'

const tableData = ref([])
const scripts = ref([])
const scriptMap = reactive({})
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)
const form = ref({
  id: null, scriptId: null, sessionName: '', hostName: '',
  startTime: '', endTime: '', playerCount: 0, status: 0, remarks: ''
})

const statusText = (s) => ['未开始', '进行中', '已完成', '已取消'][s] || '未知'
const statusType = (s) => ['info', 'warning', 'success', 'danger'][s] || 'info'

const loadData = async () => {
  tableData.value = await getSessionRecordList()
  scripts.value = await getScriptInventoryList()
  scripts.value.forEach(s => { scriptMap[s.id] = s.name })
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增场次'
  form.value = {
    id: null, scriptId: null, sessionName: '', hostName: '',
    startTime: '', endTime: '', playerCount: 0, status: 0, remarks: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑场次'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (isEdit.value) {
    await updateSessionRecord(form.value)
    ElMessage.success('更新成功')
  } else {
    await addSessionRecord(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该场次吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteSessionRecord(row.id)
      ElMessage.success('删除成功')
      loadData()
    }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 16px; font-weight: 600; }
</style>
