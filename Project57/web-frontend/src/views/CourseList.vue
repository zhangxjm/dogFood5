<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">手工课程</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加课程
      </el-button>
    </div>

    <div v-if="loading" class="loading-center">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else class="card-grid">
      <div
        v-for="course in courses"
        :key="course.id"
        class="course-card"
        @click="goToDetail(course.id)"
      >
        <div v-if="course.imageUrl" class="course-image">
          <img :src="course.imageUrl" :alt="course.name" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div v-else class="course-image">🎨</div>
        <div class="course-content">
          <h3 class="course-name">{{ course.name }}</h3>
          <p class="course-desc">{{ course.description }}</p>
          <div class="course-footer">
            <span class="course-price">¥{{ course.price }}</span>
            <span class="course-capacity">限{{ course.capacity }}人</span>
          </div>
        </div>
      </div>

      <div v-if="courses.length === 0" class="empty-state">
        暂无课程
      </div>
    </div>

    <el-dialog v-model="showAddDialog" title="添加课程" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入课程描述" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="名额">
          <el-input-number v-model="form.capacity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.imageUrl" placeholder="请输入图片链接（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCourse">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue'
import { api } from '../api'

const router = useRouter()
const loading = ref(true)
const courses = ref([])
const showAddDialog = ref(false)
const form = ref({
  name: '',
  description: '',
  price: 0,
  capacity: 10,
  imageUrl: ''
})

const loadCourses = async () => {
  try {
    loading.value = true
    const data = await api.getCourses()
    courses.value = data
  } catch (error) {
    ElMessage.error('加载课程失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push(`/courses/${id}`)
}

const submitCourse = async () => {
  if (!form.value.name || !form.value.description) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await api.createCourse(form.value)
    ElMessage.success('添加成功')
    showAddDialog.value = false
    form.value = {
      name: '',
      description: '',
      price: 0,
      capacity: 10,
      imageUrl: ''
    }
    loadCourses()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

onMounted(() => {
  loadCourses()
})
</script>
