<template>
  <div class="page">
    <van-nav-bar
      title="自提点管理"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content">
      <van-button class="add-btn" @click="goAdd">+ 添加自提点</van-button>
      
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="pickup-item" v-for="item in list" :key="item.id">
            <div class="pickup-header">
              <span class="name">{{ item.name }}</span>
              <van-tag :type="item.status === 1 ? 'success' : 'default'">
                {{ item.status === 1 ? '启用' : '禁用' }}
              </van-tag>
            </div>
            <div class="pickup-info">
              <div class="info-row">
                <span class="icon">📍</span>
                <span class="text">{{ item.address }}</span>
              </div>
              <div class="info-row">
                <span class="icon">👤</span>
                <span class="text">{{ item.contact_name }} {{ item.contact_phone }}</span>
              </div>
              <div class="info-row" v-if="item.business_hours">
                <span class="icon">🕐</span>
                <span class="text">{{ item.business_hours }}</span>
              </div>
            </div>
            <div class="pickup-actions">
              <van-button size="small" type="primary" @click="goEdit(item.id)">编辑</van-button>
              <van-button size="small" type="warning" @click="toggleStatus(item)">
                {{ item.status === 1 ? '禁用' : '启用' }}
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      
      <van-empty v-if="list.length === 0 && !loading" description="暂无自提点" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import request from '@/utils/request'

const router = useRouter()

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = 10

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const loadList = async () => {
  if (!leaderId) return
  
  try {
    const res = await request({ url: `/pickup/list/${leaderId}` })
    list.value = res.data
    loading.value = false
    finished.value = true
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

const onLoad = () => {
  loadList()
}

const onRefresh = () => {
  finished.value = false
  loadList()
  refreshing.value = false
}

const toggleStatus = async (item) => {
  const newStatus = item.status === 1 ? 0 : 1
  try {
    await showConfirmDialog({
      title: '确认操作',
      message: `确定${newStatus === 1 ? '启用' : '禁用'}该自提点吗？`
    })
    
    await request({
      url: `/pickup/status/${item.id}`,
      method: 'PUT',
      data: { status: newStatus }
    })
    
    item.status = newStatus
    showToast(newStatus === 1 ? '已启用' : '已禁用')
  } catch (e) {
    console.error(e)
  }
}

const goAdd = () => {
  router.push('/pickup/form')
}

const goEdit = (id) => {
  router.push(`/pickup/form?id=${id}`)
}

const onBack = () => {
  router.back()
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.pickup-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.pickup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.pickup-info {
  padding: 12px 0;
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
}
.icon {
  font-size: 14px;
}
.text {
  flex: 1;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
.pickup-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
.pickup-actions .van-button {
  flex: 1;
}
</style>
