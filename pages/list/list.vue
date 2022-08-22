<template>
  <view>
      <view class="search" >
          <text>咔咔饮品</text>
          <uni-search-bar radius="100" @confirm="search" clearButton="none" cancelButton="none"  />
      	</view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
          <view  v-for="(item, i) in memuList" :key="i">
            <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activemenu(i)">
            {{item.cat_name}}
            </view>
            </view>
      </scroll-view>
      
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view class="right-scroll-view-item" v-for=" (item,index) in menuRight" :key="index">
           <image :src="item.cat_img"></image>
            <view class="container">
                <text  class="text title">{{ item.cat_title}}</text>
                <text  class="text ftitle">[{{ item. cat_text }}]</text>
                <text  class="text price">￥{{ item.cat_price }}<text class="ftitle">起</text></text>
                
            </view>
            <view class="item-right">
              <button  @click="choice()">选规格</button>
            <!-- <uni-popup ref="popup" type="bottom" background-color="#fff">tc</uni-popup> -->
            </view>
        </view>
      </scroll-view>
    </view>
 
  </view>
</template>

<script>
    export default {
        data() {
            return {
                memuList:[],
                active:0,
                menuRight:[],
                // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
                wh: 0
            };
        },
        onLoad() {
            this.getMenu()
             // 获取当前系统的信息
            const sysInfo = uni.getSystemInfoSync()
            // 为 wh 窗口可用高度动态赋值
            this.wh = sysInfo.windowHeight
        },
        methods: {
            async getMenu(){
                const { data : res } = await uni.$http.get(`/kaka/v1/menu`)
                this.memuList = res.message
                this.menuRight = res.message[0].children
            },
            //动态判断-样式
            activemenu(i){
                this.active = i
                this.getMenu()
            },
            choice(){
               
            }
        }
    }
</script>

<style lang="less">
.search{
    margin: 6vh 0 20rpx 0;
    
    height: 6vh;
    color: #4558ad;
    display: flex;
    align-items: center;
    font-weight:bolder;
    width: 80;
    margin-left: 10rpx;
}
.scroll-view-container {
  display: flex;
  letter-spacing: 2rpx;
  
  .left-scroll-view {
    width: 100px;

    .left-scroll-view-item {
      line-height: 70px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;
     
      
      // 激活时 项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 80%;
          background-color: #4558ad;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  
    .right-scroll-view-item{
      height: 100px;
      margin-left: 2%;
      display: flex;
      padding:2%;
      
     image{
          height: 100%;
          width: 30%;
      }
 
         
      .container{ 
          width: 45%;
          .text{
              margin-top: 2%;
              margin-left: 5%;
              display: block
          }
          .title{
               font-size: 30rpx;
              font-weight: bolder;
          }
          .ftitle{
              font-size: 15rpx;
              color: #707070;
          }
              
          .price{
             margin: 80rpx 20rpx 0 0;
              font-size: 40rpx;
          }
      }
      .item-right{
          width: 25%;
          height: 100%;
         
          button{
              margin-top:110%;
              width: 95%;
              height: 20%;
              background-color: #4558ad;
              color: #ffffff;
              font-size:22rpx;
              line-height:20px;
          }
      }
  }
}
</style>
