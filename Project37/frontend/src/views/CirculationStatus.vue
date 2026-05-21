<template>
  <el-card>
    <template #header>
      <span style="font-size: 18px; font-weight: bold;">传阅状态</span>
    </template>
    
    <el-table :data="circulationList" border stripe style="width: 100%;">
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.isRead ? 'success' : 'warning'" size="small">
            {{ scope.row.isRead ? '已读' : '未读' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="circulatorName" label="传阅人" width="120" />
      <el-table-column prop="receiverName" label="接收人" width="120" />
      <el-table-column prop="message" label="传阅留言" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createTime" label="传阅时间" width="180" />
      <el-table-column prop="readTime" label="阅读时间" width="180">
        <template #default="scope">
          {{ scope.row.readTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" link @click="handleDownload(scope.row.fileId)">下载文件</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'CirculationStatus',
  setup() {
    const circulationList = ref([])
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

    const loadCirculationList = async () => {
      try {
        const response = await axios.get(`/api/circulation/circulator/${currentUser.id}`)
        if (response.data.code === 200) {
          circulationList.value = response.data.data.sort((a, b) => b.id - a.id)
        }
      } catch (error) {
        console.error('加载传阅状态失败')
      }
    }

    const handleDownload = (fileId) => {
      window.open(`/api/file/download/${fileId}`, '_blank')
    }

    onMounted(() => {
      loadCirculationList()
    })

    return {
      circulationList,
      handleDownload
    }
  }
}
</script>
