<template>
    <view class="cart-box">
        
        <view class="cart-item">
           <uni-badge class="uni-badge-left-margin" :text="count" absolute="rightTop" :offset="[-3, -3]" >
           		<image class="bag" src="../../static/bag.png" @tap.native="opengoods"></image>
           	</uni-badge>
            <text>￥{{ checkedGoodsAmount }}</text>
        </view>
        <button class="cart-item-right" @click="pay">
            <text>去结算</text>
        </button>
    </view>
</template>

<script>
    import { mapGetters } from "vuex"
    export default {
        name:"my-cart",
        data() {
            return {
                //购物袋商品数量
                count:0,
            };
        },
        computed:{
             ...mapGetters('m_cart', ['total','checkedCount','checkedGoodsAmount']),
        }
    }
</script>

<style lang="scss">
.cart-box{
    display: flex;
     width: 100%;
   
    .cart-item{
        width: 75%;
        border-radius: 60rpx 0 0 60rpx;
        background-color: #323232;
        display:flex;
        align-items: center;
        .uni-badge--error {
            background-color: #4558ad;
        }

        .bag{
            width: 80rpx;
            height: 80rpx;
            margin-left:20rpx*2;
        }
    }
    .cart-item-right{
        background-color: #4558ad;
        width: 25%;
        color: #ffffff;
        line-height: 100rpx;
        letter-spacing: 3rpx;
        border-radius: 0 60rpx 60rpx 0;
        padding-left: 10rpx

    }
}
</style>