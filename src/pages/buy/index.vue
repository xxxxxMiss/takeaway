<template>
  <div class="page-buy">
    <div class="env-container">
      <img :src="branch.img">
      <a class="address" :href="href">
        <ic-icon name="dingwei"></ic-icon>
        <span>{{ branch.content }}-{{ branch.address }}</span>
        <i class="iconfont icon-jiantou"></i>
      </a>
    </div>
    <div class="filter-section">
      <ic-filter :height="height"
        :info="info" @count-change="handleCount"></ic-filter>
    </div>
    <div class="btn-container">
      <button-pay
        @confirm="handleConfirm"
        @collapse-click="showCollapse"
        :count="totalCount"
        :amount="totalAmount"></button-pay>
    </div>
    <div class="panel-backdrop" v-if="isShow">
      <div class="panel-container">
        <div class="pay-collapse"
          @click="hideCollapse">
          <ic-icon name="z-arrowDown"></ic-icon>
        </div>
        <panel-item @panel-count-change="handlePanelChange"
          :items="cartinfo"></panel-item>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import IcIcon from '@/components/icon'
  import IcFilter from '@/components/filter'
  import ButtonPay from '@/components/button-pay'
  import PanelItem from './panel-item'

  export default {
    data () {
      return {
        branch: {},
        info: {},
        cartinfo: [],
        totalCount: 0,
        totalAmount: 0,
        isShow: false,
        height: 'auto'
      }
    },
    computed: {
      href () {
        return `/pages/vendor-detail/vendor-detail?id=${this.branch.id}`
      }
    },
    watch: {
      cartinfo (newVal) {
        if (newVal.length === 0) {
          this.isShow = false
        }
      }
    },
    methods: {
      showCollapse () {
        this.isShow = true
      },
      hideCollapse () {
        this.isShow = false
      },
      handleConfirm () {
        if (this.cartinfo.length < 1) {
          return wx.showModal({
            title: '提示',
            content: '请先选择商品',
            showCancel: false,
            confirmColor: '#ff7a3d'
          })
        }
        wx.navigateTo({
          url: '/pages/payment/payment'
        })
        store.commit('setBuyGoods', {
          branch: this.branch,
          cartinfo: this.cartinfo,
          totalAmount: this.totalAmount,
          totalCount: this.totalCount
        })
      },
      handlePanelChange (data) {
        const {item, count} = data
        const { menuIndex, goodIndex } = item
        const { goods } = this.info

        goods[menuIndex][goodIndex].count = count
        this.info = { ...this.info, goods }

        this.handleCount({
          item,
          count,
          menuIndex,
          goodIndex
        })
      },
      handleCount (data) {
        const { item, count, menuIndex, goodIndex } = data
        const index = this.cartinfo.findIndex(val => val.id == item.id)
        let totalCount = 0
        let totalAmount = 0

        if (index > -1) {
          if (count == 0) {
            this.cartinfo.splice(index, 1)
          } else {
            this.cartinfo.splice(index, 1, { ...item, count, menuIndex, goodIndex })
          }
        } else {
          this.cartinfo.push({ ...item, count, menuIndex, goodIndex })
        }
        this.cartinfo.forEach(({ count, price }) => {
          totalCount += count * 1
          totalAmount += count * 1 * price
        })
        this.totalCount = totalCount
        this.totalAmount = totalAmount
      }
    },
    onShow () {
      let { log, lat, id } = this.$root.$mp.query
      this.$get({
        action: 'goodslist',
        log,
        lat,
        branch_id: id,
        CT_token: store.state.token
      }).then(info => {
        if (info) {
          const { branch_info, goods_list, sort_list } = info
          this.branch = branch_info

          const goods = []
          Object.keys(goods_list).forEach((value, index) => {
            const good = goods_list[value].map(item => {
              item.count = 0
              return item
            })
            const i = sort_list.findIndex(item => item.big_sort_id === value)
            goods[i] = good
          })
          this.info = { menus: sort_list, goods }
        }
      })
    },
    onReady () {
      const sysinfo = wx.getSystemInfoSync()
      this.height = `${sysinfo.windowHeight - 78 - 240}px`
    },
    components: { IcIcon, IcFilter, ButtonPay, PanelItem }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  page
    height 100%
    overflow hidden
  .page-buy
    background-color $background-color
    height 100%
    overflow hidden
    .env-container
      position relative
      img
        width 100%
        max-height 260px
      .address
        box-sizing border-box
        position absolute
        left 0
        width 100%
        bottom 0
        display flex
        height 50px
        line-height @height
        background-color rgba(0, 0, 0, .5)
        color #fff
        font-size 12px
        padding 0 30px
        span
          padding-left 10px
          ellipsis()
        .icon-jiantou
          center-y()
          right 15px

    .filter-section
      margin-bottom 80px
    .btn-container
      position fixed
      width 100%
      left 0
      bottom 0

    .panel-backdrop
      position fixed
      z-index 9
      left 0
      top 0
      bottom 68px
      width 100%
      background-color rgba(0, 0, 0, 0.3)
    .panel-container
      position fixed
      z-index 11
      left 0
      bottom 68px
      width 100%
      height 400px
      background-color #fff
      overflow hidden
      .icon-z-arrowDown
        color #e1e1e1
      .pay-collapse
        background-color #fff
        width 50px
        height @width
        border-radius 50%
        center-x()
        z-index 0
        top -(@width / 3)
        text-align center
</style>
