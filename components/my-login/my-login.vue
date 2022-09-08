<template>
  <view>
      <view class="top-box"  @click.native="getUserProfile">
          <uni-icons type="contact-filled" size="100" color="#AFAFAF"  ></uni-icons>
        <view class="nickname">
            <text>登录账户</text>
            <view class="tips-text">登录后尽享更多权益</view>
        </view>
      </view>


  </view>
</template>

<script>
    import { mapMutations } from 'vuex'
    
    export default {
        name:"my-login",
        data() {
            return {
                
            };
        },
        methods: {
        ...mapMutations('m_user',['updateUserInfo','updateToken']),
           async getUserProfile(){
               uni.getUserProfile({
                   desc:'登录授权',
                   success: (res) => {
                       //  //将用户的基本信息存储到 vuex 中
                        this.updateUserInfo(res.userInfo)
                        //  //获取登入的token
                         this.getToken(res)
                   },
                   fail: (res) => {
                         return uni.$showMsg('请重新授权')
                   }
               })
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
             console.log(loginResult);
           }
           
        }
           
    }
</script>

<style lang="scss">
    .top-box {
      height: 250rpx;
       border-radius:  0 0 40rpx 40rpx;
      background-color: #f1da17;
      display: flex;
      align-items: center;

      .nickname {
        color: white;
        font-weight: bold;
        font-size: 16px;
      }
    }



  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    margin-top: 10rpx;
    color: gray;
  }

</style>