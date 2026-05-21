<template>
  <div class="container page-content">
    <button class="back-btn" @click="goBack">← 返回</button>
    <h1 class="page-title">📦 快递入库</h1>
    
    <div class="card">
      <div class="input-group">
        <label>运单号 *</label>
        <input v-model="form.trackingNumber" placeholder="请输入运单号" />
      </div>
      
      <div class="input-group">
        <label>快递公司 *</label>
        <input v-model="form.courierCompany" placeholder="请输入快递公司" />
      </div>
      
      <div class="input-group">
        <label>收件人姓名 *</label>
        <input v-model="form.recipientName" placeholder="请输入收件人姓名" />
      </div>
      
      <div class="input-group">
        <label>收件人电话 *</label>
        <input v-model="form.recipientPhone" placeholder="请输入收件人电话" type="tel" />
      </div>
      
      <div class="input-group">
        <label>货架位置 *</label>
        <input v-model="form.shelfLocation" placeholder="例如：A-01" />
      </div>
      
      <div class="input-group">
        <label>备注</label>
        <input v-model="form.remark" placeholder="选填" />
      </div>
      
      <button 
        class="btn btn-primary btn-block" 
        @click="handleInbound" 
        :disabled="loading"
      >
        {{ loading ? '提交中...' : '确认入库' }}
      </button>
    </div>
    
    <div v-if="result" class="card">
      <div class="success-message">
        ✅ 快递入库成功！
      </div>
      <div class="result-info">
        <p><strong>取件码：</strong><span class="pickup-code">{{ result.pickupCode }}</span></p>
        <p><strong>收件人：</strong>{{ result.recipientName }}</p>
        <p><strong>货架位置：</strong>{{ result.shelfLocation }}</p>
      </div>
      <button class="btn btn-success btn-block" @click="resetForm">继续入库</button>
    </div>
  </div>
</template>

<script>
import { expressApi } from '../utils/api.js';

export default {
  name: 'InboundPage',
  data() {
    return {
      form: {
        trackingNumber: '',
        courierCompany: '',
        recipientName: '',
        recipientPhone: '',
        shelfLocation: '',
        remark: ''
      },
      loading: false,
      result: null
    };
  },
  methods: {
    goBack() {
      this.$emit('goBack');
    },
    async handleInbound() {
      if (!this.form.trackingNumber || !this.form.courierCompany || 
          !this.form.recipientName || !this.form.recipientPhone || 
          !this.form.shelfLocation) {
        alert('请填写必填项');
        return;
      }
      
      this.loading = true;
      try {
        const result = await expressApi.inbound(this.form);
        if (result.success) {
          this.result = result.data;
        } else {
          alert(result.error);
        }
      } catch (e) {
        console.error(e);
        alert('操作失败');
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        trackingNumber: '',
        courierCompany: '',
        recipientName: '',
        recipientPhone: '',
        shelfLocation: '',
        remark: ''
      };
      this.result = null;
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
