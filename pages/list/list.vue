<template>
  <view>
      <view class="search" :style="{'padding-top':navheight+10+'px'}">
         
          <text>咔咔饮品</text>
           <uni-icons type="search" size="23" color="#4558ad" @tap="search()"></uni-icons>
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
                <text  class="text price">￥{{ item.cat_price }}<text class="ftitle"> 起</text></text>
            </view>
            
            <view class="item-right">
              <button  @click=" toggle(index)">选规格</button>
              
              <!-- 弹出框 -->
              <uni-popup ref="popup" type="bottom" background-color="#fff" class='popup-box'>
                  <scroll-view>
                  <view class="dialog-a">
                    <view class="dialog-img">  
                        <image :src="item.cat_img"></image>
                    </view>
                    <view class="dialog-text">
                        <view class="title">{{ item.cat_title}}</view>
                        <view class="text">{{ item.cat_int }}</view>
                    </view>
                    <view class="dialog-int">
                        <text class="int-text">杯型</text>
                        <uni-data-checkbox   mode="tag" :localdata="range" @change="change" 
                        selectedTextColor="#fff" selectedColor="#4558ad">
                         </uni-data-checkbox>
                    </view>
                    <view class="dialog-int">
                        <text>甜度</text>
                        <uni-data-checkbox mode="tag" :localdata="rangeb"  
                        selectedTextColor="#fff" selectedColor="#4558ad">
                        </uni-data-checkbox>
                    </view>
                    
                  </view>
                  </scroll-view>
                 <!-- 2按钮 -->
                 
                 <uni-card class='dialog-body' >
                     <view class="body-header">
                        <text>￥{{ item.cat_price }}</text>
                        <uni-number-box @change="changeValue" min="1" max="99"></uni-number-box>
                     </view>
                     <view class="body-bottom">
                          <button>立即购买</button>
                         <button>加入购物车</button>
                     </view>
                 </uni-card>
                
              </uni-popup>
              
              
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
                wh: 0,
                navheight:0,
                range: [{"value": 0,"text": "M杯"},{"value": 1,"text": "L杯"}],
                rangeb: [{"value": 0,"text": "7分糖"},{"value": 1,"text": "不加糖"},{"value": 2,"text": "3分糖"}],
               
            };
        },
        onLoad() {
            this.getMenu()
             // 获取当前系统的信息
            const sysInfo = uni.getSystemInfoSync()
            // 为 wh 窗口可用高度动态赋值
            this.wh = sysInfo.windowHeight
            //导航高度
            this.navheight = sysInfo.statusBarHeight
           
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
                
            search(){
                uni.navigateTo({
                   url:'/subpkg/search/search',
                    fail: () => {'跳转搜索页面失败'}
                });
            },
            //弹出框
            toggle(index) {
                this.$refs.popup[index].open()
            },
            change(e){
            				console.log('e:',e);
            },
            changeValue(value) {
                            console.log('返回数值：', value);
            }
        }
    }
</script>

<style lang="scss">
    $mian-color: #4558ad ;
    $mg-left: 20rpx;
    $bg-right-color: #ffffff ;
    $bg-left-color: #f7f7f7;
    $text-color: #707070;
    $border-css: #d2d2d2 1rpx solid;
    $button-bg: $bg-right-color !important;
.search{
    margin-left: 30rpx;
    font-size: 35rpx;
    font-weight: bolder;
    color:$mian-color;
        
    uni-icons{
        margin-left: 45%;
    }
}
.scroll-view-container {
    border-top: $mian-color solid 10rpx;
    margin-top: $mg-left;
    background-color: $bg-right-color;
    display: flex;
    letter-spacing: 2rpx;
  
  .left-scroll-view {
    width: 100px;

    .left-scroll-view-item {
      line-height: 70px;
      background-color: $bg-left-color;
      text-align: center;
      font-size: 12px;
     
      
      // 激活时 项的样式
      &.active {
        background-color: $bg-right-color;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 80%;
          background-color: $mian-color;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  
.right-scroll-view-item{
    background-color: $bg-right-color;
    height: 100px;
    margin: 20rpx 0 0 2%;
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
          color: $text-color;
      }
          
      .price{
         margin: 75rpx 20rpx 0 0;
        font-size: 35rpx;
        font-weight: bolder;
      }
  }
    .item-right{
      width: 25%;
      height: 100%;
     
      button{
          margin-top:100%;
          width: 95%;
          height: 20%;
          background-color: $mian-color;
          color: $bg-right-color;
          font-size:22rpx;
          line-height:20px;
      }
      
      // 弹出框
      .dialog-a{
          border-radius: 100rpx;
          margin:0 30rpx;
          margin-bottom: 20% !important;
          .dialog-img{
              height: 250rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 20rpx 0;
          }
          .dialog-text{
              height: 180rpx;
              .title{
                   font-size: 40rpx;
                   font-weight: bolder;
                   margin-bottom: $mg-left;
              }
              .text{
                  font-size: $mg-left;
                  color: $text-color;
              }
          }
          .dialog-int{
              margin:10rpx 0 20rpx 0; 
              height: 150rpx;
             
              .int-text{
                  margin-bottom: 50rpx;
              }
          }

      }
  }
      .uni-card{
          margin: 0 !important;
      }

      .dialog-body{
        width: 100%;
        position: absolute;
        bottom:  -7% !important;
         .body-header{
             color: #000;
             font-size: 20px;
             font-weight: bold;
             margin:10rpx;
             display: flex;
             justify-content: space-between;
             
             .uni-numbox__minus {
                 border:  $border-css;
                 background-color:  $button-bg;
                 border-radius: $mg-left 0  0 $mg-left;
                 
             }
             .uni-numbox__value {
                 margin: 0 !important;
                 background-color: $button-bg;
                 border: $border-css;
             }
             .uni-numbox__plus {
                  border: $border-css;
                  background-color: $button-bg;
                  border-radius: 0 $mg-left   $mg-left 0;
                 
                 }
                 .uni-numbox--text {
                      color: $mian-color !important;
                 }
         }

         .body-bottom{
             margin:15rpx;
            display: flex;
            justify-content: space-around;
            
            button{
                margin: 30rpx 0 0 10rpx !important;
                width: 45%;
                height: 70rpx;
                line-height: 70rpx;
                border-radius: 40rpx;
                 font-size: 27rpx;
             }
         }
    }
  
}
}
</style>
