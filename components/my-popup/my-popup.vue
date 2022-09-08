<template>
 
        <view class="dialog-a" >
          <view class="dialog-img">  
              <image :src="goods.cat_img" class="img"></image>
          </view>
          <view class="dialog-text">
              <view class="title">{{ goods.cat_title}} 
              <view class="favi">
                  <uni-icons type="heart" size="20"></uni-icons>
                  <text>收藏</text>
              </view>
             </view>
              <view class="text">{{ goods.cat_int }}</view>
          </view>
          <view class="dialog-int">
              <text class="int-text">冰</text>
              <uni-data-checkbox v-model="value" mode="tag" :localdata="range"
              selectedTextColor="#fff" selectedColor="#4558ad" @change="change">
               </uni-data-checkbox>
          </view>
          <view class="dialog-int">
              <text>甜度</text>
              <uni-data-checkbox mode="tag" :localdata="rangeb"  v-model="sweetValue"
              selectedTextColor="#fff"  selectedColor="#4558ad" @change="changeValue">
              </uni-data-checkbox>
          </view>
         </view>
  
  
</template>

<script>
    export default {
        // 定义 props 属性，用来接收外界传递到当前组件的数据
        props: {
          // 商品的信息对象
          goods: {
            type: Object,
            defaul: {},
          },
        },
        name:"my-popup",
        data() {
            return {
                range: [{"value": 0,"text": "正常冰"},{"value": 1,"text": "少冰"}],
                rangeb: [{"value": 0,"text": "7分糖"},{"value": 1,"text": "3分糖"},{"value": 2,"text": "不加糖"}],
                value: 0,
                sweetValue:0,
                //he
                goodsInt:["正常冰,7分糖"],
                sweetInt:["7分糖"],
                iceInt:["正常冰"]
            };
        },
        methods: {
         //甜度
         changeValue(value) {
             this.sweetInt = value.detail.data.text
              this.goodsInt = this.sweetInt +',' +this.iceInt
              this.$emit('goods-int',{
                goodsInt:this.goodsInt
              })
         },
         //正常冰
         change(value){
              this.iceInt = value.detail.data.text
              this.goodsInt =this.sweetInt +',' +this.iceInt
              this.$emit('goods-int',{
                goodsInt:this.goodsInt
              })
         },
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
    $border-css: #d2d2d2 1rpx solid;
      .dialog-a{
          max-height: 50vh;
          margin:15rpx 30rpx;
          .dialog-img{
              height: 275rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 20rpx 0;
              .img{
                  width: 45%;
              }
          }
          .dialog-text{
              height: 190rpx;
              .title{
                   font-size: 40rpx;
                   font-weight:500;
                   margin-bottom: $mg-left;
                   display: flex;
                   align-items: center;
                   justify-content: space-between;
                .favi{
                    display: flex;
                    flex-direction: column;
                    border-left: $border-css;
                    margin-right: $mg-left;
                    padding-left: $mg-left*2;
                    font-size: 20rpx;
                }
              }
              .text{
                  font-size: $mg-left+5rpx;
                  color: $text-color;
              }
          }
          
          .dialog-int{
              margin-top: 10rpx; 
              height: 120rpx+25rpx;
          }
      }
</style>