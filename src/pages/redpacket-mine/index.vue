<template>
  <div class="page-redpacket-mine">
    <ic-sale v-for="(item, index) in sales"
      :info="item" :key="index"></ic-sale>
  </div>
</template>

<script>
  import store from '@/store'
  import IcSale from '@/components/sale'

  export default {
    data () {
      return {
        sales: []
      }
    },
    onShow () {
      this.sales = store.state.user.user_coupon || []
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
</style>
