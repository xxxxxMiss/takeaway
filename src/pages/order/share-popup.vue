<template>
  <div class="share-popup-backdrop" v-if="visible"
    @click="closePopup">
    <div class="share-popup">
      <div class="header">
        <span>把红包分享给好友</span>
        <ic-icon name="close" @click.stop="closePopup"></ic-icon>
      </div>
      <div class="wechat-logo">
        <button open-type="share" class="wechat-bg"
          @click.stop="handleShare">
          <ic-icon name="wechat"></ic-icon>
        </button>
      </div>
      <div>微信</div>
    </div>
  </div>
</template>

<script>
  import IcIcon from '@/components/icon'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closePopup () {
        this.$emit('close')
      },
      handleShare () {
        this.$emit('wechat-share')
      }
    },
    components: { IcIcon }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .share-popup-backdrop
    position fixed
    left 0
    top 0
    height 100%
    width 100%
    background-color rgba(0, 0, 0, .4)
  .share-popup
    position absolute
    left 0
    bottom 0
    right 0
    background-color #fff
    text-align center
    padding 18px 16px
    .header
      position relative
      padding-bottom 15px
      color #999
    .wechat-logo
      margin-bottom 10px
    .wechat-bg
      display inline-block
      width 60px
      line-height @width
      height @width
      background-color #33cc33
      border-radius 50%
    .icon-close
      position absolute
      center-y()
      right 0
      margin-top -10px
    .icon-wechat
      color #fff
</style>
