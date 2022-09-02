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
           <image :src="item.cat_img" class="img"></image>
           <view class="container-right">
            <view class="container">
                <text  class="text title">{{ item.cat_title}}</text>
                <text  class="text ftitle">[{{ item. cat_text }}]</text>
            </view>
            <view class="item-right">
                <text  class="text price">￥{{ item.cat_price }}
                    <text class="ftitle" style="margin-left: 10rpx;"> 起</text>
                </text>
           
            
          
              <button class="btns" @click=" toggle(index)">选规格</button>
              
              <!-- 弹出框 -->
              <uni-popup ref="popup"  v-show="show" type="bottom" background-color="#fff" class='popup-box'>
                  <scroll-view>
                  <view class="dialog-a">
                    <view class="dialog-img">  
                        <image :src="item.cat_img" class="img"></image>
                    </view>
                    <view class="dialog-text">
                        <view class="title">{{ item.cat_title}} 
                        <view class="favi">
                            <uni-icons type="heart" size="20"></uni-icons>
                            <text>收藏</text>
                        </view>
                       </view>
                        <view class="text">{{ item.cat_int }}</view>
                    </view>
                    <view class="dialog-int">
                        <text class="int-text">杯型</text>
                        <uni-data-checkbox v-model="value" mode="tag" :localdata="range"
                        selectedTextColor="#fff" selectedColor="#4558ad" @change="change(item.cat_price)">
                         </uni-data-checkbox>
                    </view>
                    <view class="dialog-int">
                        <text>甜度</text>
                        <uni-data-checkbox mode="tag" :localdata="rangeb"  v-model="sweetValue"
                        selectedTextColor="#fff"  selectedColor="#4558ad" @change="changeValue() ">
                        </uni-data-checkbox>
                    </view>
                    
                  </view>
                  </scroll-view>
                  
                 <!-- 2按钮 -->
                 <uni-card class='dialog-body' >
                     <view class="body-header">
                        <view class="body-text">
                            <text>￥{{ price }} </text>
                            <view class="body-text-min">
                            <text  v-for="(item,i) in goodsInt" :key="i">{{ item }}</text>
                           </view>
                        </view>
                        <uni-number-box @change="changeValue" min="1" max="99"></uni-number-box>
                     </view>
                     <view class="body-bottom">
                          <button class="btns">立即购买</button>
                          <button class="btns" @tap="cat(item)"> 加入购物车</button>
                     </view>
                 </uni-card>
                
              </uni-popup>
              
              
            </view>
        </view>
        </view>
      </scroll-view>
    </view>
    <!-- 购物车 -->
    <view class="cart" v-show="shoppingCat">
       
        <view class="cart-item">
           <uni-badge class="uni-badge-left-margin" :text="count" absolute="rightTop" :offset="[-3, -3]" >
           		<image class="bag" src="../../static/bag.png" @tap.native="opengoods"></image>
           	</uni-badge>
            <text>￥0</text>
        </view>
        <button class="cart-item-right" @click="pay">
            <text>去结算</text>
        </button>
        
    </view>
    <!-- 购物车商品 -->
    <scroll-view class="con" scroll-y v-show="openGoods">
        <view class="con-sum">
            <view>
                <radio color="#4558ad" style="transform: scale(0.7); " checked='true'></radio>
                <text>全选</text>
           </view>
           <view @tap='remove'>
               <uni-icons type="trash" size="17" ></uni-icons>  
               <text>清空</text>
           </view>
        </view>
       <view>
        <block v-for="(goods, i) in cart" :key="i">
           <!-- 自定义组件 -->
          <my-goods :goods="goods" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
        </block>
      </view>
    </scroll-view>
  </view>
  
</template>

