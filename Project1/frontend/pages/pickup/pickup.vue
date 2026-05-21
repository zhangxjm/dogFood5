<template>
  <view class="container">
    <view class="card">
      <text class="card-title">扫码取件</text>
      <button class="btn-primary scan-btn" @click="scanCode">
        📷 扫描取件码
      </button>
    </view>
    
    <view class="card">
      <text class="card-title">手动输入取件码</text>
      <view class="input-item">
        <input v-model="pickupCode" placeholder="请输入取件码" maxlength="6" />
      </view>
      <button class="btn-success" @click="handlePickup" :disabled="loading">
        {{ loading ? '核销中...' : '确认取件' }}
      </button>
    </view>
    
    <view v-if="result" class="card result-card">
      <text class="result-title success">取件成功！</text>
      <view class="result-info">
        <text class="label">取件码：</text>
        <text class="pickup-code">{{ result.pickupCode }}</text>
      </view>
      <view class="result-info">
        <text class="label">收件人：</text>
        <text>{{ result.recipientName }}</text>
      </view>
      <view class="result-info">
        <text class="label">快递公司：</text>
        <text>{{ result.courierCompany }}</text>
      </view>
      <button class="btn-primary" @click="resetForm">继续取件</button>
    </view>
  </view>
</template>

<script>
import { expressApi } from '../../utils/api.js';

export default {
  data() {
    return {
      pickupCode: '',
      loading: false,
      result: null
    };
  },
  methods: {
    scanCode() {
      uni.scanCode({
        success: async (res) => {
          const scanData = res.result;
          this.loading = true;
          try {
            const result = await expressApi.scan({ scanData });
            this.result = result.data;
            uni.showToast({ title: '取件成功', icon: 'success' });
          } catch (e) {
            console.error(e);
          } finally {
            this.loading = false;
          }
        },
        fail: (err) => {
          console.error('扫码失败', err);
          uni.showToast({ title: '扫码失败', icon: 'none' });
        }
      });
    },
    async handlePickup() {
      if (!this.pickupCode) {
        uni.showToast({ title: '请输入取件码', icon: 'none' });
        return;
      }
      
      this.loading = true;
      try {
        const res = await expressApi.pickup({ pickupCode: this.pickupCode.toUpperCase() });
        this.result = res.data;
        uni.showToast({ title: '取件成功', icon: 'success' });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.pickupCode = '';
      this.result = null;
    }
  }
};
</script>

<style scoped>
.container {
  padding: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 30rpx;
}

.scan-btn {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  font-size: 32rpx;
}

.result-card {
  margin-top: 30rpx;
  background: #f0fff4;
  border: 2rpx solid #4cd964;
}

.result-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-bottom: 30rpx;
}

.result-title.success {
  color: #4cd964;
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
</style>
