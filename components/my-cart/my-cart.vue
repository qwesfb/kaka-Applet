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
    import { mapGetters ,mapState,mapMutations } from "vuex"
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
            ...mapState('m_user',['token']),
        },
        methods: {
              ...mapMutations('m_user',['updateUserInfo','updateToken']),
              ...mapMutations('m_cart', ['addToGoods']),
              
            //跳转结算页面
            pay(){
                if(!this.checkedCount) return uni.$showMsg('还没选择商品')
                
                if(!this.token){
                    uni.getUserProfile({
                         desc:'登录授权',
                         success: (res) => {
                             //  //将用户的基本信息存储到 vuex 中
                              this.updateUserInfo(res.userInfo)
                                //跳转
                                uni.navigateTo({
                                   url:'/subpkg/pay/pay'
                                });
                                //调用 勾选的商品
                                this.addToGoods()
                                //获取登入的token
                               this.getToken(res)
                         },
                         fail: (res) => {
                               return uni.$showMsg('请重新授权')
                         }
                     })
                     }else{
                         uni.navigateTo({
                            url:'/subpkg/pay/pay'
                         });
                         //调用 勾选的商品
                          this.addToGoods()
                     }
            },
            
            // 调用登录接口，换取永久的 token
            async getToken(info) {
              // 调用微信登录接口uni.login(),获取code
              const [err, res] = await uni.login().catch(err => err)
              // 判断是否 uni.login() 调用失败
              if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
            
              // 准备参数对象
              const query = {
                code: res.code, 
                encryptedData: info.encryptedData, //用户信息密文
                iv: info.iv,  //加密算法的初始向量
                rawData: info.rawData, //用户信息原始数据字符串
                signature: info.signature
              }
             
              // 换取 token
              const { data: loginResult } = await uni.$http.post('/api/public/kaka/users/wxlogin', query)
               if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
              // 2. 更新 vuex 中的 token
                  this.updateToken(loginResult.message.token)

            },
           opengoods(){
               this.$emit('open-goods',{
                   openGoods:false
               })
           }
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
.cart-box{
    display: flex;
     width: 100%;
   
    .cart-item{
        width: 75%;
        border-radius: 60rpx 0 0 60rpx;
        background-color: #323232;
        display:flex;
        align-items: center;


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