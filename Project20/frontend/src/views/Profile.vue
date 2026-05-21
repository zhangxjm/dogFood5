<template>
  <div class="page-container">
    <van-nav-bar title="个人中心" fixed placeholder />

    <van-cell-group inset style="margin-top: 12px;">
      <van-cell center title="当前学员">
        <template #default>
          <div v-if="currentStudent" style="text-align: right;">
            <p style="font-weight: 500;">{{ currentStudent.name }}</p>
            <p style="font-size: 12px; color: #969799;">{{ currentStudent.phone }}</p>
          </div>
          <van-tag v-else type="warning">未选择</van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px;">
      <van-cell
        title="选择学员"
        is-link
        @click="showStudentPicker = true"
      />
      <van-cell
        title="添加新学员"
        is-link
        @click="showAddStudent = true"
      />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px;">
      <van-cell title="累计预约次数" :value="`${stats.total_records || 0} 次`" />
      <van-cell title="累计练车时长" :value="`${(stats.total_hours || 0).toFixed(1)} 小时`" />
    </van-cell-group>

    <van-popup v-model:show="showStudentPicker" position="bottom">
      <van-picker
        :columns="studentColumns"
        @confirm="onConfirmStudent"
        @cancel="showStudentPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showAddStudent" position="bottom" round>
      <div style="padding: 20px;">
        <h4 style="margin-bottom: 16px;">添加新学员</h4>
        <van-field
          v-model="newStudent.name"
          label="姓名"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="newStudent.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="newStudent.id_card"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field
          v-model="newStudent.subject_type"
          label="学习科目"
          placeholder="请输入学习科目"
        />
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <van-button block @click="showAddStudent = false">取消</van-button>
          <van-button type="primary" block :loading="adding" @click="addStudent">
            确认添加
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import { getStudents, createStudent, getRecordStats } from '../api'

const students = ref([])
const currentStudent = ref(null)
const stats = ref({})
const showStudentPicker = ref(false)
const showAddStudent = ref(false)
const adding = ref(false)
const newStudent = ref({
  name: '',
  phone: '',
  id_card: '',
  subject_type: ''
})

const studentColumns = ref([])

const loadStudents = async () => {
  try {
    const res = await getStudents()
    if (res.data.success) {
      students.value = res.data.data
      studentColumns.value = res.data.data.map(s => ({
        text: `${s.name} (${s.phone})`,
        value: s.id
      }))
    }
  } catch (e) {
    showToast('加载学员列表失败')
  }
}

const loadStats = async () => {
  const studentId = localStorage.getItem('studentId')
  if (!studentId) return

  try {
    const res = await getRecordStats({ student_id: studentId })
    if (res.data.success) {
      stats.value = res.data.data
    }
  } catch (e) {
    console.error('加载统计失败')
  }
}

const onConfirmStudent = ({ selectedOptions }) => {
  const studentId = selectedOptions[0].value
  localStorage.setItem('studentId', studentId)
  currentStudent.value = students.value.find(s => s.id === studentId)
  showStudentPicker.value = false
  loadStats()
  showToast('切换成功')
}

const addStudent = async () => {
  if (!newStudent.value.name.trim()) {
    showToast('请输入姓名')
    return
  }
  if (!newStudent.value.phone.trim()) {
    showToast('请输入手机号')
    return
  }

  adding.value = true
  try {
    const res = await createStudent(newStudent.value)
    if (res.data.success) {
      showToast('添加成功')
      showAddStudent.value = false
      newStudent.value = { name: '', phone: '', id_card: '', subject_type: '' }
      loadStudents()
    } else {
      showToast(res.data.message || '添加失败')
    }
  } catch (e) {
    showToast(e.response?.data?.message || '添加失败')
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  loadStudents().then(() => {
    const studentId = localStorage.getItem('studentId')
    if (studentId) {
      currentStudent.value = students.value.find(s => s.id === parseInt(studentId))
    }
    loadStats()
  })
})
</script>

<style scoped>
.page-container {
  padding-bottom: 80px;
}
</style>
