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
        <div class="checkbox-container">
          <div class="ic-checkbox" @click="handleCheck(info, index)">
            <div class="checkbox-inner"
              :class="{ 'checked': isChecked }">
              <span class="checkbox-circle" v-if="isChecked && !isDisabled"></span>
              <span class="checkbox-disabled" v-else></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sale-bottom">
      <div slot="bottom">
        <span class="expires" v-if="info.expire_time">{{ expires }}</span>
      </div>
      <ic-button v-if="showButton"
        :content="btnText"
        @click="handleClick"
        round size="mini" type="primary"></ic-button>
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
      showButton: {
        type: Boolean,
        default: false
      },
      btnText: {
        type: [String, Number],
        default: '去使用'
      },
      info: Object,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      isChecked: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        checked: this.isChecked
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
      },
      handleCheck (info) {
        if (this.isDisabled) return
        this.checked = !this.checked
        this.$emit('checkbox-click', this.checked ? this.info : '')
      }
    },
    components: { IcButton, IcCheckbox }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'
  $circle-width = 20px
  $bottom-h = 40px

  .ic-sale-box
    display inline-block
    width 65%
    position relative
    overflow hidden
    box-shadow 0 9px 15px -13px rgba(0,0,0,0.3)
    .sale-top
      position relative
      padding 8px 20px
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
          font-size 12px
          color #666666
        span
          font-size 10px
          color #ccc
          padding-top 12px
      .top-checkbox
        center-y()
        right 15px
        .checkbox-inner
          margin-right 0
    .sale-bottom
      display flex
      align-items center
      justify-content space-between
      border 1px solid #eee
      border-top 1px dashed #ccc
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
      bottom ($bottom-h - $circle-width / 1.5 + 3)
      left -($circle-width / 1.5)
      border-radius 0 ($circle-width) ($circle-width) 0
    .circle-right
      position absolute
      bottom ($bottom-h - $circle-width / 1.5 + 3)
      right -($circle-width / 1.5)
      border-radius ($circle-width) 0 0 ($circle-width)

    .ic-btn
      height 22px
      line-height @height
      font-size 10px

  $checkbox-width = 30px
  .ic-checkbox
    display flex
    align-items center
    .checkbox-inner
      display inline-block
      position relative
      font-size 14px
      color #666
      width $checkbox-width
      height $checkbox-width
      border-radius 50%
      border 1px solid #ccc
      text-align center
      background-color #fff
      margin-right 15px
      .checkbox-circle
        position absolute
        display inline-block
        width ($checkbox-width / 2)
        height @width
        top 50%
        left 50%
        margin-top - (@height / 2)
        margin-left -(@width / 2)
        border-radius 50%
        background-color #ff793f
      .checkbox-disabled
        background-color #f7f7f7
      &.checked
        border 1px solid #ff793f
    .checkbox-label
      color #666666
</style>
