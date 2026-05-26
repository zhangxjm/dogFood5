<template>
  <div class="page">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span class="title">玩家游玩记录</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增记录
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="sessionId" label="场次" align="center">
          <template #default="{ row }">
            <el-tag type="info">{{ sessionMap[row.sessionId] || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="playerName" label="玩家姓名" align="center" width="120" />
        <el-table-column prop="phone" label="联系电话" align="center" width="140" />
        <el-table-column prop="roleName" label="角色名称" align="center" width="120" />
        <el-table-column prop="score" label="评分" align="center" width="120">
          <template #default="{ row }">
            <el-rate v-model="row.score" disabled max="10" show-score />
          </template>
        </el-table-column>
        <el-table-column prop="comments" label="评价" align="center" show-overflow-tooltip />
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
        <el-form-item label="选择场次" prop="sessionId" :rules="[{ required: true, message: '请选择场次', trigger: 'change' }]">
          <el-select v-model="form.sessionId" placeholder="请选择场次" style="width: 100%">
            <el-option v-for="s in sessions" :key="s.id" :label="s.sessionName" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="玩家姓名" prop="playerName" :rules="[{ required: true, message: '请输入玩家姓名', trigger: 'blur' }]">
              <el-input v-model="form.playerName" placeholder="请输入玩家姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分">
              <el-rate v-model="form.score" max="10" show-score />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评价">
          <el-input v-model="form.comments" type="textarea" :rows="3" placeholder="请输入评价" />
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
import { getPlayerRecordList, addPlayerRecord, updatePlayerRecord, deletePlayerRecord, getSessionRecordList } from '../api'

const tableData = ref([])
const sessions = ref([])
const sessionMap = reactive({})
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)
const form = ref({
  id: null, sessionId: null, playerName: '', phone: '',
  roleName: '', score: 0, comments: ''
})

const loadData = async () => {
  tableData.value = await getPlayerRecordList()
  sessions.value = await getSessionRecordList()
  sessions.value.forEach(s => { sessionMap[s.id] = s.sessionName })
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增玩家记录'
  form.value = {
    id: null, sessionId: null, playerName: '', phone: '',
    roleName: '', score: 0, comments: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑玩家记录'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (isEdit.value) {
    await updatePlayerRecord(form.value)
    ElMessage.success('更新成功')
  } else {
    await addPlayerRecord(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该记录吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deletePlayerRecord(row.id)
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
