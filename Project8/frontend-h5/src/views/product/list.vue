<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="product-item" v-for="item in list" :key="item.id">
          <div class="product-image">
            <span>📦</span>
          </div>
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-meta">
              <span class="price">¥{{ item.price }}</span>
              <span class="stock">库存: {{ item.stock }}</span>
            </div>
            <div class="product-footer">
              <span class="commission">佣金: {{ item.commission_rate }}%</span>
              <van-switch v-model="item.status" :active-value="1" :inactive-value="0" @change="(val) => toggleStatus(item, val)" />
            </div>
          </div>
          <van-button size="small" type="primary" @click="goEdit(item.id)">编辑</van-button>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <van-empty v-if="list.length === 0 && !loading" description="暂无商品" />
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

const loadList = async () => {
  if (!leaderId) return
  
  try {
    let url = `/product/list/${leaderId}?page=${page.value}&page_size=${pageSize}`
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

const toggleStatus = async (item, val) => {
  try {
    await showConfirmDialog({
      title: '确认操作',
      message: `确定${val === 1 ? '上架' : '下架'}该商品吗？`
    })
    
    await request({
      url: `/product/status/${item.id}`,
      method: 'PUT',
      data: { status: val }
    })
    
    showToast(val === 1 ? '已上架' : '已下架')
  } catch (e) {
    item.status = val === 1 ? 0 : 1
  }
}

const goEdit = (id) => {
  router.push(`/product/form?id=${id}`)
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.product-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
}
.product-image {
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
.product-info {
  flex: 1;
}
.product-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.price {
  font-size: 16px;
  color: #ff4d4f;
  font-weight: bold;
}
.stock {
  font-size: 12px;
  color: #999;
}
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.commission {
  font-size: 12px;
  color: #52c41a;
}
</style>
