<template>
  <scroll-view class="page-buy">
    <div class="env-container">
      <img :src="branch.img">
      <a class="address" :href="href">
        <ic-icon name="dingwei"></ic-icon>
        <span>{{ branch.name }}</span>
        <i class="iconfont icon-jiantou"></i>
      </a>
    </div>
    <div class="filter-section">
      <div class="ic-filter" :class="{'isFixed': isFixed}">
        <div class="filter-menu">
          <ul>
            <li class="menu-item"
              :class="{ 'checked': index === currentIndex }"
              v-for="(item, index) in info.menus"
              :key="index"
              @click="handleMenuClick(item, index)">
              <img class="item-img" :src="item.img">
              <div class="item-text">{{ item.name }}</div>
            </li>
          </ul>
        </div>
        <div class="filter-goods">
          <ul>
            <li class="good-item"
              v-for="(good, index) in info.goods"
              :key="index">
              <ul v-show="index === currentIndex">
                <li class="item-card"
                  v-for="(item, idx) in good"
                  :key="item.count">
                  <div class="card-image">
                    <img :src="item.img">
                  </div>
                  <div class="card-desc">
                    <div>
                      <span class="name">{{ item.name }}</span>
                    </div>
                    <div class="amount-row">
                      <span class="currency">￥</span>
                      <span class="amount">{{ item.price }}</span>
                    </div>
                    <div class="ic-counter">
                      <div v-if="item.count > 0"
                        class="btn-action"
                        @click="handleCount(item, -1)">-</div>
                      <div v-if="item.count > 0"
                        class="counter-input">{{ item.count }}</div>
                      <div class="btn-action"
                        @click="handleCount(item, 1)">+</div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn-container" v-if="cartinfo.length > 0">
      <div class="pay-container">
        <div class="pay-collapse"
          @click="showCollapse">
          <ic-icon name="z-arrowUp"></ic-icon>
        </div>
        <div class="info-content">
          <div class="info-left" @click="showCollapse">
            <div class="pay-badge">
              <ic-icon name="diancan"></ic-icon>
              <div class="badge-container">
                <span class="ic-badge">
                  {{ totalCount }}
                </span>
              </div>
            </div>
            <div class="pay-info">
              <span class="currency">￥</span>
              <span class="amount">{{ totalAmount }}</span>
            </div>
          </div>
          <div class="pay-action" @click="handleConfirm">
            <span>选好了</span>
            <ic-icon name="jiantou"></ic-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-backdrop" v-if="isShow">
      <div class="panel-container" :style="{'height': panelHeight}">
        <div class="pay-collapse"
          @click="hideCollapse">
          <ic-icon name="z-arrowDown"></ic-icon>
        </div>
        <panel-item
          @panel-count-change="handlePanelChange"
          :height="panelHeight"
          :items="cartinfo"></panel-item>
      </div>
    </div>
  </scroll-view>
</template>

