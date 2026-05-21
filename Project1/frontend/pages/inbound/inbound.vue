<template>
  <view class="container">
    <view class="card">
      <view class="input-item">
        <label>运单号 *</label>
        <input v-model="form.trackingNumber" placeholder="请输入运单号" />
      </view>
      
      <view class="input-item">
        <label>快递公司 *</label>
        <input v-model="form.courierCompany" placeholder="请输入快递公司" />
      </view>
      
      <view class="input-item">
        <label>收件人姓名 *</label>
        <input v-model="form.recipientName" placeholder="请输入收件人姓名" />
      </view>
      
      <view class="input-item">
        <label>收件人电话 *</label>
        <input v-model="form.recipientPhone" placeholder="请输入收件人电话" type="number" />
      </view>
      
      <view class="input-item">
        <label>货架位置 *</label>
        <input v-model="form.shelfLocation" placeholder="例如：A-01" />
      </view>
      
      <view class="input-item">
        <label>备注</label>
        <input v-model="form.remark" placeholder="选填" />
      </view>
      
      <button class="btn-primary" @click="handleInbound" :disabled="loading">
        {{ loading ? '提交中...' : '确认入库' }}
      </button>
    </view>
    
    <view v-if="result" class="card result-card">
      <text class="result-title">入库成功！</text>
      <view class="result-info">
        <text class="label">取件码：</text>
        <text class="pickup-code">{{ result.pickupCode }}</text>
      </view>
      <view class="result-info">
        <text class="label">收件人：</text>
        <text>{{ result.recipientName }}</text>
      </view>
      <view class="result-info">
        <text class="label">货架位置：</text>
        <text>{{ result.shelfLocation }}</text>
      </view>
      <button class="btn-success" @click="resetForm">继续入库</button>
    </view>
  </view>
</template>

<script>
import { expressApi } from '../../utils/api.js';

export default {
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
    async handleInbound() {
      if (!this.form.trackingNumber || !this.form.courierCompany || 
          !this.form.recipientName || !this.form.recipientPhone || 
          !this.form.shelfLocation) {
        uni.showToast({ title: '请填写必填项', icon: 'none' });
        return;
      }
      
      this.loading = true;
      try {
        const res = await expressApi.inbound(this.form);
        this.result = res.data;
        uni.showToast({ title: '入库成功', icon: 'success' });
      } catch (e) {
        console.error(e);
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

<style scoped>
.container {
  padding: 30rpx;
}

.result-card {
  margin-top: 30rpx;
  background: #f0f9ff;
  border: 2rpx solid #007aff;
}

.result-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #007aff;
  display: block;
  text-align: center;
  margin-bottom: 30rpx;
}

.result-info {
  display: flex;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.label {
  color: #666;
  width: 160rpx;
}

.pickup-code {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff6b00;
}

.btn-success {
  margin-top: 20rpx;
}
</style>
