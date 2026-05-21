<template>
    <view class="container">
        <view class="card">
            <view class="form-item">
                <text class="label">儿童姓名</text>
                <input class="input" v-model="form.name" placeholder="请输入儿童姓名" />
            </view>
            
            <view class="form-item">
                <text class="label">性别</text>
                <picker :value="genderIndex" :range="['男', '女']" @change="onGenderChange">
                    <view class="picker">
                        {{ form.gender || '请选择' }}
                    </view>
                </picker>
            </view>
            
            <view class="form-item">
                <text class="label">出生日期</text>
                <picker mode="date" :value="form.birth_date" @change="onBirthChange">
                    <view class="picker">
                        {{ form.birth_date || '请选择' }}
                    </view>
                </picker>
            </view>
            
            <view class="form-item">
                <text class="label">监护人姓名</text>
                <input class="input" v-model="form.guardian_name" placeholder="请输入监护人姓名" />
            </view>
            
            <view class="form-item">
                <text class="label">监护人电话</text>
                <input class="input" v-model="form.guardian_phone" placeholder="请输入联系电话" type="number" />
            </view>
        </view>
        
        <view class="btn mt-20" @click="submit">
            保存
        </view>
    </view>
</template>

<script>
import { addChild } from '@/utils/api.js'

export default {
    data() {
        return {
            genderIndex: -1,
            form: {
                name: '',
                gender: '',
                birth_date: '',
                guardian_name: '',
                guardian_phone: ''
            }
        }
    },
    methods: {
        onGenderChange(e) {
            this.genderIndex = e.detail.value
            this.form.gender = ['男', '女'][e.detail.value]
        },
        onBirthChange(e) {
            this.form.birth_date = e.detail.value
        },
        submit() {
            if (!this.form.name) {
                uni.showToast({ title: '请输入儿童姓名', icon: 'none' })
                return
            }
            if (!this.form.gender) {
                uni.showToast({ title: '请选择性别', icon: 'none' })
                return
            }
            if (!this.form.birth_date) {
                uni.showToast({ title: '请选择出生日期', icon: 'none' })
                return
            }
            if (!this.form.guardian_name) {
                uni.showToast({ title: '请输入监护人姓名', icon: 'none' })
                return
            }
            if (!this.form.guardian_phone) {
                uni.showToast({ title: '请输入联系电话', icon: 'none' })
                return
            }
            
            addChild(this.form).then(res => {
                uni.showToast({
                    title: '添加成功',
                    icon: 'success'
                })
                setTimeout(() => {
                    uni.navigateBack()
                }, 1500)
            })
        }
    }
}
</script>

<style scoped>
.form-item {
    margin-bottom: 30rpx;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
}

.input {
    width: 100%;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
    box-sizing: border-box;
}

.picker {
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
}
</style>
