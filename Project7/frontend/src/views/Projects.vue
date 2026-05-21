<template>
  <div class="projects">
    <div class="page-header">
      <h3>项目列表</h3>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>新建项目
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="8" v-for="project in projects" :key="project.id">
        <el-card class="project-card" shadow="hover">
          <template #header>
            <div class="project-header">
              <span class="project-name">{{ project.name }}</span>
              <el-dropdown @command="(cmd) => handleCommand(cmd, project)">
                <el-icon class="more-btn"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="view">查看详情</el-dropdown-item>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div class="project-description">{{ project.description || '暂无描述' }}</div>
          <div class="project-status">
            <el-tag :type="getStatusType(project.status)">{{ getStatusText(project.status) }}</el-tag>
          </div>
          <div class="project-footer">
            <span class="owner">
              <el-icon><User /></el-icon>
              {{ project.owner?.username || '-' }}
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑项目' : '新建项目'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入项目描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="规划中" value="PLANNING" />
            <el-option label="进行中" value="IN_PROGRESS" />
            <el-option label="暂停" value="ON_HOLD" />
            <el-option label="已完成" value="COMPLETED" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择结束日期" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/utils/request'

const router = useRouter()
const projects = ref([])
const dialogVisible = ref(false)
const formRef = ref()
const submitting = ref(false)
const isEdit = ref(false)

const form = reactive({
  id: null,
  name: '',
  description: '',
  status: 'PLANNING',
  startDate: null,
  endDate: null
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
}

const getStatusType = (status) => {
  const types = {
    PLANNING: 'info',
    IN_PROGRESS: 'primary',
    ON_HOLD: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    PLANNING: '规划中',
    IN_PROGRESS: '进行中',
    ON_HOLD: '暂停',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return texts[status] || status
}

const loadProjects = async () => {
  try {
    const res = await api.get('/projects')
    projects.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    status: 'PLANNING',
    startDate: null,
    endDate: null
  })
  dialogVisible.value = true
}

const handleCommand = (command, project) => {
  if (command === 'view') {
    router.push(`/projects/${project.id}`)
  } else if (command === 'edit') {
    isEdit.value = true
    Object.assign(form, project)
    dialogVisible.value = true
  } else if (command === 'delete') {
    ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await api.delete(`/projects/${project.id}`)
      ElMessage.success('删除成功')
      loadProjects()
    }).catch(() => {})
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (isEdit.value) {
      await api.put(`/projects/${form.id}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/projects', form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadProjects()
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.projects {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h3 {
  margin: 0;
}

.project-card {
  margin-bottom: 20px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-weight: bold;
  color: #303133;
}

.more-btn {
  cursor: pointer;
  color: #909399;
}

.project-description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  min-height: 40px;
}

.project-status {
  margin-bottom: 15px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  font-size: 14px;
  color: #909399;
}

.owner {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
