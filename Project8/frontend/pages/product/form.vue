<template>
    <view class="container">
        <view class="form-section">
            <view class="form-item">
                <text class="label">商品名称</text>
                <input class="input" v-model="form.name" placeholder="请输入商品名称" />
            </view>
            <view class="form-item">
                <text class="label">商品分类</text>
                <picker :value="categoryIndex" :range="categoryNames" @change="onCategoryChange">
                    <view class="picker">{{ categoryNames[categoryIndex] || '请选择' }}</view>
                </picker>
            </view>
            <view class="form-item">
                <text class="label">售价</text>
                <input class="input" type="digit" v-model="form.price" placeholder="请输入售价" />
            </view>
            <view class="form-item">
                <text class="label">佣金比例(%)</text>
                <input class="input" type="digit" v-model="form.commission_rate" placeholder="请输入佣金比例" />
            </view>
            <view class="form-item">
                <text class="label">库存数量</text>
                <input class="input" type="number" v-model="form.stock" placeholder="请输入库存" />
            </view>
            <view class="form-item">
                <text class="label">计量单位</text>
                <input class="input" v-model="form.unit" placeholder="如：件、斤、盒" />
            </view>
            <view class="form-item">
                <text class="label">商品描述</text>
                <textarea class="textarea" v-model="form.description" placeholder="请输入商品描述" />
            </view>
        </view>
        
        <button class="submit-btn" @click="handleSubmit">
            <text>{{ id ? '保存修改' : '添加商品' }}</text>
        </button>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            id: null,
            categoryIndex: 0,
            categories: [],
            categoryNames: [],
            form: {
                name: '',
                category_id: 0,
                price: '',
                commission_rate: 10,
                stock: 0,
                unit: '件',
                description: ''
            }
        }
    },
    onLoad(options) {
        if (options.id) {
            this.id = options.id
            this.loadDetail()
        }
        this.loadCategories()
        
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
        }
    },
    methods: {
        async loadCategories() {
            try {
                const res = await request({ url: '/product/categories' })
                this.categories = res.data
                this.categoryNames = this.categories.map(c => c.name)
            } catch (e) {
                console.error(e)
            }
        },
        async loadDetail() {
            try {
                const res = await request({ url: `/product/detail/${this.id}` })
                Object.assign(this.form, res.data)
                const idx = this.categories.findIndex(c => c.id === res.data.category_id)
                if (idx >= 0) this.categoryIndex = idx
            } catch (e) {
                console.error(e)
            }
        },
        onCategoryChange(e) {
            this.categoryIndex = e.detail.value
            this.form.category_id = this.categories[this.categoryIndex]?.id || 0
        },
        async handleSubmit() {
            if (!this.form.name) {
                uni.showToast({ title: '请输入商品名称', icon: 'none' })
                return
            }
            if (!this.form.price) {
                uni.showToast({ title: '请输入售价', icon: 'none' })
                return
            }
            
            try {
                const data = { ...this.form, leader_id: this.leaderId }
                if (this.id) {
                    await request({
                        url: `/product/edit/${this.id}`,
                        method: 'PUT',
                        data
                    })
                    uni.showToast({ title: '修改成功', icon: 'success' })
                } else {
                    await request({
                        url: '/product/add',
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
.picker {
    flex: 1;
    font-size: 28rpx;
    text-align: right;
    color: #333;
}
.textarea {
    flex: 1;
    font-size: 28rpx;
    min-height: 150rpx;
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
