<template>
  <div class="container page-content">
    <button class="back-btn" @click="goBack">← 返回</button>
    <h1 class="page-title">✅ 取件核销</h1>
    
    <div class="card">
      <span class="card-title">手动输入取件码</span>
      <div class="input-group">
        <input v-model="pickupCode" placeholder="请输入取件码" maxlength="6" />
      </div>
      <button 
        class="btn btn-success btn-block" 
        @click="handlePickup" 
        :disabled="loading"
      >
        {{ loading ? '核销中...' : '确认取件' }}
      </button>
    </div>
    
    <div v-if="result" class="card">
      <div class="success-message">
        ✅ 取件成功！
      </div>
      <div class="result-info">
        <p><strong>取件码：</strong><span class="pickup-code">{{ result.pickupCode }}</span></p>
        <p><strong>收件人：</strong>{{ result.recipientName }}</p>
        <p><strong>快递公司：</strong>{{ result.courierCompany }}</p>
        <p><strong>货架位置：</strong>{{ result.shelfLocation }}</p>
      </div>
      <button class="btn btn-primary btn-block" @click="resetForm">继续取件</button>
    </div>
    
    <div v-if="error" class="error-message">
      ❌ {{ error }}
    </div>
  </div>
</template>

<script>
import { expressApi } from '../utils/api.js';

export default {
  name: 'PickupPage',
  data() {
    return {
      pickupCode: '',
      loading: false,
      result: null,
      error: ''
    };
  },
  methods: {
    goBack() {
      this.$emit('goBack');
    },
    async handlePickup() {
      if (!this.pickupCode) {
        this.error = '请输入取件码';
        return;
      }
      
      this.loading = true;
      this.error = '';
      
      try {
        const result = await expressApi.pickup({ pickupCode: this.pickupCode.toUpperCase() });
        if (result.success) {
          this.result = result.data;
        } else {
          this.error = result.error;
        }
      } catch (e) {
        console.error(e);
        this.error = '操作失败';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.pickupCode = '';
      this.result = null;
      this.error = '';
    }
  }
};
</script>

<style>
.result-info {
  margin: 16px 0;
}

.result-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.pickup-code {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b00;
}
</style>
