import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default{
  namespaced: true,	
  //这里放的是子模块的属性，使用的时候这样用：this.$store.state.模块名.属性名
  state: {
     cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  },
  
  //这里放子模块的“操作”，使用的时候根据namespaced是否定义为true，
  //定义了则commit的时候参数要加模块名（如this.$store.commit('模块名/mutation名')），
  //没有定义则直接用mutation名，那么就有一个新的问题，就是可能重名，建议加上
  mutations: {
      
    addToCart(state, goods) {
          // 根据提交的商品的Id，查询购物车中是否存在这件商品
          // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
          const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
          if (!findResult) {
            // 如果购物车中没有这件商品，则直接 push
            state.cart.push(goods)
          } else {
            // 如果购物车中有这件商品，则只更新商品数量
            findResult.goods_count++
          }
        this.commit('m_cart/saveToStorage')
          console.log(state.cart);
        },
    
    // 将购物车中的数据持久化存储到本地,一般登入放数据库
    saveToStorage(state) {
       uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
    
      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    //更新购物车中商品数量
     updateGoodsCount(state,goods){
       const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
       
       // 有对应的商品信息对象
       if (findResult) {
         // 更新对应商品的勾选状态
         findResult.goods_count = goods.goods_count
         // 持久化存储到本地
         this.commit('m_cart/saveToStorage')
     }
    },
    //清空选择的商品
    removeGoods(state){
             state.cart = [],
             // 持久化存储到本地
             this.commit('m_cart/saveToStorage')
       },
  },
   // 模块的 getters 属性
   getters: {
      // 统计购物车中商品的总数量
      total(state) {
         let c = 0
         // 循环统计商品的数量，累加到变量 c 中
         state.cart.forEach(goods => c += goods.goods_count)
         return c
      }

   },

  actions: {
//emm。。下次一定
  }
}
