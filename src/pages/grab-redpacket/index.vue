<template>
  <div class="page-grap-redpacket">
    <div class="top">
      <div class="title">这是我在<span>Edu Space</span>领取的红包，分享给你！ </div>
    </div>
    <img class="wave" src="https://m.escoffee.net/static/wave.png">
    <div class="bottom">
      <img class="avatar" :src="user.avatar" alt="头像">
      <div class="nickname">{{ user.nickname }}的红包</div>
      <ic-sale :info="info" show-button
        @button-click="goToUse"></ic-sale>
    </div>
  </div>
</template>

<script>
  import IcSale from '@/components/sale'

  export default {
    data () {
      return {
        user: {},
        info: {}
      }
    },
    methods: {
      goToUse () {
        wx.redirectTo({
          url: '/pages/map/map'
        })
      }
    },
    onReady () {
      // http://m.escoffee.net/?action=getshareinfo&send_user_id=7
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res.code)
          },
          fail: () => {
            reject(new Error('调用wx.login接口失败'))
          }
        })
      }).then(code => code).then(code => {
        return this.$get({
          action: 'wxlogin',
          code
        })
      }).then(info => info).then(io => {
        if (!io) return
        const id = this.$root.$mp.query.user_id
        this.$get({
          action: 'getshareinfo',
          send_user_id: id,
          CT_token: io.token
        }).then(info => {
          if (!info) return
          this.user = info.send_user_info
          this.info = info.coupon_info
          this.$get({
            action: 'receivecoupon',
            send_user_id: id,
            CT_token: io.token
          }, true).then(info => {
            if (!info) return
          })
        })
      })
    },
    components: { IcSale }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-grap-redpacket,page
    height 100%
    overflow hidden
    .top
      background-color rgb(191,44,44)
      height 100px
      .title
        text-align center
        font-size 12px
        color #fff
        padding 16px
    .bottom
      position relative
      top -10px
      background-color rgb(233,222,99)
      height 100%
      text-align center
      .avatar
        width 72px
        height @width
        border-radius 50%
        border 2px solid #fff
        position absolute
        left 50%
        top -(@width - 10px)
        margin-left -(@width / 2)
      .nickname
        padding-top 16px
        padding-bottom 50px
        text-align center
        color #fff
        font-size 12px
    .wave
      width 100%
      height 60px

    .ic-sale-box
      width 95%
      background-color #fff
      .circle-left,.circle-right
        background-color rgb(233,222,99)
</style>
