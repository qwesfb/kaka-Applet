<template>
  <view>
      <view class="search" :style="{'padding-top':navheight+10+'px'}">
         
          <text>咔咔饮品</text>
           <uni-icons type="search" size="23" color="#4558ad" @tap="search()"></uni-icons>
      	</view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
          <view  v-for="(item, i) in memuList" :key="i">
            <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activemenu(i)">
            {{item.cat_name}}
            </view>
            </view>
      </scroll-view>
      
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view class="right-scroll-view-item" v-for=" (item,index) in menuRight" :key="index">
           <image :src="item.cat_img" class="img"></image>
           <view class="container-right">
            <view class="container">
                <text  class="text title">{{ item.cat_title}}</text>
                <text  class="text ftitle">[{{ item. cat_text }}]</text>
            </view>
            <view class="item-right">
                <text  class="text price">￥{{ item.cat_price }}
                    <text class="ftitle" style="margin-left: 10rpx;"> 起</text>
                </text>
           
            
          
              <button class="btns" @click="toggle(index)">选规格</button>
              
              <!-- 弹出框 -->
              <uni-popup ref="popup" type="bottom" background-color="#fff" class='popup-box' v-show="openpopup">
                    <uni-icons type="close" @click="close" size="30" class='close'></uni-icons>
               <scroll-view scroll-y class="scroll-popup">
                  
                  <my-popup :goods="item"  @goods-int="checkint"></my-popup>
                </scroll-view>
                  
                 <!-- 2按钮 -->
                 <uni-card class='dialog-body' >
                     <view class="body-header">
                        <view class="body-text">
                            <text>￥{{ item.cat_price }} </text>
                            <view class="body-text-min">
                            <text  v-for="(item, i) in goodsInt" :key="i">{{ item }}</text>
                           </view>
                        </view>
                        <uni-number-box min="1" max="99" @change="count"></uni-number-box>
                     </view>
                     <view class="body-bottom">
                          <button class="btns" @tap="shooping(item)">立即购买</button>
                          <button class="btns" @tap="cat(item)"> 加入购物车</button>
                     </view>
                 </uni-card>
                
              </uni-popup>
              
              
            </view>
        </view>
        </view>
      </scroll-view>
    </view>
    <!-- 购物车 -->
       <my-cart class="cart" @open-goods="opengoods" v-show="openCart"></my-cart>
        
    
    <!-- 购物车商品-->
    <scroll-view class="con" scroll-y v-show="openGoods">
        <view class="con-sum">
            <view @tap="changeAllState">
                <radio color="#4558ad" style="transform: scale(0.7); " :checked="isFullCheck"></radio>
                <text>全选</text>
           </view>
           <view @tap='remove'>
               <uni-icons type="trash" size="17" ></uni-icons>  
               <text>清空</text>
           </view>
        </view>
       <view>
        <block v-for="(goods, i) in cart" :key="i">
           <!-- 自定义组件 -->
          <my-goods :goods="goods" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
        </block>
      </view>
    </scroll-view>
  </view>
  
</template>

<script>
    // 按需导入 mapMutations 这个辅助方法
    import { mapState,mapMutations, mapGetters } from "vuex"
    
    export default {
        data() {
            return {
                memuList:[],
                active:0,
                menuRight:[],
                // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
                wh: 0,
                navheight:0,
                //控制显示
                openGoods:false,
                openCart:true,
                openpopup:true,
                //商品参数
                goodsInt:['7分糖,正常冰'],
                //选择的商品数量
                goodsdCount:1
            }
        },
        onLoad() {
            this.getMenu()
             // 获取当前系统的信息
            const sysInfo = uni.getSystemInfoSync()
            // 为 wh 窗口可用高度动态赋值
            this.wh = sysInfo.windowHeight
            //导航高度
            this.navheight = sysInfo.statusBarHeight
            if(this.cart.length == 0){
                this.openGoods = false
            }
         
        },
        
        methods: {
            count(e){
                this.goodsdCount = e
            },
            async getMenu(){
                const { data : res } = await uni.$http.get(`/kaka/v1/menu`)
                this.memuList = res.message
                this.menuRight = res.message[0].children
            },
            //动态判断-样式
            activemenu(i){
                this.active = i
                this.getMenu()
            },
                
            search(){
                uni.navigateTo({
                url:'/subpkg/search/search',
                 fail: () => {'跳转搜索页面失败'}
                });
            },
            //弹出框
            toggle(index) {
                this.$refs.popup[index].open()
                this.openpopup = true
            },
            //弹出框关闭按钮
            close(){
                 this.openpopup = false
            },
            //接受子组件传递的参数
            checkint(goodsInt){
               this.goodsInt = goodsInt
            },
            //立即购买？？（调用支付接口）
            shooping(item){
                this.cat(item)
            },
            //购物车
           cat(item){
               this.openpopup = false
               this.openCart = true
               //组织选中的商品的信息对象
                var goods = {
                        goods_id: item.cat_id,       // 商品的Id
                        goods_name: item.cat_title,   // 商品的名称
                        goods_price: item.cat_price,// 商品的价格
                        goods_count: this.goodsdCount ,                           // 商品的数量
                        goods_small_logo: item.cat_img, // 商品的图片
                        goods_state: true,                      // 商品的勾选状态
                        goods_content: this.goodsInt  //商品选择参数
                     }
               // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
                this.addToCart(goods)
           },
           //vuex购物车辅助方法
           
           //把 m_cart 模块中的 addToCart 方法映射到当前页面使用
            ...mapMutations('m_cart', ['addToCart','updateGoodsState','updateGoodsCount','removeGoods','updateAllGoodsState','addToGoods']),
            
            //勾选状态改变
            radioChangeHandler(e) {
                console.log(e) // 输出得到的数据 -> {goods_id: 395, goods_state: false}
                this.updateGoodsState(e)
               
              
            },
            // 商品的数量发生了变化
            numberChangeHandler(e) {
              this.updateGoodsCount(e)
            },
            

            //清空
            remove(e){
                this.removeGoods(e)
                this.openGoods = !this.openGoods
            },
            //修改购物车中所有商品的选中状态
            changeAllState(){
                // console.log(! this.isFullCheck);
                this.updateAllGoodsState(! this.isFullCheck)
            },
            
            //接受自定义插件的显示隐藏控制
            opengoods(openGoods){
                if(this.openGoods == false){
                    this.openGoods = openGoods
                }else{
                     this.openGoods = !openGoods
                }
               
              
            },
        },
    
        computed: {
            // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
            // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
            ...mapState('m_cart', ['cart']),
             // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
             //checkedCount选中商品数量
            ...mapGetters('m_cart', ['total','checkedCount','checkedGoodsAmount']),

            //是否全选
            isFullCheck(){
                return this.total === this.checkedCount
            }
          },
          
        
    }
