<template>
  <div class="container page-content">
    <h1 class="page-title">🏪 快递驿站管理系统</h1>
    
    <div class="grid">
      <div class="grid-item" @click="navigateTo('InboundPage')">
        <div class="grid-icon">📦</div>
        <div class="grid-text">快递入库</div>
      </div>
      <div class="grid-item" @click="navigateTo('PickupPage')">
        <div class="grid-icon">✅</div>
        <div class="grid-text">取件核销</div>
      </div>
      <div class="grid-item" @click="navigateTo('ListPage')">
        <div class="grid-icon">📋</div>
        <div class="grid-text">快递列表</div>
      </div>
      <div class="grid-item" @click="navigateTo('StatisticsPage')">
        <div class="grid-icon">📊</div>
        <div class="grid-text">数据统计</div>
      </div>
      <div class="grid-item" @click="navigateTo('ExpiredPage')">
        <div class="grid-icon">🔔</div>
        <div class="grid-text">滞留提醒</div>
      </div>
    </div>
    
    <div class="card">
      <span class="card-title">📅 今日概览</span>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ statistics.todayInbound || 0 }}</span>
          <span class="stat-label">今日入库</span>
        </div>
        <div class="stat-item">
          <span class="stat-value picked">{{ statistics.todayPicked || 0 }}</span>
          <span class="stat-label">今日取件</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { expressApi } from '../utils/api.js';

export default {
  name: 'HomePage',
  data() {
    return {
      statistics: {}
    };
  },
  mounted() {
    this.loadStatistics();
  },
  methods: {
    navigateTo(page) {
      this.$emit('navigate', page);
    },
    async loadStatistics() {
      const result = await expressApi.getStatistics();
      if (result.success) {
        this.statistics = result.data || {};
      }
    }
  }
};
</script>

<style>
.picked {
  color: #4cd964;
}
</style>
