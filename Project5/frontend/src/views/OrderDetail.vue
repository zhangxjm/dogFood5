<template>
  <div class="order-detail">
    <van-nav-bar title="订单详情" left-arrow @click-left="$router.back()" />
    
    <van-loading v-if="loading" />
    
    <div v-else class="content">
      <van-cell-group>
        <van-cell title="订单标题" :value="order.title" />
        <van-cell title="订单描述" :value="order.description" />
        <van-cell title="状态">
          <template #value>
            <van-tag type="primary">{{ getStatusText(order.status) }}</van-tag>
          </template>
        </van-cell>
        <van-cell title="服务类型" :value="order.serviceTypeId?.name" />
        <van-cell title="酬金" :value="'¥' + order.price" />
        <van-cell title="取件地址" :value="order.pickupAddress" />
        <van-cell title="送达地址" :value="order.deliveryAddress" />
        <van-cell title="发布人" :value="order.customerId?.name" />
        <van-cell v-if="order.runnerId" title="跑腿员" :value="order.runnerId?.name" />
      </van-cell-group>

      <div v-if="store.userRole === 'runner' && order.status === 'pending'" class="action">
        <van-button type="primary" block @click="acceptOrder">接单</van-button>
      </div>

      <div v-else-if="canUpdateStatus" class="action">
        <van-button :type="nextStatus === 'cancelled' ? 'danger' : 'primary'" block @click="showActionSheet = true">
          {{ getNextStatusText() }}
        </van-button>
      </div>

      <div v-if="showReviewForm" class="review-section">
        <h3>评价跑腿员</h3>
        <van-rate v-model="reviewRating" />
        <van-field v-model="reviewComment" type="textarea" placeholder="请输入评价内容" />
        <van-button type="primary" block @click="submitReview">提交评价</van-button>
      </div>
    </div>

    <van-action-sheet v-model:show="showActionSheet" :actions="actions" cancel-text="取消" @select="onStatusSelect" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { store } from '../store'
import { orderApi, reviewApi } from '../api'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id
const order = ref({})
const loading = ref(true)
const showActionSheet = ref(false)
const showReviewForm = ref(false)
const reviewRating = ref(5)
const reviewComment = ref('')

const canUpdateStatus = computed(() => {
  if (!store.isLoggedIn()) return false
  const isCustomer = order.value.customerId?._id === store.getUserId()
  const isRunner = order.value.runnerId?._id === store.getUserId()
  const status = order.value.status
  
  if (status === 'pending' && isCustomer) return true
  if (status === 'accepted' && (isCustomer || isRunner)) return true
  if (status === 'picked_up' && isRunner) return true
  if (status === 'delivered' && isCustomer) return true
  return false
})

const actions = computed(() => {
  const list = []
  const status = order.value.status
  const isCustomer = order.value.customerId?._id === store.getUserId()
  const isRunner = order.value.runnerId?._id === store.getUserId()

  if (status === 'pending' && isCustomer) {
    list.push({ name: '取消订单', status: 'cancelled', color: '#ee0a24' })
  }
  if (status === 'accepted' && isRunner) {
    list.push({ name: '确认取件', status: 'picked_up' })
  }
  if (status === 'accepted' && isCustomer) {
    list.push({ name: '取消订单', status: 'cancelled', color: '#ee0a24' })
  }
  if (status === 'picked_up' && isRunner) {
    list.push({ name: '确认送达', status: 'delivered' })
  }
  if (status === 'delivered' && isCustomer) {
    list.push({ name: '确认完成', status: 'completed' })
  }
  return list
})

onMounted(() => {
  loadOrder()
})

async function loadOrder() {
  try {
    const res = await orderApi.getOne(orderId)
    order.value = res.data
    if (order.value.status === 'completed') {
      showReviewForm.value = true
    }
  } catch (e) {
    showToast('加载订单失败')
  }
  loading.value = false
}

async function acceptOrder() {
  if (!store.isLoggedIn()) {
    showToast('请先登录')
    return
  }
  try {
    await orderApi.accept(orderId, store.getUserId())
    showToast('接单成功')
    loadOrder()
  } catch (e) {
    console.error('Accept order error:', e)
    showToast(e.response?.data?.message || '接单失败')
  }
}

function onStatusSelect(action) {
  if (!store.isLoggedIn()) {
    showToast('请先登录')
    return
  }
  showDialog({
    title: '确认',
    message: `确定要${action.name}吗？`
  }).then(async () => {
    try {
      await orderApi.updateStatus(orderId, action.status, store.getUserId())
      showToast('操作成功')
      loadOrder()
    } catch (e) {
      console.error('Update status error:', e)
      showToast(e.response?.data?.message || '操作失败')
    }
  })
  showActionSheet.value = false
}

async function submitReview() {
  if (!store.isLoggedIn()) {
    showToast('请先登录')
    return
  }
  try {
    await reviewApi.create({
      orderId,
      customerId: store.getUserId(),
      runnerId: order.value.runnerId?._id,
      rating: reviewRating.value,
      comment: reviewComment.value
    })
    showToast('评价成功')
    showReviewForm.value = false
  } catch (e) {
    console.error('Submit review error:', e)
    showToast(e.response?.data?.message || '评价失败')
  }
}

function getStatusText(status) {
  const map = {
    pending: '待接单',
    accepted: '已接单',
    picked_up: '已取件',
    delivered: '已送达',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

function getNextStatusText() {
  if (actions.value.length > 0) {
    return actions.value[0].name
  }
  return '操作'
}
</script>

<style scoped>
.order-detail {
  padding-bottom: 20px;
}

.content {
  padding: 16px;
}

.action {
  margin-top: 20px;
}

.review-section {
  margin-top: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.review-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
}
</style>
