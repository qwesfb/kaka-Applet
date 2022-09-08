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
            <!-- 用户未登录时，显示登录组件 -->
             <my-login v-if="!token"></my-login>
            
             <!-- 用户登录后，显示用户信息组件 -->
            <my-userinfo v-else></my-userinfo>
        </view>
        
        <view class="order box">
            <view class="order-item" style="border-right: 5rpx #A9A9A9 dashed;">
             
                <text class="order-item-text">到店自取</text>
                <image src="../../static/order.png" style="transform: rotate(0);"></image>
                
            </view>
            <view class="order-item">
                <text class="order-item-text">外卖上门</text>
                <image src="../../static/list.png"></image>
            </view>
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
        import { mapState } from 'vuex'
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
        computed: {
            //导入token字符串
            ...mapState('m_user',['token'])
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
        .top-box{
            background-color: #fff;
            height: 100% !important;
            margin-left: 10rpx !important;
        }
        .avatar{
            margin: 20rpx !important;
            width: 60px !important;
            height: 60px !important;
        }
        .uni-icons{
            font-size: 73px !important;
        }
        .nickname{
            color: #000 !important;
        }
    }
    .order{
        height: 350rpx;
        margin-top: 120rpx;
        display: flex;
        .order-item{
            width: 48%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            .order-item-text{
                font-size: 50rpx;
                font-weight: bolder;
            }
            image{
                width: 100px;
                height: 100px;
                transform: rotateZ(37deg);
            }
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
