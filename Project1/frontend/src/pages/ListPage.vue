<template>
  <div class="container page-content">
    <h1 class="page-title">📋 快递列表</h1>
    
    <div class="nav-tabs">
      <div 
        class="nav-tab" 
        :class="{ active: currentStatus === '' }" 
        @click="filterList('')"
      >
        全部
      </div>
      <div 
        class="nav-tab" 
        :class="{ active: currentStatus === 'pending' }" 
        @click="filterList('pending')"
      >
        待取件
      </div>
      <div 
        class="nav-tab" 
        :class="{ active: currentStatus === 'picked' }" 
        @click="filterList('picked')"
      >
        已取件
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="expressList.length === 0" class="empty-state">
      暂无数据
    </div>
    
    <div v-else>
      <div 
        v-for="item in expressList" 
        :key="item._id" 
        class="list-item"
        :class="item.status"
      >
        <div class="list-header">
          <span class="pickup-code">{{ item.pickupCode }}</span>
          <span class="status-badge" :class="item.status">
            {{ getStatusText(item.status) }}
          </span>
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
      </div>
    </div>
  </div>
</template>

<script>
import { expressApi } from '../utils/api.js';

export default {
  name: 'ListPage',
  data() {
    return {
      expressList: [],
      currentStatus: '',
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
        const result = await expressApi.getList({ status: this.currentStatus });
        if (result.success) {
          this.expressList = result.data || [];
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    filterList(status) {
      this.currentStatus = status;
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

<style>
</style>
