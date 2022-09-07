<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
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
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>