<script>
  import store from '@/store'
  import IcIcon from '@/components/icon'
  import IcFilter from '@/components/filter'
  import ButtonPay from '@/components/button-pay'
  import PanelItem from './panel-item'

  const BANNER_HEIGHT = 180
  const PANEL_ITEM_HEIGHT = 104

  export default {
    data () {
      return {
        branch: {},
        info: {},
        cartinfo: [],
        totalCount: 0,
        totalAmount: 0,
        isShow: false,
        panelHeight: 'auto',
        currentIndex: 0,
        isFixed: false
      }
    },
    computed: {
      href () {
        return `/pages/vendor-detail/vendor-detail?id=${this.branch.id}`
      }
    },
    watch: {
      cartinfo (newVal) {
        const len = newVal.length
        if (newVal.length === 0) {
          this.isShow = false
        }

        if (len && len <= 2) {
          this.panelHeight = `${PANEL_ITEM_HEIGHT * len}px`
        }
      }
    },
    methods: {
      handleMenuClick (item, index) {
        this.currentIndex = index
      },
      showCollapse () {
        if (this.cartinfo.length > 0) {
          this.isShow = !this.isShow
        }
      },
      hideCollapse () {
        this.isShow = false
      },
      handleConfirm () {
        if (this.cartinfo.length < 1) {
          return this.$showModal('请先选择商品')
        }
        wx.navigateTo({
          url: `/pages/payment/payment?amount=${this.totalAmount}`
        })
        store.commit('setCartinfo', this.cartinfo)
        store.commit('setBranch', this.branch)
      },
      handlePanelChange ({item, count}) {
        this.handleCount(item, count)

        const { menus, goods } = this.info
        const menuIndex = menus.findIndex(val => val.big_sort_id === item.big_sort_id)
        const goodIndex = goods[menuIndex].findIndex(val => val.id === item.id)

        goods[menuIndex][goodIndex].count = count
        this.info = { menus, goods }
      },
      handleCount (item, count) {
        item.count += count
        const index = this.cartinfo.findIndex(val => val.id == item.id)

        if (index > -1) {
          if (item.count == 0) {
            this.cartinfo.splice(index, 1)
          } else {
            this.cartinfo.splice(index, 1, item)
          }
        } else {
          this.cartinfo.push(item)
        }

        this.handleTotal()
      },
      handleTotal () {
        let totalCount = 0
        let totalAmount = 0

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
        branch_id: id || '', // caution: serialize `undefined` to string
        CT_token: store.state.token
      }, true).then(info => {
        if (!info) return

        const { branch_info, goods_list, sort_list } = info
        this.branch = branch_info

        // fuck clearing origin data
        const cartinfo = store.state.cartinfo
        this.cartinfo = cartinfo
        this.handleTotal()

        const goods = []
        Object.keys(goods_list).forEach((value, index) => {
          const good = goods_list[value].map(item => {
            item.count = 0
            return item
          })
          cartinfo.forEach(item => {
            good.forEach(d => {
              if (d.id === item.id) {
                d.count = item.count
              }
            })
          })
          const i = sort_list.findIndex(item => item.big_sort_id === value)
          goods[i] = good
        })

        this.info = { menus: sort_list, goods }
      })
    },
    onPageScroll (e) {
      if (e.scrollTop >= BANNER_HEIGHT) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    components: { IcIcon, IcFilter, ButtonPay, PanelItem }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-buy
    background-color $background-color
    height 100%
    overflow hidden
    .env-container
      position relative
      line-height 0
      margin-bottom 12px
      img
        width 100%
        max-height 180px
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

    .pay-container
      position relative
      .info-content, .info-left
        display flex
        align-items center
        background-color $primary
        color #fff
      .info-content
        padding 13px 16px
      .info-left
        flex 3
        padding-left 0
        padding-right 25px
      .pay-action
        flex 1
        display flex
        text-align right
        align-items center
        justify-content flex-end
        span
          padding-right 15px
      .icon-diancan
        font-size 30px
        line-height 1.1
        padding-right 25px
      .currency
        font-size 12px
      .amount
        font-size 20px
      .pay-badge
        position relative
      .badge-container
        position absolute
        top 0
        right 0
      .pay-collapse
        background-color $primary
        color #fff
        width 52px
        height @width
        border-radius 50%
        center-x()
        z-index 0
        top -(@width / 3)
        text-align center

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
      bottom 57px
      width 100%
      background-color #fff
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


  .ic-filter
    display flex
    background-color $background-color
    &.isFixed
      .filter-menu
        position fixed
        top 0
      .filter-goods
        margin-left 82px
    .filter-menu
      box-sizing border-box
      height 100%
      width 66px
      margin-right 16px
      color #666
      text-align center
      font-size 12px
      ul
        height 100%
      .menu-item
        background-color #fff
        padding 22px 2px
        margin 4px 0
        &.checked
          background-color $background-color
          border-left 3px solid #cc8e35
          color #cc8e35
        .item-img
          display none
          width 54px
          height 58px
        &.checked .item-img
          display inline-block
        &.checked .item-text
          padding-top 9px

    .filter-goods
      box-sizing border-box
      width calc(100% - 66px)
      background-color $background-color
      padding-right 16px
      padding-bottom 70px
      ul
        height 100%
      .item-card
        display flex
        justify-content space-between
        align-items center
        padding 12px
        border $border
        border-radius 4px
        margin-bottom 12px
        background-color #fff
        .card-image
          width 100px
          height @width
          img
            width 100%
            height 100%
        .card-desc
          text-align right
          .name
            font-size 16px
            padding-right 10px
          .en_name
            font-size 12px
            color #999
        .amount-row
          padding 15px 0
        .currency
          color $primary
          font-size 12px
        .amount
          color $primary
          font-size 18px

  .ic-counter
    display flex
    justify-content flex-end
    align-items center
    text-align center
    color $gray-dark
    font-size 16px

    .btn-action
      display inline-block
      width 20px
      height @width
      line-height (@width - 4)
      border 1px solid $primary
      border-radius 50%
      font-size 24px
      color $primary
      background-color #fff
      margin 0
      padding 0
      outline none

    .counter-input
      width 40px

  +prefix-classes($prefix-classes)
    .badge
      display inline-block
      padding 1px 6px
      background-color #000
      color $white
      border-radius 11px
      &--dot
        width 10px
        height 10px
        border-radius 50%
        padding 0
</style>