<script>
    // 按需导入 mapMutations 这个辅助方法
    import { mapState,mapMutations, mapGetters } from "vuex"
    
    export default {
        data() {
            return {
                memuList:[],
                active:0,
                menuRight:[],
                // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
                wh: 0,
                navheight:0,
                value: 0,
                sweetValue:0,
                range: [{"value": 0,"text": "M杯"},{"value": 1,"text": "L杯"}],
                rangeb: [{"value": 0,"text": "7分糖"},{"value": 1,"text": "不加糖"},{"value": 2,"text": "3分糖"}],
                //商品价格
                price:'',
                //杯型
                sizeInt:[],
                //甜度
                sweetInt:[],
                //he
                goodsInt:[],
                //购物袋商品数量
                count:0,
                //控制商品显示
                show:true,
                //
                shoppingCat:false,
                //
                openGoods: false,
                //购物车商品高度
            }
        },
        onLoad() {
            this.getMenu()
             // 获取当前系统的信息
            const sysInfo = uni.getSystemInfoSync()
            // 为 wh 窗口可用高度动态赋值
            this.wh = sysInfo.windowHeight
            //导航高度
            this.navheight = sysInfo.statusBarHeight
            if(this.cart.length != 0){
                 this.shoppingCat= !this.shoppingCat
            }
           
           
        },
        methods: {
            async getMenu(){
                const { data : res } = await uni.$http.get(`/kaka/v1/menu`)
                this.memuList = res.message
                this.menuRight = res.message[0].children
                this.price = this.menuRight.cat_price
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
                this.shoppingCat = false
                //先调用商品价格
                this.price = this.menuRight[index].cat_price
                 if(this.goodsInt.length < 2){
                     this.sizeInt.push(this.range[0].text)
                     this.sweetInt.push(this.rangeb[0].text)
                     this.goodsInt = this.sizeInt + this.sweetInt
                 }

                
               
            },
            change(e) {
                if(this.value === 0 ){
                    this.price = e
                    this.sizeInt = []
                    this.sizeInt.push(this.range[0].text)
                    this.goodsInt = this.sizeInt + this.sweetInt
                }else{
                   const priceb = Number(e)+1
                   this.price = priceb
                   this.sizeInt = []
                   this.sizeInt.push(this.range[1].text)
                   this.goodsInt = this.sizeInt + this.sweetInt
                }
            },
            //数据选择器
            changeValue(value) {
                if(this.sweetValue == 0){
                    this.sweetInt = []
                    this.sweetInt.push(this.rangeb[0].text)
                    this.goodsInt = this.sizeInt + this.sweetInt
                }else if(this.sweetValue == 1){
                    this.sweetInt = []
                    this.sweetInt.push(this.rangeb[1].text)
                    this.goodsInt = this.sizeInt + this.sweetInt
                }else{
                    this.sweetInt = []
                    this.sweetInt.push(this.rangeb[2].text)
                    this.goodsInt = this.sizeInt + this.sweetInt
                }
            },
            //购物车
           cat(item){
               //关闭弹出框
              this.shoppingCat =  !this.shoppingCat
              this.show = !this.show;
               //组织选中的商品的信息对象
                const goods = {
                        goods_id: item.cat_id,       // 商品的Id
                        goods_name: item.cat_title,   // 商品的名称
                        goods_price: this.price,// 商品的价格
                        goods_count: 1 ,                           // 商品的数量
                        goods_small_logo: item.cat_img, // 商品的图片
                        goods_state: true,                      // 商品的勾选状态
                        goods_content: this.goodsInt  //商品选择参数
                     }
               // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
                this.addToCart(goods)
           },
           //vuex购物车辅助方法
           
           //把 m_cart 模块中的 addToCart 方法映射到当前页面使用
            ...mapMutations('m_cart', ['addToCart','updateGoodsState','updateGoodsCount','removeGoods']),
            
            //勾选状态改变
            radioChangeHandler(e) {
                console.log(e) // 输出得到的数据 -> {goods_id: 395, goods_state: false}
                this.updateGoodsState(e)
            },
            // 商品的数量发生了变化
            numberChangeHandler(e) {
              this.updateGoodsCount(e)
            },
            //跳转结算页面
            pay(){
                console.log(22);
               uni.navigateTo({
                  url:'/subpkg/pay/pay',
                   fail: () => {'跳转搜索页面失败'}
               });
            },
            //购物袋点击
            opengoods(){
                this.openGoods = !this.openGoods
            },
            //清空
            remove(e){
                this.removeGoods(e)
                this.openGoods = !this.openGoods
            }
        },
    
        computed: {
            // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
            // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
            ...mapState('m_cart', ['cart']),
             // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
            ...mapGetters('m_cart', ['total']),
          },
          
          // 通过 watch 侦听器，监听计算属性 total 值的变化，从而动态为购物车按钮的徽标赋值：
            watch: {
              // 监听 total 值的变化，通过第一个形参得到变化后的新值
              //用对象的方法监听
              total: {
              handler(newVal) {
                this.count = newVal
              },
              //声明此侦听器在页面初次加载完成调用
              immediate: true
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
    $img-size: 28%;
    $border-css: #d2d2d2 1rpx solid;
    
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
    background-color: $bg-left-color;
    
    .left-scroll-view-item {
      line-height: 70px;
      //background-color: $bg-left-color;
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
    margin: $mg-left 0 $mg-left 2%;
    display: flex;
    padding:2%;
  
    .img{
      height: 100%;
      width: $img-size;
      border-radius: $mg-left;
    }
    .container-right{
        margin-left: $mg-left;
        width: 66%;
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
        
     .price{
        font-size: 35rpx;
        font-weight: bolder;
     }
      .btns{
          width: 140rpx;
          border-radius: $mg-left;
          background-color: $mian-color;
          color: $bg-right-color;
          font-size:22rpx;
          line-height:20px;
          margin-right: $mg-left ;
      }
      
      // 弹出框
    .vue-ref{
        padding:  0 !important;
    }
        .dialog-a:empty {
             // 插槽是空 则显示默认插槽
          display: block;
        }
      .dialog-a{
          margin:15rpx 30rpx;
          .dialog-img{
              height: 200rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 20rpx 0;
              .img{
                  width: 50%;
              }
          }
          .dialog-text{
              height: 175rpx;
              .title{
                   font-size: 40rpx;
                   font-weight:500;
                   margin-bottom: $mg-left;
                   display: flex;
                   align-items: center;
                   justify-content: space-between;
                .favi{
                    display: flex;
                    flex-direction: column;
                    border-left: $border-css;
                    margin-right: $mg-left;
                    padding-left: $mg-left*2;
                    font-size: 20rpx;
                }
              }
              .text{
                  font-size: $mg-left+5rpx;
                  color: $text-color;
              }
          }
          
          .dialog-int{
              margin: 10rpx 0 $mg-left 0; 
              height: 120rpx;
             .uni-data-checklist{
                 margin-top: 15rpx !important;
             }
          }
      }
 
  }
      .uni-card{
          margin: 0 !important;
      }

      .dialog-body{
         .body-header{
             color: #000;
             font-size: 20px;
             font-weight: bold;
             margin:10rpx;
             display: flex;
              align-items: center;
             justify-content: space-between;
             .body-text{
                 display: flex;
                 flex-direction: column;
                 .body-text-min{
                     font-weight: 200;
                     font-size: 25rpx;
                 }
             }
            
         }
        
         .body-bottom{
            display: flex;
           
            justify-content: space-around;
            
           .btns{
                margin-top: $mg-left !important;
                width: 45%;
                height: 70rpx;
                line-height: 70rpx;
                border-radius: 20rpx;
                font-size: 27rpx;
                background-color: $mian-color;
             }
         }
    }
   }
}
}
.cart{
    position: fixed;
    z-index: 999;
    width: 90%;
    height: 100rpx;
    position: fixed;
    top:92%;
    display: flex;
    left: 5%;
    color: $bg-right-color;
    .cart-item{
        width: 75%;
        border-radius: 60rpx 0 0 60rpx;
        background-color: #323232;
        display:flex;
        align-items: center;
        .uni-badge--error {
            background-color: $mian-color;
        }

        .bag{
            width: 80rpx;
            height: 80rpx;
            margin-left: $mg-left*2;
        }
    }
    .cart-item-right{
        background-color: $mian-color;
        width: 25%;
        color: $bg-right-color;
        line-height: 100rpx;
        letter-spacing: 3rpx;
        border-radius: 0 60rpx 60rpx 0;
        padding-left: 10rpx
;
    }
}
.con{
    position: fixed;
    background-color: $bg-right-color;
    max-height: 50vh;
    padding-bottom: 120rpx;
    bottom: 0%;
    width: 100%;
    border-radius: 40rpx 40rpx 0  0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
.con-sum{
   height: 60rpx;
   font-size: 16px;
   background-color: #d2d2d2;
   border-radius: 40rpx 40rpx 0  0;
   display: flex;
   align-items: center;
   justify-content:space-between;
   padding: 0 2%;
}
}
</style>
