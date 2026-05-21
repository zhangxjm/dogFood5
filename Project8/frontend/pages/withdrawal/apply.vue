<template>
    <view class="container">
        <view class="balance-card">
            <text class="label">可提现余额(元)</text>
            <text class="amount">¥{{ balance }}</text>
            <view class="tip">提现预计1-3个工作日到账</view>
        </view>
        
        <view class="form-section">
            <view class="form-item">
                <text class="label">提现金额</text>
                <input class="input" type="digit" v-model="form.amount" placeholder="请输入提现金额" />
            </view>
            <view class="quick-amount">
                <view class="amount-btn" @click="quickAmount(10)">¥10</view>
                <view class="amount-btn" @click="quickAmount(50)">¥50</view>
                <view class="amount-btn" @click="quickAmount(100)">¥100</view>
                <view class="amount-btn" @click="quickAmount(balance)">全部</view>
            </view>
            
            <view class="form-item">
                <text class="label">收款方式</text>
                <picker :value="typeIndex" :range="typeOptions" @change="onTypeChange">
                    <view class="picker">{{ typeOptions[typeIndex] }}</view>
                </picker>
            </view>
            
            <view class="form-item">
                <text class="label">收款人姓名</text>
                <input class="input" v-model="form.account_name" placeholder="请输入姓名" />
            </view>
            <view class="form-item">
                <text class="label">收款账号</text>
                <input class="input" v-model="form.account_no" placeholder="请输入账号" />
            </view>
            <view class="form-item" v-if="form.account_type === 3">
                <text class="label">银行名称</text>
                <input class="input" v-model="form.bank_name" placeholder="请输入银行名称" />
            </view>
        </view>
        
        <view class="fee-tip">
            <text>到账金额：¥{{ actualAmount }}  (手续费：¥0.00)</text>
        </view>
        
        <button class="submit-btn" @click="handleSubmit">
            <text>确认提现</text>
        </button>
        
        <view class="history-btn" @click="goHistory">
            <text>查看提现记录</text>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            balance: '0.00',
            typeIndex: 0,
            typeOptions: ['微信', '支付宝', '银行卡'],
            leaderId: null,
            form: {
                amount: '',
                account_type: 1,
                account_name: '',
                account_no: '',
                bank_name: ''
            }
        }
    },
    computed: {
        actualAmount() {
            return this.form.amount || '0.00'
        }
    },
    onShow() {
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
            this.loadBalance()
        }
    },
    methods: {
        async loadBalance() {
            try {
                const res = await request({ url: `/earnings/statistics/${this.leaderId}` })
                this.balance = res.data.available_balance || '0.00'
            } catch (e) {
                console.error(e)
            }
        },
        onTypeChange(e) {
            this.typeIndex = e.detail.value
            this.form.account_type = this.typeIndex + 1
        },
        quickAmount(amount) {
            this.form.amount = String(amount)
        },
        async handleSubmit() {
            if (!this.form.amount || parseFloat(this.form.amount) <= 0) {
                uni.showToast({ title: '请输入提现金额', icon: 'none' })
                return
            }
            if (parseFloat(this.form.amount) > parseFloat(this.balance)) {
                uni.showToast({ title: '余额不足', icon: 'none' })
                return
            }
            if (!this.form.account_name) {
                uni.showToast({ title: '请输入收款人姓名', icon: 'none' })
                return
            }
            if (!this.form.account_no) {
                uni.showToast({ title: '请输入收款账号', icon: 'none' })
                return
            }
            if (this.form.account_type === 3 && !this.form.bank_name) {
                uni.showToast({ title: '请输入银行名称', icon: 'none' })
                return
            }
            
            uni.showModal({
                title: '确认提现',
                content: `确认提现¥${this.form.amount}吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            await request({
                                url: '/withdrawal/apply',
                                method: 'POST',
                                data: { ...this.form, leader_id: this.leaderId }
                            })
                            uni.showToast({ title: '申请成功', icon: 'success' })
                            setTimeout(() => {
                                uni.navigateBack()
                            }, 1000)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            })
        },
        goHistory() {
            uni.navigateTo({ url: '/pages/withdrawal/list' })
        }
    }
}
</script>

<style scoped>
.balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24rpx;
    padding: 50rpx 40rpx;
    text-align: center;
    margin-bottom: 20rpx;
}
.balance-card .label {
    display: block;
    font-size: 26rpx;
    color: rgba(255,255,255,0.8);
    margin-bottom: 16rpx;
}
.balance-card .amount {
    display: block;
    font-size: 56rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
}
.balance-card .tip {
    font-size: 22rpx;
    color: rgba(255,255,255,0.6);
}
.form-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 0 24rpx;
    margin-bottom: 20rpx;
}
.form-item {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}
.form-item:last-child {
    border-bottom: none;
}
.label {
    width: 180rpx;
    font-size: 28rpx;
    color: #333;
}
.input {
    flex: 1;
    font-size: 28rpx;
    text-align: right;
}
.picker {
    flex: 1;
    font-size: 28rpx;
    text-align: right;
    color: #333;
}
.quick-amount {
    display: flex;
    gap: 16rpx;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}
.amount-btn {
    flex: 1;
    text-align: center;
    padding: 16rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #666;
}
.fee-tip {
    background: #fffbeb;
    padding: 20rpx 24rpx;
    border-radius: 8rpx;
    margin-bottom: 30rpx;
}
.fee-tip text {
    font-size: 24rpx;
    color: #e6a23c;
}
.submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
    margin-bottom: 20rpx;
}
.history-btn {
    text-align: center;
    padding: 20rpx;
}
.history-btn text {
    font-size: 26rpx;
    color: #667eea;
}
</style>
