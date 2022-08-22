
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'

uni.$http = $http

$http.baseUrl = 'http://127.0.0.1:4523/m1/1485158-0-default'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
      title:'数据加载中...'
  })
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  wx.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

