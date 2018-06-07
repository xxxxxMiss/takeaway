<template>
  <div class="page-convert-coffeepoint">
    <div class="card-container">
      <div class="card">
        <div class="card-left">
          <input v-model="number.first"
            :focus="current == 0"
            @input="handleInput(0, $event)"
            @focus="handleFocus(0)"
            maxlength="4"
            type="number"
            placeholder="8888">
          <input v-model="number.second"
            :focus="current == 1"
            @input="handleInput(1, $event)"
            @focus="handleFocus(1)"
            maxlength="4"
            type="number"
            placeholder="8888">
          <input v-model="number.third"
            :focus="current == 2"
            @input="handleInput(2, $event)"
            @focus="handleFocus(2)"
            maxlength="4"
            type="number"
            placeholder="8888">
        </div>
        <div class="card-right"></div>
        <div class="card-divider"></div>
      </div>
      <div class="desc">请输入券码兑换咖啡币</div>
    </div>
    <div class="btn-container">
      <span class="btn-convertion" @click="convert">立即兑换</span>
    </div>
  </div>
</template>

<script>
  import IcButton from '@/components/button'
  import store from '@/store'

  export default {
    data () {
      return {
        number: {
          first: '',
          second: '',
          third: ''
        },
        current: 0,
        length: 0
      }
    },
    methods: {
      handleInput (index, e) {
        this.length = this.length || Object.keys(this.number).length
        if (e.mp.detail.value.length === 4 &&
          this.current <= this.length) {
          this.current = index + 1
        }
      },
      // reset current for user's trigger
      handleFocus (index) {
        this.current = index
      },
      convert () {
        const values = Object.values(this.number)
        if (values.some(v => v.length != 4)) {
          return this.$showToast('请输入正确的兑换码')
        }
        this.$get({
          action: 'exchagecard',
          card_num: values.join(''),
          CT_token: store.state.token
        }, true).then(info => {
          if (!info) return
          this.$showToast(`兑换成功：+${info.add_coins}`)
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 3000)
          Object.keys(this.number).forEach(key => {
            this.number[key] = ''
          })
        })
      }
    },
    components: { IcButton }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-convert-coffeepoint
    .card-container
      height 250px
      background-color #706fd3
      padding-top 38px
    .card
      position relative
      display flex
      margin 0 12px
      height 170px
      border-radius radius = 20px
      background-color #eee
      box-shadow 0 0 1px rgba(5, 5, 41, 0)
      background-color #fff
      input
        width 45px
        height 40px
        line-height 40px
        padding 0 10px
        border-radius 6px
        background-color #fff
        margin-bottom 10px
        &:first-child
          margin-right 8px
          margin-left 10px
        &:last-child
          margin-left 8px
      .card-left
        display flex
        box-sizing border-box
        height 100%
        width calc(100% - 80px)
        background-color #f3f3f3
        padding-top 40px
        border-top-left-radius radius
        border-bottom-left-radius radius
      .card-right
        width 80px
        height 100%
        background url(https://m.escoffee.net/static/sale_logo.png) no-repeat center 25px
        background-size 38px 17px
        background-color #fff
        border-top-right-radius radius
        border-bottom-right-radius radius
      .card-divider
        position absolute
        left 0
        width 100%
        bottom 31px
        background-color #7a8288
        height 50px
    .desc
      margin-top 15px
      text-align center
      font-size 14px
      color #474787

    .btn-container
      margin -25px auto 0
      width 200px
      border-radius 120px 120px 0 0
      background-color #fff
      text-align center
      padding-top 15px
      .btn-convertion
        display inline-block
        width 100px
        height 30px
        line-height @height
        background-color #474787
        color #fff
        border-radius 25px
</style>
