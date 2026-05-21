<template>
    <view class="container">
        <view class="card">
            <view class="form-item">
                <text class="label">选择日期</text>
                <picker mode="date" :value="selectedDate" @change="onDateChange">
                    <view class="picker-value">
                        <text>{{ selectedDate || '请选择日期' }}</text>
                        <text class="arrow">›</text>
                    </view>
                </picker>
            </view>

            <view class="form-item">
                <text class="label">选择时段</text>
                <view class="slot-list">
                    <view 
                        v-for="slot in timeSlots" 
                        :key="slot.id"
                        class="slot-tag"
                        :class="{ 'active': selectedSlotId === slot.id, 'disabled': slot.reservedPeople >= slot.maxPeople }"
                        @click="selectSlot(slot)"
                    >
                        <text>{{ slot.startTime }}-{{ slot.endTime }}</text>
                        <text class="slot-num">{{ slot.reservedPeople }}/{{ slot.maxPeople }}</text>
                    </view>
                </view>
            </view>

            <view class="form-item">
                <text class="label">游客姓名</text>
                <input type="text" v-model="form.visitorName" placeholder="请输入姓名" class="input" />
            </view>

            <view class="form-item">
                <text class="label">联系电话</text>
                <input type="tel" v-model="form.visitorPhone" placeholder="请输入手机号" class="input" maxlength="11" />
            </view>

            <view class="form-item">
                <text class="label">预约人数</text>
                <view class="people-selector">
                    <text class="btn" @click="decreasePeople">-</text>
                    <text class="people-num">{{ form.peopleCount }}</text>
                    <text class="btn" @click="increasePeople">+</text>
                </view>
            </view>
        </view>

        <button class="submit-btn" @click="submit" :disabled="!canSubmit">
            提交预约
        </button>
    </view>
</template>

<script>
import { request } from '@/utils/request.js'

export default {
    data() {
        return {
            selectedDate: '',
            selectedSlotId: null,
            timeSlots: [],
            form: {
                visitorName: '',
                visitorPhone: '',
                peopleCount: 1
            }
        }
    },
    computed: {
        canSubmit() {
            return this.selectedSlotId && this.form.visitorName && this.form.visitorPhone && this.form.visitorPhone.length === 11
        }
    },
    onLoad(options) {
        const today = new Date()
        this.selectedDate = today.toISOString().split('T')[0]
        this.loadTimeSlots()
        if (options.slotId) {
            this.selectedSlotId = parseInt(options.slotId)
        }
    },
    methods: {
        onDateChange(e) {
            this.selectedDate = e.detail.value
            this.selectedSlotId = null
            this.loadTimeSlots()
        },
        loadTimeSlots() {
            request({
                url: `/time-slot/list?date=${this.selectedDate}`
            }).then(res => {
                this.timeSlots = res
            })
        },
        selectSlot(slot) {
            if (slot.reservedPeople < slot.maxPeople) {
                this.selectedSlotId = slot.id
            }
        },
        decreasePeople() {
            if (this.form.peopleCount > 1) {
                this.form.peopleCount--
            }
        },
        increasePeople() {
            this.form.peopleCount++
        },
        submit() {
            if (!this.canSubmit) {
                uni.showToast({
                    title: '请填写完整信息',
                    icon: 'none'
                })
                return
            }

            request({
                url: '/reservation',
                method: 'POST',
                data: {
                    timeSlotId: this.selectedSlotId,
                    visitorName: this.form.visitorName,
                    visitorPhone: this.form.visitorPhone,
                    peopleCount: this.form.peopleCount
                }
            }).then(res => {
                uni.showToast({
                    title: '预约成功！',
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
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
    border-bottom: none;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    font-weight: 500;
}

.picker-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: #f9f9f9;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
}

.arrow {
    color: #999;
    font-size: 32rpx;
}

.slot-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.slot-tag {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 24rpx;
    background: #f9f9f9;
    border-radius: 12rpx;
    border: 2rpx solid transparent;
    min-width: 120rpx;
}

.slot-tag.active {
    background: #e8f5e9;
    border-color: #4CAF50;
}

.slot-tag.disabled {
    opacity: 0.4;
}

.slot-tag text:first-child {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.slot-num {
    font-size: 22rpx;
    color: #999;
    margin-top: 4rpx;
}

.input {
    width: 100%;
    padding: 20rpx;
    background: #f9f9f9;
    border-radius: 12rpx;
    font-size: 28rpx;
}

.people-selector {
    display: flex;
    align-items: center;
    gap: 30rpx;
}

.people-selector .btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f0f0f0;
    border-radius: 50%;
    font-size: 36rpx;
    color: #666;
}

.people-num {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    min-width: 60rpx;
    text-align: center;
}

.submit-btn {
    width: 100%;
    margin-top: 40rpx;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    border: none;
    border-radius: 50rpx;
    padding: 28rpx;
    font-size: 32rpx;
}

.submit-btn[disabled] {
    opacity: 0.5;
}
</style>
