<template>
  <view class="container">
    <image :src="flower.image" class="flower-image" mode="aspectFill"></image>
    
    <view class="flower-detail">
      <view class="flower-header">
        <text class="flower-name">{{ flower.name }}</text>
        <text class="flower-price">¥{{ flower.price }}</text>
      </view>
      
      <view class="flower-tags">
        <text v-for="tag in flower.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
      
      <view class="flower-desc">
        <text class="label">商品描述</text>
        <text class="desc">{{ flower.description }}</text>
      </view>
      
      <view class="flower-stock">
        <text class="label">库存状态</text>
        <text class="stock" :class="{ available: flower.isAvailable }">
          {{ flower.isAvailable ? '有货' : '暂时缺货' }}
        </text>
      </view>
    </view>
    
    <view class="footer">
      <button 
        class="order-btn" 
        :disabled="!flower.isAvailable"
        @click="goToOrder"
      >
        {{ flower.isAvailable ? '立即预订' : '暂时缺货' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const flower = ref({})

const loadFlowerDetail = async (id) => {
  try {
    const res = await proxy.$api.get(`/flowers/${id}`)
    flower.value = res || {}
  } catch (e) {
    console.error('加载花束详情失败', e)
    flower.value = {
      id: id,
      name: '浪漫红玫瑰',
      description: '11枝精选红玫瑰，搭配满天星，传递浓浓爱意。适合情人节、纪念日等浪漫场合赠送。',
      price: 199,
      image: 'https://images.unsplash.com/photo-1518882605630-8eb518837bf2?w=600',
      tags: ['热卖', '情人节'],
      isAvailable: true,
      stock: 50
    }
  }
}

const goToOrder = () => {
  uni.navigateTo({
    url: `/pages/order/create?flowerId=${flower.value.id}&flowerName=${flower.value.name}&flowerPrice=${flower.value.price}`
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.options.id
  if (id) {
    loadFlowerDetail(id)
  }
})
</script>

<style scoped>
.container {
  padding-bottom: 120rpx;
}

.flower-image {
  width: 100%;
  height: 500rpx;
}

.flower-detail {
  padding: 30rpx;
}

.flower-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flower-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.flower-price {
  font-size: 44rpx;
  font-weight: bold;
  color: #FF6B9D;
}

.flower-tags {
  margin-top: 20rpx;
  display: flex;
  gap: 10rpx;
}

.tag {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
}

.flower-desc,
.flower-stock {
  margin-top: 40rpx;
}

.label {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.stock {
  font-size: 28rpx;
  color: #999;
}

.stock.available {
  color: #52c41a;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.order-btn {
  width: 100%;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.order-btn[disabled] {
  background: #ccc;
}
</style>
