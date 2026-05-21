<template>
    <view class="login-container">
        <view class="logo-section">
            <view class="logo-icon">
                <text class="logo-text">团</text>
            </view>
            <text class="app-name">社区团购团长端</text>
        </view>
        
        <view class="form-section">
            <view class="form-item">
                <input class="input" type="tel" v-model="phone" placeholder="请输入手机号" maxlength="11" />
            </view>
            <view class="form-item">
                <input class="input" type="password" v-model="password" placeholder="请输入密码" />
            </view>
            
            <button class="login-btn" @click="handleLogin">登录</button>
            
            <view class="tip">
                <text>默认账号：13800138000 / 密码：123456</text>
            </view>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            phone: '13800138000',
            password: '123456'
        }
    },
    methods: {
        async handleLogin() {
            if (!this.phone || !this.password) {
                uni.showToast({ title: '请输入账号密码', icon: 'none' })
                return
            }
            
            try {
                const res = await request({
                    url: '/auth/login',
                    method: 'POST',
                    data: {
                        phone: this.phone,
                        password: this.password
                    }
                })
                
                uni.setStorageSync('leaderInfo', res.data)
                uni.showToast({ title: '登录成功', icon: 'success' })
                
                setTimeout(() => {
                    uni.switchTab({ url: '/pages/index/index' })
                }, 1000)
            } catch (e) {
                console.error(e)
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 100rpx 60rpx;
}
.logo-section {
    text-align: center;
    margin-bottom: 100rpx;
}
.logo-icon {
    width: 160rpx;
    height: 160rpx;
    background: #fff;
    border-radius: 50%;
    margin: 0 auto 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.15);
}
.logo-text {
    font-size: 80rpx;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    color: transparent;
}
.app-name {
    color: #fff;
    font-size: 36rpx;
    font-weight: 500;
}
.form-section {
    background: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
}
.form-item {
    margin-bottom: 40rpx;
    border-bottom: 2rpx solid #f0f0f0;
    padding-bottom: 20rpx;
}
.input {
    font-size: 32rpx;
    padding: 20rpx 0;
}
.login-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
    margin-top: 40rpx;
}
.tip {
    margin-top: 40rpx;
    text-align: center;
    color: #999;
    font-size: 24rpx;
}
</style>
