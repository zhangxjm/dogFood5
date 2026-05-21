<template>
  <view class="container">
    <view class="warning-header">
      <text class="warning-icon">⚠️</text>
      <text class="warning-title">滞留件提醒</text>
    </view>
    
    <scroll-view 
      scroll-y 
      class="list-scroll"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="expired-list">
        <view 
          v-for="item in expiredList" 
          :key="item._id" 
          class="expired-item card"
        >
          <view class="item-header">
            <text class="pickup-code">{{ item.pickupCode }}</text>
            <view class="warning-badge">滞留</view>
          </view>
          <view class="item-info">
            <text class="info-text">收件人：{{ item.recipientName }}</text>
            <text class="info-text">电话：{{ item.recipientPhone }}</text>
            <text class="info-text">快递：{{ item.courierCompany }}</text>
            <text class="info-text">货架：{{ item.shelfLocation }}</text>
          </view>
          <view class="item-footer">
            <text class="time-text">入库时间：{{ formatTime(item.inboundTime) }}</text>
          </view>
          <button class="btn-warning notify-btn" @click="notifyUser(item)">
            发送提醒
          </button>
        </view>
        
        <view v-if="expiredList.length === 0 && !loading" class="empty-tip">
          ✨ 暂无滞留件，太棒了！
        </view>
        
        <view v-if="loading" class="loading-tip">
          加载中...
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { expressApi } from '../../utils/api.js';

export default {
  data() {
    return {
      expiredList: [],
      loading: false,
      refreshing: false
    };
  },
  onLoad() {
    this.loadList();
  },
  onShow() {
    this.loadList();
  },
  methods: {
    async loadList() {
      this.loading = true;
      try {
        const res = await expressApi.getExpired();
        this.expiredList = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },
    onRefresh() {
      this.refreshing = true;
      this.loadList();
    },
    notifyUser(item) {
      uni.makePhoneCall({
        phoneNumber: item.recipientPhone,
        success: () => {
          uni.showToast({ title: '已发起呼叫', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '呼叫失败', icon: 'none' });
        }
      });
    },
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff3e0;
}

.warning-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #ff9500, #ff6b00);
}

.warning-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.warning-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.list-scroll {
  flex: 1;
  padding: 20rpx;
}

.expired-list {
  padding-bottom: 40rpx;
}

.expired-item {
  margin-bottom: 20rpx;
  border-left: 8rpx solid #ff9500;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.pickup-code {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff6b00;
}

.warning-badge {
  padding: 8rpx 20rpx;
  background: #fff3e0;
  color: #ff9500;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666;
}

.item-footer {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.time-text {
  font-size: 24rpx;
  color: #999;
}

.notify-btn {
  margin-top: 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
}

.empty-tip, .loading-tip {
  text-align: center;
  padding: 100rpx 60rpx;
  color: #999;
  font-size: 28rpx;
  background: #fff;
  border-radius: 16rpx;
}
</style>
