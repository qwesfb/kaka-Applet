<template>
    <view>
        <view class="search-box">
          <uni-search-bar @confirm-type="search" 
          :focus="true" clearButton="auto"  
          :radius="100"  cancelButton="none"
          @confirm="doSearch" @input="input"  
          @clear="clear" v-model="searchValue">
          </uni-search-bar>
        </view>
        <view class="goods" v-if="searchResults.length !== 0">
            <view class="right-scroll-view-item" v-for=" (item,index) in searchResults" :key="index">
               <image :src="item.goods_img"></image>
                <view class="container">
                    <text  class="text title">{{ item.goods_name}}</text>
                    <text  class="text ftitle">[{{ item. goods_text }}]</text>
                    <text  class="text price">￥{{ item.goods_price }}<text class="ftitle"> 起</text></text>
                    
                </view>
                <view class="item-right">
                  <button  @click="choice()">选规格</button>
                <!-- <uni-popup ref="popup" type="bottom" background-color="#fff">tc</uni-popup> -->
                </view>
            </view>
        </view>
        
        <view class="history-box" v-else>
          <!-- 标题区域 -->
          <view class="history-title">
            <text>搜索历史</text>
            <uni-icons type="trash" size="17" @tap='remove'></uni-icons>
          </view>
          <!-- 列表区域 -->
          <view class="history-list">
            <uni-tag :text="item" v-for="(item, i) in historyList" :key="i">
                {{ item }}
            </uni-tag>
          </view>
        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                //延时器的timeid
                timer: null,
                //搜索关键词
                searchValue:'',
                // 搜索结果列表
                searchResults: [],
                //历史记录
                historyList:[],

            };
           
        },
        methods: {
           async doSearch(){
               if(this.searchResults = ''){
                   this.searchResults = []
                   return
               }else{
                   const { data : res} = await uni.$http.get(`/kaka/v1/goods/qsearch`,{query : this.searchValue})
                   this.searchResults = res.message
                   this.historySearch()
               }
             
               },
               
                
            input(e){
                //2.清除500毫秒内的输入显示
                clearTimeout(this.timer)
               //1.防抖,设置延时器
               this.timer = setTimeout(() => {
                   this.searchValue = e
               },500)
           },
               
           clear(){
               this.searchResults =[]
           },
          //保存搜索关键词
           historySearch(){
               //1.ES6数组去重 将数组转化成set对象/Set函数可以接受一个数组
               const set = new Set(this.historyList)
               set.delete(this.searchValue)
               set.add(this.searchValue)
               //2.生成的是一个Set类型而不是一个数组类型，需要我们把他转换成为数组类型
               this.historyList = Array.from(set)
               //1.wxAPI  将data 存储在本地缓存中指定的 key 中
               uni.setStorageSync('searchValue', JSON.stringify(this.historyList))
               },
                   
            remove(){
                   this.historyList = []
                   uni.setStorageSync('searchValue', '[]')
               },
            onload() {
                //2.加载本地存储的搜索历史记录
                this.historyList = JSON.parse(uni.setStorageSync('searchValue') || '[]')
            }
        }
        
    }
</script>

<style lang="less">
.search-box{
   position: sticky;
   top: 0;
   z-index: 999;
   background-color: #4558ad;
   border:  none;
}
    
.history-box{
    margin: 5%;
    .history-list{
        margin-top: 20rpx;
        .uni-tag{
          margin-right: 40rpx;
        }
    }
    
}  
.goods{
    height: 100vh;
    background-color: #ffffff;
}
.right-scroll-view-item{
      height: 100px;
      margin-left: 2%;
      display: flex;
      padding:2%;
      
     image{
          height: 100%;
          width: 25%;
      }

  .container{ 
      width: 45%;
      .text{
          margin-top: 2%;
          margin-left: 10%;
          display: block
      }
      .title{
           font-size: 30rpx;
           font-weight: bolder;
      }
      .ftitle{
          font-size: 15rpx;
          color: #707070;
      }
          
      .price{
         margin-top: 75rpx; 
        font-size: 35rpx;
        font-weight: bolder;
      }
  }
  .item-right{
      width: 25%;
      height: 100%;
     
      button{
          margin-top:90%;
          width: 95%;
          height: 20%;
          background-color: #4558ad;
          color: #ffffff;
          font-size:22rpx;
          line-height:20px;
      }
  }
}

</style>
