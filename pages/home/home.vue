<template>
    <view>
        <view class="header">
            <swiper :autoplay="true" :interval="3000" :duration="1000" class="swiper">
                <swiper-item v-for="(item,index) in swiperList" :key="index">
                    <view class="swiper-item">
                        <image :src="item.image_src" ></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>
        
        <view class="user box">
            <text> xx </text>
        </view>
        
        <view class="order box">
            <view class="order-item" style="border-right: 5rpx #A9A9A9 dashed;">自取</view>
            <view class="order-item">外卖</view>
        </view>
    
    
        <view class="nav box">
            <view class="nav-item" v-for=" (item, index) in navList" :key="index" :interval="3000">
                <image :src="item.image_src"></image>
                <text>{{ item.name }} </text>
            </view>
        </view>
        
        <view class="card box">
            <swiper :indicator-dots="true" :autoplay="true"  :duration="1000" >
                <swiper-item  v-for="(item,index) in swiperList" :key="index">
                    <view class="card-item">
                          <image :src="item.image_src" ></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                swiperList: [],
                navList:[]
            }
        },
        onLoad() {
            this.getSwiperList()
            this.getNavlist()
        },
        methods: {
            // 获取轮播图数据的方法
              async getSwiperList() {
                const { data: res } = await uni.$http.get('/kaka/v1/home/swiperdata')
                this.swiperList = res.message
              },
              async getNavlist() {
                  const { data:res } = await uni.$http.get(`/kaka/v1/home/nav`)
                  this.navList = res.message
              }
              
        },
    }
    
</script>

<style lang="less">
    swiper{
        height: 500rpx;
        
        .swiper-item{
            width: 100%;
            height: 100%;
        }
            
        .swiper-item image{
            height: 100%;
            width: 100%;
        }
    }
  
    .box{
        background-color: #fff;
        border-radius: 15rpx;
        width: 92vw;
        margin-left:4%;
        margin-top: 80rpx;
    }
    
    .user{
        position: absolute;
        margin-top: -80rpx ;
        z-index: 2;
        height: 150rpx;
    }
    .order{
        height: 350rpx;
        margin-top: 120rpx;
        display: flex;
        .order-item{
            width: 50%;
        }
    }
    
    .nav{
        height: 180rpx;
        margin-top: 40rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 25rpx;
        .nav-item{
            height: 100%;
            display: flex;
            flex-direction:column;
            justify-content:center;
            align-items: center;
        }
        
        .nav-item image{
            width: 70rpx;
            height: 70rpx;
            border-radius: 100rpx;
            margin-bottom: 20rpx;
        }
    }
    
    .card{
        height: 250rpx;
        margin-top: 40rpx;
        swiper{
            height: 100%;
        }
        .card-item{
            width: 100%;
            height: 100%;
        }
        .card-item image{
            width: 100%;
            height: 100%;
            border-radius: 15rpx;
        }
    }
   
  
</style>
