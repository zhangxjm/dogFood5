<template>
  <div class="my-tasks">
    <h3>我的任务</h3>
    <el-table :data="tasks" style="width: 100%">
      <el-table-column prop="title" label="任务标题" />
      <el-table-column prop="project.name" label="所属项目" />
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
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/request'

const tasks = ref([])

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

const loadTasks = async () => {
  try {
    const res = await api.get('/tasks/my-tasks')
    tasks.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.my-tasks {
  padding: 0;
}

.my-tasks h3 {
  margin-bottom: 20px;
}
</style>
