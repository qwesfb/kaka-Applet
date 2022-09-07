
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'
import store from './store/store'
uni.$http = $http

$http.baseUrl = 'http://127.0.0.1:4523/m1/1485158-0-default'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
      title:'数据加载中...'
  })
  //只有在登录之后才允许调用支付相关的接口，所以必须为有权限的接口添加身份认证的请求头字段
  //判断请求的是否是有权限的接口
  if(options.url.indexOf('/user/') !== -1){
      options.header ={
          Authorization: store.state.m_user.token
      }
  }
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  wx.hideLoading()
}

// 封装的展示消息提示的方法,当数据请求失败之后，调用 uni.showToast() 方法来提示用户
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
    
})
app.$mount()
// #endif

