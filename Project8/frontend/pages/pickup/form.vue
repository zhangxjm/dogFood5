<template>
    <view class="container">
        <view class="form-section">
            <view class="form-item">
                <text class="label">自提点名称</text>
                <input class="input" v-model="form.name" placeholder="请输入自提点名称" />
            </view>
            <view class="form-item">
                <text class="label">详细地址</text>
                <input class="input" v-model="form.address" placeholder="请输入详细地址" />
            </view>
            <view class="form-item">
                <text class="label">省份</text>
                <input class="input" v-model="form.province" placeholder="请输入省份" />
            </view>
            <view class="form-item">
                <text class="label">城市</text>
                <input class="input" v-model="form.city" placeholder="请输入城市" />
            </view>
            <view class="form-item">
                <text class="label">区县</text>
                <input class="input" v-model="form.district" placeholder="请输入区县" />
            </view>
            <view class="form-item">
                <text class="label">联系人</text>
                <input class="input" v-model="form.contact_name" placeholder="请输入联系人姓名" />
            </view>
            <view class="form-item">
                <text class="label">联系电话</text>
                <input class="input" type="tel" v-model="form.contact_phone" placeholder="请输入联系电话" />
            </view>
            <view class="form-item">
                <text class="label">营业时间</text>
                <input class="input" v-model="form.business_hours" placeholder="如：08:00-20:00" />
            </view>
        </view>
        
        <button class="submit-btn" @click="handleSubmit">
            <text>{{ id ? '保存修改' : '添加自提点' }}</text>
        </button>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            id: null,
            leaderId: null,
            form: {
                name: '',
                address: '',
                province: '',
                city: '',
                district: '',
                contact_name: '',
                contact_phone: '',
                business_hours: ''
            }
        }
    },
    onLoad(options) {
        if (options.id) {
            this.id = options.id
            this.loadDetail()
        }
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
        }
    },
    methods: {
        async loadDetail() {
            try {
                const res = await request({ url: `/pickup/detail/${this.id}` })
                Object.assign(this.form, res.data)
            } catch (e) {
                console.error(e)
            }
        },
        async handleSubmit() {
            if (!this.form.name) {
                uni.showToast({ title: '请输入自提点名称', icon: 'none' })
                return
            }
            if (!this.form.address) {
                uni.showToast({ title: '请输入详细地址', icon: 'none' })
                return
            }
            if (!this.form.contact_name || !this.form.contact_phone) {
                uni.showToast({ title: '请输入联系人信息', icon: 'none' })
                return
            }
            
            try {
                const data = { ...this.form, leader_id: this.leaderId }
                if (this.id) {
                    await request({
                        url: `/pickup/edit/${this.id}`,
                        method: 'PUT',
                        data
                    })
                    uni.showToast({ title: '修改成功', icon: 'success' })
                } else {
                    await request({
                        url: '/pickup/add',
                        method: 'POST',
                        data
                    })
                    uni.showToast({ title: '添加成功', icon: 'success' })
                }
                setTimeout(() => {
                    uni.navigateBack()
                }, 1000)
            } catch (e) {
                console.error(e)
            }
        }
    }
}
</script>

<style scoped>
.form-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 0 24rpx;
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
.submit-btn {
    margin-top: 40rpx;
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
}
</style>
