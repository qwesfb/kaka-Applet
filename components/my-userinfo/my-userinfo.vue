<template>
  <view>

    <!-- 头像昵称区域 -->
   <view class="top-box">
     <image :src="userinfo.avatarUrl" class="avatar"></image>
     <view class="nickname">
     <tex>{{userinfo.nickName}}</tex>
     <view class="tips-text">欢迎登入咔咔饮品</view>
     </view>
   </view>
  
   
  </view>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    export default {
        name:"my-userinfo",
        data() {
            return {
               
            };
        },
        computed: {
            // 将 m_user 模块中的 userinfo 映射到当前页面中使用
            ...mapState('m_user', ['userinfo']),
          },
          methods: {

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
   

    .avatar {
      display: block;
      width: 70px;
      height: 70px;
      border-radius: 45px;
      border: 2px solid white;
      box-shadow: 0 1px 5px black;
      margin:  0 20rpx;
    }

    .nickname {
      color: white;
      font-weight: bold;
      font-size: 16px;
    }
    .tips-text{
        font-size: 12px;
          margin-top: 10rpx;
          color: gray;
        
    }
  }


</style>