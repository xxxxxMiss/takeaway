<template>
  <div class="page-phone-bind">
    <div class="form-container">
      <div class="form-item">
        <input v-model="mobileno" placeholder="请输入手机号"></input>
      </div>
      <div class="form-item">
        <input v-model="code" placeholder="请输入短信验证码"></input>
        <ic-button @click="getMsgCode"
          timer
          type="primary"
          size="mini"
          content="获取验证码"></ic-button>
      </div>
      <div class="btn-container">
        <ic-button @click="confirm"
          content="绑定手机"
          block
          type="primary"></ic-button>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import IcButton from '@/components/button'
  import IcIcon from '@/components/icon'

  export default {
    data () {
      return {
        mobileno: '',
        code: ''
      }
    },
    methods: {
      getMsgCode () {
        if (!this.mobileno) return this.$showToast('请输入手机号')
        this.$get({
          action: 'getauthcode',
          mobileno: this.mobileno
        }).then(info => {
          if (info) {
            this.$showToast('短信验证码已发出')
          }
        })
      },
      confirm () {
        if (!this.mobileno) {
          return this.$showToast('请输入手机号')
        }
        if (!this.code) {
          return this.$showToast('请输入短信验证码')
        }
        this.$get({
          action: 'updatemobile',
          mobileno: this.mobileno,
          code: this.code,
          CT_token: store.state.token
        }).then(info => {
          if (info) {
            this.$showToast('绑定成功')
            wx.navigator({ url: '/pages/index/index' })
          }
        })
      }
    },
    components: { IcButton, IcIcon }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  page
    height 100%
  .page-phone-bind
    box-sizing border-box
    height 100%
    padding 20px 10px
    background url(https://m.escoffee.net/static/login_bg.jpg) no-repeat center
    .form-container
      background-color #fff
      border-radius 4px
      padding 25px 15px 10px
      .form-item
        display flex
        justify-content space-between
        align-items center
        border-bottom $border
        padding 10px
        input
          flex 3
          padding-right 15px
        .ic-btn
          flex 1
          font-size 12px
      .btn-container
        margin 30px auto
        .ic-btn--block
          border-radius 4px
</style>
