<template>
  <view class="container">
    <view class="filter-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === '' }" 
        @click="filterList('')"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === 'pending' }" 
        @click="filterList('pending')"
      >
        待取件
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === 'picked' }" 
        @click="filterList('picked')"
      >
        已取件
      </view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="list-scroll" 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="express-list">
        <view 
          v-for="item in expressList" 
          :key="item._id" 
          class="express-item card"
        >
          <view class="item-header">
            <text class="pickup-code">{{ item.pickupCode }}</text>
            <text class="status-tag" :class="item.status">
              {{ getStatusText(item.status) }}
            </text>
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
        </view>
        
        <view v-if="expressList.length === 0 && !loading" class="empty-tip">
          暂无数据
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
      expressList: [],
      currentStatus: '',
      page: 1,
      limit: 20,
      loading: false,
      refreshing: false,
      hasMore: true
    };
  },
  onLoad() {
    this.loadList();
  },
  onShow() {
    this.onRefresh();
  },
  methods: {
    async loadList(loadMore = false) {
      if (this.loading) return;
      
      this.loading = true;
      try {
        const res = await expressApi.getList({
          status: this.currentStatus,
          page: loadMore ? this.page + 1 : 1,
          limit: this.limit
        });
        
        if (loadMore) {
          this.expressList = [...this.expressList, ...res.data];
          this.page++;
        } else {
          this.expressList = res.data;
          this.page = 1;
        }
        
        this.hasMore = res.data.length >= this.limit;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },
    filterList(status) {
      this.currentStatus = status;
      this.loadList();
    },
    loadMore() {
      if (this.hasMore) {
        this.loadList(true);
      }
    },
    onRefresh() {
      this.refreshing = true;
      this.loadList();
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待取件',
        picked: '已取件',
        expired: '已过期'
      };
      return statusMap[status] || status;
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
}

.filter-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab-item.active {
  color: #007aff;
  background: #e6f2ff;
  font-weight: bold;
}

.list-scroll {
  flex: 1;
  padding: 20rpx;
}

.express-list {
  padding-bottom: 40rpx;
}

.express-item {
  margin-bottom: 20rpx;
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

.status-tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-tag.pending {
  background: #fff3e0;
  color: #ff9500;
}

.status-tag.picked {
  background: #e8f5e9;
  color: #4cd964;
}

.status-tag.expired {
  background: #ffebee;
  color: #ff3b30;
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

.empty-tip, .loading-tip {
  text-align: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
