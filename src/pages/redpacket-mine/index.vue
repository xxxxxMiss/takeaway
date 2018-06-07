<template>
  <div class="page-redpacket-mine">
    <ic-sale v-for="(item, index) in sales"
      :show-checkbox="from ==='payment'"
      :is-checked="item.id == checkedSaleId"
      :is-disabled="amount * 1 < item.amount * 1"
      :info="item"
      :key="item.id"
      :showButton="showButton"
      @button-click="handleButtonClick"
      @checkbox-click="handleCheckClick"></ic-sale>
  </div>
</template>

<script>
  import store from '@/store'
  import IcSale from '@/components/sale'

  export default {
    data () {
      return {
        sales: [],
        from: 'mine',
        amount: '',
        checkedSaleId: '',
        showButton: false
      }
    },
    methods: {
      handleCheckClick (info) {
        wx.navigateTo({
          url: `/pages/payment/payment?redinfo=${JSON.stringify(info)}`
        })
      },
      handleButtonClick () {
        wx.navigateTo({
          url: '/pages/map/map'
        })
      }
    },
    onShow () {
      const { from, amount, id } = this.$root.$mp.query
      this.amount = amount
      this.from = from
      this.checkedSaleId = id

      const ret = []
      const { invalid_coupon, valid_coupon } = store.state.user.user_coupon
      ret.push.apply(ret, valid_coupon)
      if (from && from === 'mine') {
        this.showButton = true
        ret.push.apply(ret, invalid_coupon)
      } else {
        this.showButton = false
      }
      this.sales = ret
    },
    onUnload () {
      this.checkedSaleId = ''
    },
    components: { IcSale }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-redpacket-mine
    padding 15px
    text-align center
    background-color #fff
    .ic-sale-box
      width 95%
      margin-bottom 10px
</style>
