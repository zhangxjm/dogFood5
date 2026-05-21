<template>
  <view class="container">
    <view class="header">
      <text class="title">精选花束</text>
      <text class="subtitle">为您准备最美的鲜花</text>
    </view>
    
    <view class="flower-list">
      <view 
        v-for="flower in flowers" 
        :key="flower.id" 
        class="flower-card"
        @click="goToDetail(flower.id)"
      >
        <image :src="flower.image" class="flower-image" mode="aspectFill"></image>
        <view class="flower-info">
          <text class="flower-name">{{ flower.name }}</text>
          <text class="flower-desc">{{ flower.description }}</text>
          <view class="flower-tags">
            <text v-for="tag in flower.tags" :key="tag" class="tag">{{ tag }}</text>
          </view>
          <view class="flower-bottom">
            <text class="flower-price">¥{{ flower.price }}</text>
            <button class="order-btn" @click.stop="goToOrder(flower)">立即预订</button>
          </view>
        </view>
      </view>
    </view>
    
    <view v-if="flowers.length === 0" class="empty">
      <text>暂无花束数据</text>
      <button class="btn-primary" @click="initData">刷新</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const flowers = ref([])

const initData = async () => {
  try {
    const res = await proxy.$api.get('/flowers')
    flowers.value = res || []
  } catch (e) {
    console.error('加载花束失败', e)
    initMockData()
  }
}

const initMockData = () => {
  flowers.value = [
    {
      id: '1',
      name: '浪漫红玫瑰',
      description: '11枝精选红玫瑰，搭配满天星',
      price: 199,
      image: 'https://images.unsplash.com/photo-1518882605630-8eb518837bf2?w=400',
      tags: ['热卖', '情人节']
    },
    {
      id: '2',
      name: '粉色康乃馨',
      description: '19枝粉色康乃馨，感恩母亲节',
      price: 168,
      image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400',
      tags: ['母亲节', '感恩']
    },
    {
      id: '3',
      name: '向日葵花束',
      description: '9枝向日葵，阳光与希望',
      price: 158,
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400',
      tags: ['生日', '祝福']
    },
    {
      id: '4',
      name: '百合花束',
      description: '6枝香水百合，纯洁高雅',
      price: 228,
      image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400',
      tags: ['婚礼', '祝福']
    }
  ]
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/flower/detail?id=${id}`
  })
}

const goToOrder = (flower) => {
  uni.navigateTo({
    url: `/pages/order/create?flowerId=${flower.id}&flowerName=${flower.name}&flowerPrice=${flower.price}`
  })
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.header {
  padding: 40rpx 20rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

.flower-list {
  padding: 0 20rpx;
}

.flower-card {
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.flower-image {
  width: 100%;
  height: 400rpx;
}

.flower-info {
  padding: 30rpx;
}

.flower-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.flower-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 10rpx;
  display: block;
}

.flower-tags {
  margin-top: 20rpx;
  display: flex;
  gap: 10rpx;
}

.tag {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
}

.flower-bottom {
  margin-top: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flower-price {
  font-size: 40rpx;
  font-weight: bold;
  color: #FF6B9D;
}

.order-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 16rpx 40rpx;
  font-size: 28rpx;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
}
</style>
