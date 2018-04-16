<template>
  <div class="ic-sale-box">
    <div class="sale-top">
      <div class="top-left">
        <span>￥</span>
        <span class="amount">{{ info.amount }}</span>
      </div>
      <div class="top-right">
        <h3>{{ info.content }}</h3>
        <span>{{ info.coupon_title }}</span>
      </div>
      <div class="top-checkbox" v-if="showCheckbox">
        <ic-checkbox></ic-checkbox>
      </div>
    </div>
    <div class="sale-bottom">
      <div slot="bottom">
        <span class="expires" v-if="info.expire_time">{{ expires }}</span>
        <ic-button v-if="btnText"
          :content="btnText"
          @click="handleClick"
          round size="mini" type="primary"></ic-button>
      </div>
    </div>
    <div class="circle-left"></div>
    <div class="circle-right"></div>
  </div>
</template>

<script>
  import IcButton from '@/components/button'
  import IcCheckbox from '@/components/checkbox'
  import { formatDate } from '@/utils/js/format'

  export default {
    props: {
      btnText: String,
      info: Object,
      showCheckbox: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      expires () {
        return formatDate(this.info.expire_time * 1000)
      }
    },
    methods: {
      handleClick () {
        this.$emit('button-click', this.info)
      }
    },
    components: { IcButton, IcCheckbox }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'
  $circle-width = 30px
  $bottom-h = 60px

  .ic-sale-box
    display inline-block
    width 95%
    position relative
    overflow hidden
    .sale-top
      position relative
      padding 20px
      display flex
      border 1px solid #eee
      border-radius 4px
      border-bottom 0
      .top-left
        flex 1
        color $primary
      .amount
        font-size 30px
      .top-right
        flex 2
        h3
          font-size 14px
        span
          font-size 12px
          color #ccc
          padding-top 12px
      .top-checkbox
        center()
    .sale-bottom
      display flex
      border 1px solid #eee
      border-top 1px dashed #999
      border-radius 4px
      height $bottom-h
      line-height $bottom-h
      padding 0 22px
      .expires
        color #cccccc
    .circle-left,.circle-right
      width $circle-width
      height $circle-width
      background-color #fff
      border $border
    .circle-left
      position absolute
      bottom ($bottom-h - $circle-width / 2)
      left -($circle-width / 2)
      border-radius 0 ($circle-width) ($circle-width) 0
    .circle-right
      position absolute
      bottom ($bottom-h - $circle-width / 2)
      right -($circle-width / 2)
      border-radius ($circle-width) 0 0 ($circle-width)
</style>
