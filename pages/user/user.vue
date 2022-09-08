<template>
  <view class="my-userinfo-container">

    <!-- 用户未登录时，显示登录组件 -->
    <my-login v-if="!token"></my-login>

    <!-- 用户登录后，显示用户信息组件 -->
   <my-userinfo v-else></my-userinfo>
   <view class="grid-box">
          <text class="grid-box-text">我的功能</text>
          <view class="grid-box-bottom">
              <view class="grid-box-item" v-for="(item,i) in gird" :key="i">
               <uni-icons :type="item" size="30" color="#4558ad"></uni-icons>
               <text  style="margin-top: 20rpx;">订单</text>
             </view>
   
          </view>
      </view>
   
   		
   		
   <!-- 第三个面板 -->
   <view class="panel">
     <view class="panel-list-item">
       <text>收货地址</text>
       <uni-icons type="arrowright" size="15"></uni-icons>
     </view>
     <view class="panel-list-item">
       <text>联系客服</text>
       <uni-icons type="arrowright" size="15"></uni-icons>
     </view>
     <view class="panel-list-item"  @click="logout">
       <text>退出登录</text>
       <uni-icons type="arrowright" size="15"></uni-icons>
     </view>
   </view>
  </view>
</template>
<script>
    import { mapState, mapMutations } from 'vuex'
    export default {
        data() {
            return {
                 gird:['redo','location','phone','gear',]
            }
        },
        computed: {
            //导入token字符串
            ...mapState('m_user',['token'])
        },
        methods: {
            ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateAddress']),
              // 退出登录
              async logout() {
                // 询问用户是否退出登录
                const [err, succ] = await uni.showModal({
                  title: '提示',
                  content: '确认退出登录吗？'
                }).catch(err => err)
              
                if (succ && succ.confirm) {
                   // 用户确认了退出登录的操作
                   // 需要清空 vuex 中的 userinfo、token 和 address
                   this.updateUserInfo({})
                   this.updateToken('')
                   this.updateAddress({})
                }
            },
        }
    }
</script>

<style lang="scss">
.my-user-box{
    margin: 40rpx 20rpx;
    border-radius: 40rpx;
    background-color: #fff;
    font-size: 25rpx;
    color: #8a8a8a;
}
.my-userinfo-container {
   
  height: 100%;
  // 为整个组件的结构添加浅灰色的背景
  background-color: #f4f4f4;
  }
.grid-box{
    @extend .my-user-box;
    .grid-box-text{
        display: block;
        padding: 20rpx 0 0 40rpx;
        font-size: 30rpx;
        font-weight: 600;
        color: #000;
       
    }
    .grid-box-bottom{
        height: 200rpx;
        width: 100%;
        display: flex;
    }
    .grid-box-item{
        height: 100%;
        width: 25%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
.panel{
     @extend .my-user-box;
     color: #000;
}
.panel-list-item {
   
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  padding: 0 10px;
}
</style>
