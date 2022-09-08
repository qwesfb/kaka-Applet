<template>
    
  <view class="right-scroll-view-item" >
    <!-- 商品左侧图片区域 -->
    <radio :checked="goods.goods_state" color="#4558ad"  style="transform:scale(0.7)"  @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="img"></image>
    
    <!-- 商品右侧信息区域 -->
    <view class="container-right">
      <!-- 商品标题 -->
      <view class="container">
       <view class="text title">{{goods.goods_name}}</view>
       <view class="text ftitle"> {{goods.goods_content}} </view>
     </view>
     <view class="item-right">
         <text class="text price">￥{{goods.goods_price}}</text>
           <uni-number-box  min="1" max="99" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
     </view>
      </view>
    </view> 
</template>

<script>
  export default {
    // 定义 props 属性，用来接收外界传递到当前组件的数据
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        defaul: {},
      },
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      }
    },
    methods: {
       radioClickHandler() {
            // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
                // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
                this.$emit('radio-change', {
                  // 商品的 Id
                  goods_id: this.goods.goods_id,
                  // 商品最新的勾选状态
                  goods_state: !this.goods.goods_state
                })
        },
        
           // NumberBox 组件的 change 事件处理函数
        numChangeHandler(val) {
          // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
          this.$emit('num-change', {
            // 商品的 Id
            goods_id: this.goods.goods_id,
            // 商品的最新数量
            goods_count: +val
          })
        }
    },
   
  }
</script>

<style lang="scss">
 
    $mian-color: #4558ad ;
    $mg-left: 20rpx;
    $bg-right-color: #ffffff ;
    $bg-left-color: #f6f6f6;
    $text-color: #a8a8a8;
    $border-css: #d2d2d2 1rpx solid;
    $button-bg: $bg-right-color !important;
    
  .right-scroll-view-item{
      background-color: $bg-right-color;
      height: 100px;
      margin: $mg-left 0 $mg-left 2%;
      display: flex;
      align-items: center;
      padding:2%;
      padding-left: 0;
      
      .img{
        height: 100%;
        width: 25%;
        margin-left: 5px;
        border-radius: $mg-left;
      }
      .container-right{
          margin-left: $mg-left;
          width: 66%;
          height: 100%;
          .text{
              margin-top: 2%;
              display: block
          }
          .container{ 
              height: 50%;
              margin:  $mg-left 0;
          }
          .title{
              font-size: 30rpx;
              font-weight: bolder;
            
          }
          .ftitle{
             font-size: 23rpx;
             color: $text-color;
         }
  
      .item-right{
           height: 35%;
          display: flex;
          align-items: center;
          justify-content: space-between;
       .price{
          font-size: 35rpx;
          font-weight: bolder;
       } 
     }
  }
  }
</style>