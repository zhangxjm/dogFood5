<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="order-item" v-for="item in list" :key="item.id" @click="goDetail(item.id)">
          <div class="order-header">
            <span class="order-no">订单号: {{ item.order_no }}</span>
            <van-tag :type="getStatusType(item.status)">{{ getStatusText(item.status) }}</van-tag>
          </div>
          <div class="order-body">
            <div class="user-info">
              <span class="user-name">{{ item.user_name }}</span>
              <span class="user-phone">{{ item.user_phone }}</span>
            </div>
            <div class="order-amount">
              <span class="amount">¥{{ item.total_amount }}</span>
              <span class="commission">佣金: ¥{{ item.commission_amount }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="time">{{ item.created_at }}</span>
            <van-button
              v-if="item.status === 1"
              size="small"
              type="success"
              @click.stop="verifyOrder(item)"
            >
              核销
            </van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <van-empty v-if="list.length === 0 && !loading" description="暂无订单" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import request from '@/utils/request'

const props = defineProps({
  status: {
    type: Number,
    default: null
  }
})

const router = useRouter()

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = 10

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const getStatusText = (status) => {
  const texts = { 0: '待付款', 1: '待核销', 2: '已核销', 3: '已完成', 4: '已取消' }
  return texts[status] || '未知'
}

const getStatusType = (status) => {
  if (status === 1) return 'warning'
  if (status === 2 || status === 3) return 'success'
  return 'default'
}

const loadList = async () => {
  if (!leaderId) return
  
  try {
    let url = `/order/list/${leaderId}?page=${page.value}&page_size=${pageSize}`
    if (props.status !== null) {
      url += `&status=${props.status}`
    }
    
    const res = await request({ url })
    const data = res.data
    
    if (refreshing.value) {
      list.value = data.list
      refreshing.value = false
    } else {
      list.value = [...list.value, ...data.list]
    }
    
    loading.value = false
    if (data.list.length < pageSize) {
      finished.value = true
    }
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

const onLoad = () => {
  if (!refreshing.value) {
    page.value++
    loadList()
  }
}

const onRefresh = () => {
  finished.value = false
  page.value = 1
  loadList()
}

const verifyOrder = async (item) => {
  try {
    await showConfirmDialog({
      title: '确认核销',
      message: `确定核销订单 ${item.order_no}？`
    })
    
    await request({
      url: '/order/verify',
      method: 'POST',
      data: {
        leader_id: leaderId,
        order_id: item.id
      }
    })
    
    showToast('核销成功')
    onRefresh()
  } catch (e) {
    console.error(e)
  }
}

const goDetail = (id) => {
  router.push(`/order/detail/${id}`)
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.order-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.order-no {
  font-size: 12px;
  color: #999;
}
.order-body {
  padding: 12px 0;
}
.user-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.user-name {
  font-size: 14px;
  color: #333;
}
.user-phone {
  font-size: 13px;
  color: #666;
}
.order-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.amount {
  font-size: 16px;
  color: #ff4d4f;
  font-weight: bold;
}
.commission {
  font-size: 12px;
  color: #52c41a;
}
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
.time {
  font-size: 12px;
  color: #999;
}
</style>
