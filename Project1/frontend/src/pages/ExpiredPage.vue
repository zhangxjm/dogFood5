<template>
  <div class="container page-content">
    <div class="warning-header">
      <h2>⚠️ 滞留件提醒</h2>
    </div>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="expiredList.length === 0" class="empty-state">
      ✨ 暂无滞留件，太棒了！
    </div>
    
    <div v-else>
      <div 
        v-for="item in expiredList" 
        :key="item._id" 
        class="list-item pending"
      >
        <div class="list-header">
          <span class="pickup-code">{{ item.pickupCode }}</span>
          <span class="status-badge pending">滞留</span>
        </div>
        <div class="list-info">
          <p>👤 收件人：{{ item.recipientName }}</p>
          <p>📱 电话：{{ item.recipientPhone }}</p>
          <p>🏷️ 快递：{{ item.courierCompany }}</p>
          <p>📍 货架：{{ item.shelfLocation }}</p>
        </div>
        <div class="list-footer">
          <span class="time-text">入库时间：{{ formatTime(item.inboundTime) }}</span>
        </div>
        <button 
          class="btn btn-warning btn-block" 
          style="margin-top: 16px;"
          @click="notifyUser(item)"
        >
          📞 电话提醒
        </button>
      </div>
    </div>
    
    <button 
      class="btn btn-primary btn-block" 
      style="margin-top: 16px;"
      @click="loadList" 
      :disabled="loading"
    >
      {{ loading ? '刷新中...' : '🔄 刷新列表' }}
    </button>
  </div>
</template>

<script>
import { expressApi } from '../utils/api.js';

export default {
  name: 'ExpiredPage',
  data() {
    return {
      expiredList: [],
      loading: false
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    async loadList() {
      this.loading = true;
      try {
        const result = await expressApi.getExpired();
        if (result.success) {
          this.expiredList = result.data || [];
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    notifyUser(item) {
      window.location.href = `tel:${item.recipientPhone}`;
    },
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  }
};
</script>

<style>
</style>
