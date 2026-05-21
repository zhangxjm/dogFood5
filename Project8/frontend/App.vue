<script>
export default {
    onLaunch: function() {
        console.log('App Launch')
    },
    onShow: function() {
        console.log('App Show')
    },
    onHide: function() {
        console.log('App Hide')
    }
}
</script>

<style>
page {
    background-color: #f5f5f5;
}
.container {
    padding: 20rpx;
}
.card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 50rpx;
}
.btn-success {
    background: #52c41a;
    color: #fff;
    border: none;
    border-radius: 50rpx;
}
.text-primary {
    color: #667eea;
}
.text-success {
    color: #52c41a;
}
.text-warning {
    color: #faad14;
}
.text-danger {
    color: #ff4d4f;
}
.text-gray {
    color: #999;
}
.flex {
    display: flex;
}
.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
.flex-column {
    display: flex;
    flex-direction: column;
}
</style>
