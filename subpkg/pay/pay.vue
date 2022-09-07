<template>
    <view>
    <view class="box">
    
      <!-- 选择收货地址的盒子 -->
      <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
        <button  size="mini" class="btnChooseAddress" @tap="chooseAddress" >请选择收货地址+</button>
      </view>
    
      <!-- 渲染收货信息的盒子 -->
      <view class="address-info-box"  v-else @click="chooseAddress">
        <view class="row1">
          <view class="row1-left">
            <view class="username">收货人：<text> {{ address.userName }} </text></view>
          </view>
          <view class="row1-right">
            <view class="phone">电话：<text> {{address.userName}} </text></view>
            <uni-icons type="arrowright" size="16"></uni-icons>
          </view>
        </view>
        <view class="row2">
          <view class="row2-left">收货地址：</view>
          <view class="row2-right"> {{addstr}}  </view>
        </view>
      </view>
      
     <!-- 购物车商品列表 -->
     <view class="goods-info-box">
         <text class="box-total">共{{checkedCount}}件商品</text>
         
         <view class="box-goods" v-for="(item,i) in checkedgoods" :key="i">
              <image :src="item.goods_small_logo || defaultPic" class="img"></image>
              <!-- 商品右侧信息区域 -->
              <view class="container-right">
                <!-- 商品标题 -->
                <view class="container">
                    <view class="title">{{item.goods_name}}</view>
                    <view class="ftitle"> {{item.goods_content}} </view>
                  
               </view>
               <view class="item-right">
                   <text class="price">￥{{item. goods_price}}</text>
                    <view class="count"> x{{item.goods_count}} </view>
               </view>
                </view>
         </view>
     
          <text class="box-totalPrice">小计 ￥{{checkedGoodsAmount}}</text>
     </view>
   
    </view>
    <!--  结算按钮 -->
    <view class="goods-pay-box">
        <text>应付:<text class="pay-price">￥{{checkedGoodsAmount}}</text></text>
        <button class="pay-btn" @tap="paybtn">去支付</button>
    </view>
    </view>
</template>

<script>
    import { mapState, mapMutations, mapGetters} from 'vuex'
    export default {
        data() {
            return {
            }
        },
        methods: {
            // m_user模块的updateAddress 函数映射到当前组件
            ...mapMutations('m_user', ['updateAddress']),
            ...mapMutations('m_cart', ['addToCart','updateGoodsState','updateGoodsCount','removeGoods']),
            async chooseAddress() {
               // 1. 调用小程序提供的 chooseAddress() 方法 解构赋值，返回一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
               const [err,succ] = await uni.chooseAddress().catch(err => err)
               console.log(err,succ);
               if (err === null && succ.errMsg === 'chooseAddress:ok') {
                 // 调用 updateAddress 方法为 data 里面的收货地址对象赋值
                 this.updateAddress (succ) 
               }
               console.log(this.cart);
             },
             paybtn(){
                  if (!this.addstr) return uni.$showMsg('请选择收货地址！')
                   //实现微信支付功能
                 this.payOrder()
             },
             async payOrder(){
                  const orderInfo = {
                     // 1.开发期间，注释掉真实的订单价格，
                     // order_price: this.checkedGoodsAmount,
                     // 写死订单总价为 1 分钱
                     order_price: 0.01,
                     consignee_addr: this.addstr,
                     goods: this.checkedgoods
                   }
                   const { data: res } = await uni.$http.post('/api/public/kaka/my/orders/create', orderInfo)
                   //创建订单编号
                   const orderNumber = res.message.order_number
                    console.log( orderNumber);
                    // 2.订单预支付
                  // 2.1 发起请求获取订单的支付信息
                  const { data: res2 } = await uni.$http.post('/api/public/kaka/my/orders/req_unifiedorder', { order_number: orderNumber })
                 
                  // 2.2 预付订单生成失败
                  if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
                  // 2.3 得到订单支付相关的必要参数
                  const payInfo = res2.message.pay
                   console.log(payInfo);
                   //3.微信支付
                   const[err,succ] = await uni.requestPayment(payInfo)
                   if (err) return uni.$showMsg('订单未支付！')
             }
            
        },
            
        computed:{
            //
            //把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
             ...mapState('m_user', ['address']),
             ...mapGetters('m_user', ['addstr']),
             
             ...mapGetters('m_cart', ['checkedCount','checkedGoodsAmount']),
             ...mapState('m_cart',['checkedgoods'])
        }
    }
</script>

<style lang="scss">
    $mg-left: 20rpx;
    $text-color: #a8a8a8;
    $main-color:#4558ad;
    $box-margin-top:50rpx;
.box-css {
    background-color: #fff;
    border-radius: 30rpx;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19);
    padding: 0 5px;
}
.text{
  margin-top: 3%;
  display: block
}

.box{
    margin: 2%;
    height: 85vh;

/* // 选择收货地址的盒子 */
.address-choose-box {
    margin-top: $box-margin-top;
    height: 120rpx;
        
    .btnChooseAddress{
        background-color: white;
        width: 100%;
        height: 100%;
        @extend .box-css;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* // 渲染收货信息的盒子 */
.address-info-box{
  font-size: 12px;
  height: 155rpx;
  @extend .box-css;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
/*  // 第一行 */
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

/* 第二行 */
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
.goods-info-box{
  @extend .box-css;
    height:auto;
    margin-top:  $box-margin-top;
    
    .box-total{
        height: 75rpx;
        display: flex;
        align-items: center;
        margin-left: 25rpx;
        letter-spacing: 2rpx;
    }
   .box-goods{
          height:70px;
          margin: $mg-left 0 $mg-left 2%;
          display: flex;
          align-items: center;
          padding:2%;
          padding-left: 0;
          
          .img{
            height: 95%;
            width: 20%;
            margin-left: 5px;
            border-radius: $mg-left;
          }
          .container-right{
              margin-left: $mg-left;
              width: 75%;
              height: 100%;
              display: flex;
              justify-content: space-between;

              .title{
                  @extend .text;
                  font-size: 30rpx;
                  font-weight: bolder;
                
              }
              .ftitle{
                 @extend .text;
                 font-size: 23rpx;
                 letter-spacing:2rpx;
                 color: $text-color;
             }
             .item-right{
                 display: flex;
                flex-direction: column;
             }
             .count{
                   @extend .text;
                   color: $main-color;
                   font-size: 25rpx;
                   margin: 55% 0  0 50%;
             }
             .price{
                 color: $main-color;
                 font-weight: bolder;
             }
        }
      }
    .box-totalPrice{
        height: 80rpx;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        font-weight: bolder;
        border-top: solid $text-color 1rpx;
        padding:2%
    }
}
}

.goods-pay-box{
    background-color: #fff;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 30rpx;
    
   .pay-btn{
       background-color: $main-color;
       color: #fff;
       margin: 0 !important;
       width: 150px;
       border-radius: $mg-left*2;
   }
   .pay-price{
       font-weight: bolder;
       color: $main-color;
       font-size: $mg-left*2;
   }
}
</style>
