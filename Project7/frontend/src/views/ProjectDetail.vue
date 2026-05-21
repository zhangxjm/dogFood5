<template>
  <div class="project-detail">
    <div class="page-header">
      <div>
        <el-button @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
        <h3 style="display: inline; margin-left: 10px">{{ project?.name }}</h3>
      </div>
      <el-tag :type="getStatusType(project?.status)">{{ getStatusText(project?.status) }}</el-tag>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="任务列表" name="tasks">
        <div class="tab-header">
          <el-button type="primary" @click="showTaskDialog">
            <el-icon><Plus /></el-icon>新建任务
          </el-button>
        </div>
        <el-table :data="tasks" style="width: 100%">
          <el-table-column prop="title" label="任务标题" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getTaskStatusType(row.status)" size="small">{{ getTaskStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优先级" width="100">
            <template #default="{ row }">
              <el-tag :type="getPriorityType(row.priority)" size="small">{{ getPriorityText(row.priority) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="进度" width="150">
            <template #default="{ row }">
              <el-progress :percentage="row.progress || 0" :stroke-width="10" />
            </template>
          </el-table-column>
          <el-table-column label="负责人" width="120">
            <template #default="{ row }">
              {{ row.assignee?.username || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="editTask(row)">编辑</el-button>
              <el-button size="small" @click="updateProgress(row)">更新进度</el-button>
              <el-button size="small" type="danger" @click="deleteTask(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="项目统计" name="stats">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header><span>基本统计</span></template>
              <div class="stat-item">
                <span class="stat-label">任务总数</span>
                <span class="stat-value">{{ statistics.totalTasks || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">团队人数</span>
                <span class="stat-value">{{ statistics.teamSize || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">平均进度</span>
                <span class="stat-value">{{ statistics.averageProgress || 0 }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">完成率</span>
                <span class="stat-value">{{ statistics.completionRate || 0 }}%</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header><span>任务状态分布</span></template>
              <div class="status-list">
                <div v-for="(count, status) in statistics.statusCounts" :key="status" class="status-item">
                  <span class="status-name">{{ getTaskStatusText(status) }}</span>
                  <el-progress :percentage="Math.round((count / (statistics.totalTasks || 1)) * 100)" :stroke-width="10" />
                  <span class="status-count">{{ count }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="成员管理" name="members">
        <div class="tab-header">
          <el-button type="primary" @click="showMemberDialog">
            <el-icon><Plus /></el-icon>添加成员
          </el-button>
        </div>
        <el-table :data="members" style="width: 100%">
          <el-table-column prop="user.username" label="用户名" />
          <el-table-column prop="user.email" label="邮箱" />
          <el-table-column label="角色" width="120">
            <template #default="{ row }">
              <el-tag size="small">{{ getRoleText(row.role) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="editMember(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="removeMember(row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="甘特图" name="gantt">
        <div class="gantt-container">
          <div class="gantt-header">
            <span>任务名称</span>
            <span>进度</span>
            <div class="timeline-header">
              <span v-for="day in 30" :key="day">{{ day }}</span>
            </div>
          </div>
          <div class="gantt-body">
            <div v-for="task in tasks" :key="task.id" class="gantt-row">
              <span class="task-name">{{ task.title }}</span>
              <span class="task-progress">{{ task.progress || 0 }}%</span>
              <div class="timeline">
                <div 
                  class="task-bar" 
                  :style="{ 
                    width: (task.progress || 0) + '%',
                    background: getTaskBarColor(task.status)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="taskDialogVisible" :title="isTaskEdit ? '编辑任务' : '新建任务'" width="500px">
      <el-form ref="taskFormRef" :model="taskForm" :rules="taskRules" label-width="80px">
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="taskForm.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="taskForm.description" type="textarea" :rows="3" placeholder="请输入任务描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="taskForm.status" placeholder="请选择状态">
            <el-option label="待办" value="TODO" />
            <el-option label="进行中" value="IN_PROGRESS" />
            <el-option label="评审" value="REVIEW" />
            <el-option label="完成" value="DONE" />
            <el-option label="阻塞" value="BLOCKED" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="taskForm.priority" placeholder="请选择优先级">
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
            <el-option label="紧急" value="CRITICAL" />
          </el-select>
        </el-form-item>
        <el-form-item label="进度" prop="progress">
          <el-slider v-model="taskForm.progress" :min="0" :max="100" show-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="taskSubmitting" @click="handleTaskSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="progressDialogVisible" title="更新进度" width="400px">
      <el-form label-width="80px">
        <el-form-item label="进度">
          <el-slider v-model="currentProgress" :min="0" :max="100" show-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProgressSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="memberDialogVisible" :title="isMemberEdit ? '编辑成员' : '添加成员'" width="400px">
      <el-form ref="memberFormRef" :model="memberForm" label-width="80px">
        <el-form-item v-if="!isMemberEdit" label="选择用户" prop="userId">
          <el-select v-model="memberForm.userId" placeholder="请选择用户" style="width: 100%">
            <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="memberForm.role" placeholder="请选择角色">
            <el-option label="所有者" value="OWNER" />
            <el-option label="管理员" value="MANAGER" />
            <el-option label="成员" value="MEMBER" />
            <el-option label="观察者" value="VIEWER" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="memberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMemberSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/utils/request'

const route = useRoute()
const projectId = route.params.id

const activeTab = ref('tasks')
const project = ref(null)
const tasks = ref([])
const members = ref([])
const users = ref([])
const statistics = ref({})

const taskDialogVisible = ref(false)
const progressDialogVisible = ref(false)
const memberDialogVisible = ref(false)
const taskFormRef = ref()
const memberFormRef = ref()
const taskSubmitting = ref(false)
const isTaskEdit = ref(false)
const isMemberEdit = ref(false)
const currentTask = ref(null)
const currentProgress = ref(0)

const taskForm = reactive({
  id: null,
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  progress: 0
})

const memberForm = reactive({
  userId: null,
  role: 'MEMBER'
})

const taskRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }]
}

const getStatusType = (status) => {
  const types = { PLANNING: 'info', IN_PROGRESS: 'primary', ON_HOLD: 'warning', COMPLETED: 'success', CANCELLED: 'danger' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { PLANNING: '规划中', IN_PROGRESS: '进行中', ON_HOLD: '暂停', COMPLETED: '已完成', CANCELLED: '已取消' }
  return texts[status] || status
}

const getTaskStatusType = (status) => {
  const types = { TODO: 'info', IN_PROGRESS: 'primary', REVIEW: 'warning', DONE: 'success', BLOCKED: 'danger' }
  return types[status] || 'info'
}

const getTaskStatusText = (status) => {
  const texts = { TODO: '待办', IN_PROGRESS: '进行中', REVIEW: '评审', DONE: '完成', BLOCKED: '阻塞' }
  return texts[status] || status
}

const getPriorityType = (priority) => {
  const types = { LOW: 'info', MEDIUM: 'primary', HIGH: 'warning', CRITICAL: 'danger' }
  return types[priority] || 'info'
}

const getPriorityText = (priority) => {
  const texts = { LOW: '低', MEDIUM: '中', HIGH: '高', CRITICAL: '紧急' }
  return texts[priority] || priority
}

const getRoleText = (role) => {
  const texts = { OWNER: '所有者', MANAGER: '管理员', MEMBER: '成员', VIEWER: '观察者' }
  return texts[role] || role
}

const getTaskBarColor = (status) => {
  const colors = { TODO: '#909399', IN_PROGRESS: '#409EFF', REVIEW: '#E6A23C', DONE: '#67C23A', BLOCKED: '#F56C6C' }
  return colors[status] || '#409EFF'
}

const loadProject = async () => {
  try {
    const res = await api.get(`/projects/${projectId}`)
    project.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadTasks = async () => {
  try {
    const res = await api.get(`/tasks/project/${projectId}`)
    tasks.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadMembers = async () => {
  try {
    const res = await api.get(`/projects/${projectId}/members`)
    members.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadUsers = async () => {
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadStatistics = async () => {
  try {
    const res = await api.get(`/projects/${projectId}/statistics`)
    statistics.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const showTaskDialog = () => {
  isTaskEdit.value = false
  Object.assign(taskForm, { id: null, title: '', description: '', status: 'TODO', priority: 'MEDIUM', progress: 0 })
  taskDialogVisible.value = true
}

const editTask = (task) => {
  isTaskEdit.value = true
  Object.assign(taskForm, task)
  taskDialogVisible.value = true
}

const handleTaskSubmit = async () => {
  await taskFormRef.value.validate()
  taskSubmitting.value = true
  try {
    if (isTaskEdit.value) {
      await api.put(`/tasks/${taskForm.id}`, taskForm)
      ElMessage.success('更新成功')
    } else {
      await api.post(`/tasks/project/${projectId}`, taskForm)
      ElMessage.success('创建成功')
    }
    taskDialogVisible.value = false
    loadTasks()
    loadStatistics()
  } catch (e) {
    console.error(e)
  } finally {
    taskSubmitting.value = false
  }
}

const updateProgress = (task) => {
  currentTask.value = task
  currentProgress.value = task.progress || 0
  progressDialogVisible.value = true
}

const handleProgressSubmit = async () => {
  try {
    await api.patch(`/tasks/${currentTask.value.id}/progress`, { progress: currentProgress.value })
    ElMessage.success('更新成功')
    progressDialogVisible.value = false
    loadTasks()
    loadStatistics()
  } catch (e) {
    console.error(e)
  }
}

const deleteTask = async (task) => {
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    await api.delete(`/tasks/${task.id}`)
    ElMessage.success('删除成功')
    loadTasks()
    loadStatistics()
  }).catch(() => {})
}

const showMemberDialog = () => {
  isMemberEdit.value = false
  Object.assign(memberForm, { userId: null, role: 'MEMBER' })
  memberDialogVisible.value = true
}

const editMember = (member) => {
  isMemberEdit.value = true
  Object.assign(memberForm, { userId: member.user.id, role: member.role })
  memberDialogVisible.value = true
}

const handleMemberSubmit = async () => {
  try {
    if (isMemberEdit.value) {
      await api.put(`/projects/${projectId}/members/${memberForm.userId}`, { role: memberForm.role })
      ElMessage.success('更新成功')
    } else {
      await api.post(`/projects/${projectId}/members`, memberForm)
      ElMessage.success('添加成功')
    }
    memberDialogVisible.value = false
    loadMembers()
  } catch (e) {
    console.error(e)
  }
}

const removeMember = async (member) => {
  ElMessageBox.confirm('确定要移除该成员吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    await api.delete(`/projects/${projectId}/members/${member.user.id}`)
    ElMessage.success('移除成功')
    loadMembers()
  }).catch(() => {})
}

onMounted(() => {
  loadProject()
  loadTasks()
  loadMembers()
  loadUsers()
  loadStatistics()
})
</script>

<style scoped>
.project-detail {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-header {
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #606266;
}

.stat-value {
  font-weight: bold;
  color: #303133;
  font-size: 18px;
}

.status-list {
  padding: 10px 0;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  gap: 15px;
}

.status-name {
  width: 60px;
}

.status-item .el-progress {
  flex: 1;
}

.status-count {
  width: 40px;
  text-align: right;
  font-weight: bold;
}

.gantt-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.gantt-header {
  display: flex;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: bold;
}

.gantt-header > span:first-child {
  width: 200px;
  padding: 15px;
  border-right: 1px solid #ebeef5;
}

.gantt-header > span:nth-child(2) {
  width: 80px;
  padding: 15px;
  border-right: 1px solid #ebeef5;
  text-align: center;
}

.timeline-header {
  flex: 1;
  display: flex;
  overflow-x: auto;
}

.timeline-header span {
  min-width: 40px;
  padding: 15px 0;
  text-align: center;
  border-right: 1px solid #ebeef5;
  font-size: 12px;
  color: #909399;
}

.gantt-body {
  max-height: 500px;
  overflow-y: auto;
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.gantt-row:last-child {
  border-bottom: none;
}

.task-name {
  width: 200px;
  padding: 15px;
  border-right: 1px solid #ebeef5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-progress {
  width: 80px;
  padding: 15px;
  border-right: 1px solid #ebeef5;
  text-align: center;
}

.timeline {
  flex: 1;
  padding: 15px;
  position: relative;
  display: flex;
  align-items: center;
}

.task-bar {
  height: 20px;
  border-radius: 10px;
  transition: width 0.3s;
}
</style>
