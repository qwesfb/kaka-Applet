export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 收货地址
    address:JSON.parse( uni.getStorageSync("address") || "{}"),
    //登入获取的token
    token:uni.getStorageSync('token') ||'',
    //用户信息
    userinfo:JSON.parse(uni.getStorageSync("userinfo") || "{}")
    
  }),

  // 方法
  mutations: {
    
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    //持久化存储到本地
    saveAddressToStorage(state) {
       uni.setStorageSync('address', JSON.stringify(state.address))
    },
    
    // 更新用户的基本信息
    updateUserInfo(state, userinfo) {
        state.userinfo = userinfo
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法，将 userinfo 对象持久化存储到本地
        this.commit('m_user/saveUserInfoToStorage')
    },

    // 将 userinfo 持久化存储到本地
    saveUserInfoToStorage(state) {
        uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    
    // 更新 token 字符串
      updateToken(state, token) {
        state.token = token
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
        this.commit('m_user/saveTokenToStorage')
      },
      
    // 将 token 字符串持久化存储到本地
    saveTokenToStorage(state) {
        uni.setStorageSync('token', state.token)
    }
},

  // 数据包装器，为了提高代码的复用性，可以把收货的详细地址抽离为 getters，方便在多个页面和组件之间实现复用。
  getters: {
      //收货地址拼接
         addstr(state) {
             if (!state.address.provinceName) return ''
             return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
      }
  },
}