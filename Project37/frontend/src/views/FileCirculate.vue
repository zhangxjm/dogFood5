<template>
  <el-card>
    <template #header>
      <span style="font-size: 18px; font-weight: bold;">文件传阅</span>
    </template>
    
    <el-form :model="circulateForm" label-width="100px">
      <el-form-item label="选择文件">
        <el-select v-model="circulateForm.fileId" placeholder="请选择要传阅的文件" style="width: 100%;" filterable>
          <el-option
            v-for="file in fileList"
            :key="file.id"
            :label="file.fileName"
            :value="file.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="传阅人员">
        <el-select v-model="circulateForm.receiverIds" multiple placeholder="请选择传阅人员" style="width: 100%;">
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="`${user.realName} (${user.department})`"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="传阅留言">
        <el-input v-model="circulateForm.message" type="textarea" :rows="3" placeholder="请输入传阅留言" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCirculate" :loading="circulating">发送传阅</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'FileCirculate',
  setup() {
    const circulating = ref(false)
    const fileList = ref([])
    const userList = ref([])
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

    const circulateForm = reactive({
      fileId: null,
      receiverIds: [],
      message: ''
    })

    const loadFileList = async () => {
      try {
        const response = await axios.get(`/api/file/uploader/${currentUser.id}`)
        if (response.data.code === 200) {
          fileList.value = response.data.data
        }
      } catch (error) {
        console.error('加载文件列表失败')
      }
    }

    const loadUserList = async () => {
      try {
        const response = await axios.get('/api/user/list')
        if (response.data.code === 200) {
          userList.value = response.data.data.filter(u => u.id !== currentUser.id)
        }
      } catch (error) {
        console.error('加载用户列表失败')
      }
    }

    const handleCirculate = async () => {
      if (!circulateForm.fileId) {
        alert('请选择要传阅的文件')
        return
      }
      if (circulateForm.receiverIds.length === 0) {
        alert('请选择传阅人员')
        return
      }

      circulating.value = true
      try {
        const response = await axios.post('/api/circulation/circulate', {
          fileId: circulateForm.fileId,
          circulatorId: currentUser.id,
          message: circulateForm.message,
          receiverIds: circulateForm.receiverIds
        })
        if (response.data.code === 200) {
          alert('文件传阅发送成功')
          circulateForm.fileId = null
          circulateForm.receiverIds = []
          circulateForm.message = ''
        }
      } catch (error) {
        alert('文件传阅发送失败')
      } finally {
        circulating.value = false
      }
    }

    onMounted(() => {
      loadFileList()
      loadUserList()
    })

    return {
      circulating,
      fileList,
      userList,
      circulateForm,
      handleCirculate
    }
  }
}
</script>
