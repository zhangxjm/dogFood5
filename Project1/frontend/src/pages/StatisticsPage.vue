<template>
  <div class="container page-content">
    <h1 class="page-title">📊 数据统计</h1>
    
    <div class="card">
      <span class="card-title">总体统计</span>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-value">{{ statistics.totalInbound || 0 }}</span>
          <span class="stat-label">总入库</span>
        </div>
        <div class="stat-box">
          <span class="stat-value picked">{{ statistics.totalPicked || 0 }}</span>
          <span class="stat-label">已取件</span>
        </div>
        <div class="stat-box">
          <span class="stat-value pending">{{ statistics.totalPending || 0 }}</span>
          <span class="stat-label">待取件</span>
        </div>
        <div class="stat-box">
          <span class="stat-value expired">{{ statistics.totalExpired || 0 }}</span>
          <span class="stat-label">已过期</span>
        </div>
      </div>
    </div>
    
    <div class="card">
      <span class="card-title">今日数据</span>
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
    
    <div class="card">
      <span class="card-title">取件率</span>
      <div class="rate-container">
        <div class="rate-bar">
          <div class="rate-fill" :style="{ width: pickRate + '%' }"></div>
        </div>
        <span class="rate-text">{{ pickRate }}%</span>
      </div>
    </div>
    
    <button 
      class="btn btn-primary btn-block" 
      @click="loadStatistics" 
      :disabled="loading"
    >
      {{ loading ? '刷新中...' : '🔄 刷新数据' }}
    </button>
  </div>
</template>

<script>
import { expressApi } from '../utils/api.js';

export default {
  name: 'StatisticsPage',
  data() {
    return {
      statistics: {},
      loading: false
    };
  },
  computed: {
    pickRate() {
      const rate = parseFloat(this.statistics.pickupRate || 0);
      return rate.toFixed(1);
    }
  },
  mounted() {
    this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      this.loading = true;
      try {
        const result = await expressApi.getStatistics();
        if (result.success) {
          this.statistics = result.data || {};
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.picked { color: #4cd964; }
.pending { color: #ff9500; }
.expired { color: #ff3b30; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}
</style>