</script>

<style lang="scss">
    $mian-color: #4558ad ;
    $mg-left: 20rpx;
    $bg-right-color: #ffffff ;
    $bg-left-color: #f6f6f6;
    $text-color: #a8a8a8;
    $img-size: 28%;
 
.search{
    margin-left: 30rpx;
    font-size: 35rpx;
    font-weight: bolder;
    color:$mian-color;
        
    uni-icons{
        margin-left: 45%;
    }
}
.scroll-view-container {
    border-top: $mian-color solid 10rpx;
    margin-top: $mg-left;
    background-color: $bg-right-color;
    display: flex;
    letter-spacing: 2rpx;
  
  .left-scroll-view {
    width: 100px;
    background-color: $bg-left-color;
    
    .left-scroll-view-item {
      line-height: 70px;
      text-align: center;
      font-size: 12px;
      
      // 激活时 项的样式
      &.active {
        background-color: $bg-right-color;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 80%;
          background-color: $mian-color;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  
.right-scroll-view-item{
    background-color: $bg-right-color;
    height: 100px;
    margin: $mg-left 0 $mg-left 2%;
    display: flex;
    padding:2%;
  
    .img{
      height: 100%;
      width: $img-size;
      border-radius: $mg-left;
    }
    .container-right{
        margin-left: $mg-left;
        width: 66%;
        .text{
            margin-top: 2%;
            display: block
        }
        .container{ 
            height: 50%;
            margin:  $mg-left 0;
        }
        .title{
            font-size: 30rpx;
            font-weight: bolder;
          
        }
        .ftitle{
           font-size: 23rpx;
           color: $text-color;
       }

    .item-right{
         height: 35%;
        display: flex;
        align-items: center;
        
     .price{
        font-size: 35rpx;
        font-weight: bolder;
     }
      .btns{
          width: 140rpx;
          border-radius: $mg-left;
          background-color: $mian-color;
          color: $bg-right-color;
          font-size:22rpx;
          line-height:20px;
          margin-right: $mg-left ;
      }
      

    .popup-box{
        z-index: 99999;
        // 弹出框
        .vue-ref{
            padding:  0 !important;
            border-radius: 40rpx ;
        }
    } 
 
  }
      .uni-card{
          margin: 0 !important;
      }
      .scroll-popup{
          margin-bottom: 125px;
      }
      .close{
          float: right;
          display: block;
          margin: $mg-left $mg-left 0 0;
      }
      .dialog-body{
           position: fixed;
           bottom: 0;
           width: 100%;
         .body-header{
             color: #000;
             font-size: 20px;
             font-weight: bold;
             margin:10rpx;
             display: flex;
              align-items: center;
             justify-content: space-between;
             .body-text{
                 display: flex;
                 flex-direction: column;
                 .body-text-min{
                     font-weight: 200;
                     font-size: 25rpx;
                 }
             }
            
         }
        
         .body-bottom{
            display: flex;
           
            justify-content: space-around;
            
           .btns{
                margin-top: $mg-left !important;
                width: 45%;
                height: 70rpx;
                line-height: 70rpx;
                border-radius: 20rpx;
                font-size: 27rpx;
                background-color: $mian-color;
             }
         }
    }
   }
}
}
.cart{
    position: fixed;
    z-index: 99;
    width: 90%;
    height: 100rpx;
    top:92%;
    left: 5%;
    color: $bg-right-color;
    .uni-badge--error {
        background-color: $mian-color;
    }
}
.con{
    position: fixed;
    background-color: $bg-right-color;
    max-height: 50vh;
    padding-bottom: 120rpx;
    bottom: 0%;
    width: 100%;
    border-radius: 40rpx 40rpx 0  0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
.con-sum{
   height: 60rpx;
   font-size: 16px;
   background-color: #d2d2d2;
   border-radius: 40rpx 40rpx 0  0;
   display: flex;
   align-items: center;
   justify-content:space-between;
   padding: 0 2%;
   position: sticky;
   top: 0;
}
}
</style>
