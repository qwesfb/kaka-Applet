<template>
    <view class="order-box">
       
        <text class="item-text">你暂时没有订单~</text>
        <button class="item-btn" @tap="buy()">点击下单</button>
       
    </view>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        methods: {
          buy(){
              //跳转tabBar的路径
              uni.switchTab({
                  url:'/pages/list/list'
              })
          },
        }
    }
</script>

<style lang="scss">
.order-box{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;

    .item-text{
        color: #a8a8a8;
        display: block;
        margin: 25rpx;
    }
    .item-btn{
        background-color: #4558ad;
        width: 50vw;
        color: #fff;
        border-radius: 40rpx;
    }
}
</style>
