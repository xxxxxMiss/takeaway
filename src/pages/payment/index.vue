<template>
  <div class="page-payment">
    <div>
      <a class="vendor-info"
        :href="'/pages/vendor-detail/vendor-detail?id=' + branch.id">
        <div class="info-content">
          <div class="branch">{{ branch.name }}</div>
          <div class="address">{{ branch.address }}</div>
        </div>
        <ic-icon name="jiantou"></ic-icon>
      </a>
      <div class="select-info">
        <h3>请选择就餐方式</h3>
        <ul class="get-way">
          <li class="item-way" v-for="(item, index) in list"
            :key="index"
            :class="{
              'checked': index === currentIndex,
              'no-border': index === currentIndex + 1,
              'disabled': item.is_waimai == 0
            }"
            @click="handleWay(index, item.is_waimai)">
            <ic-icon :name="item.icon"></ic-icon>
            <span>{{ item.text }}</span>
          </li>
        </ul>
        <ul>
          <li v-if="!isTakeaway">
            <h3>请选择{{ currentIndex == 0 ? '就餐' : '到店' }}时间</h3>
              <picker mode="multiSelector"
                :range="range"
                :value="multiIndex"
                @change="handleTimeChange">
                <div class="eat-time">
                  <div class="item-icon">
                    <ic-icon name="clock"></ic-icon>
                  </div>
                  <div>{{ dining_time }}</div>
                </div>
              </picker>
          </li>
          <li v-if="currentIndex == 2">
            <h3>请选择送餐地址</h3>
            <div class="first-use" v-if="!userAddress">
              <div class="use-top">
                <input :value="name"
                  @input="handleInput('name', $event)"
                  type="text" placeholder="请输入收货人姓名">
                <input :value="mobileno"
                  @input="handleInput('mobileno', $event)"
                  type="text" placeholder="请输入收货人手机">
              </div>
              <input :value="address"
                @input="handleInput('address', $event)"
                type="text" placeholder="请输入详细地址">
            </div>
            <a v-else  class="reuse" @click="goSelectAddress">
              <div class="user-info">
                <span class="name">{{ userAddress.name }}</span>
                <span>{{ userAddress.mobileno }}</span>
              </div>
              <div class="user-address">
                {{ userAddress.address }}
              </div>
              <i class="iconfont icon-jiantou"></i>
            </a>
          </li>
        </ul>
      </div>
      <div class="articel-info">
        <ul>
          <li class="item" v-for="(item, index) in cartinfo"
            :key="index">
            <div>
              <div class="name_zh">{{ item.name }}</div>
              <span class="name_en">{{ item.en_name }}</span>
            </div>
            <div>
              <span class="currency">￥</span>
              <span class="price">{{ item.price }}</span>
            </div>
            <div>
              <div class="ic-counter">
                <div v-if="item.count > 0"
                  class="btn-action"
                  @click="handleCountChange(item, -1)">-</div>
                <div v-if="item.count > 0"
                  class="counter-input">{{ item.count }}</div>
                <div class="btn-action"
                  @click="handleCountChange(item, 1)">+</div>
              </div>
            </div>
          </li>
          <li class="item" v-if="currentIndex == 2">
            <div>快递费</div>
            <div>
              <span>￥</span>
              <span>{{ branch.express_fee }}</span>
            </div>
          </li>
          <li class="item" @click="goRedpacket">
            <div>红包</div>
            <div class="sale" v-if="redPacket">
              <span>-￥</span>
              <span>{{ redPacket.amount }}</span>
            </div>
            <div class="sale" v-else>无可选红包</div>
            <i class="iconfont icon-jiantou"></i>
          </li>
          <li class="item" @click="coffeeVisible = true">
            <div>咖啡豆</div>
            <div class="sale" v-if="isUseCoffee">
              <span>-￥</span>
              <span>{{ coffeepoint }}</span>
            </div>
            <div class="sale" v-else>选择咖啡豆</div>
            <i class="iconfont icon-jiantou"></i>
          </li>
          <li class="item" @click="goRemark">
            <div class="remark-left">备注</div>
            <div class="sale remark-right">
              {{ remark || '请填写备注' }}
            </div>
            <i class="iconfont icon-jiantou"></i>
          </li>
          <li class="amount-statistic">
            <span class="desc">小计：</span>
            <span class="currency">￥</span>
            <span class="amount">{{ totalAmount }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-fixed">
     <button-pay
      text="去支付"
      @confirm="goPay"
      :amount="totalAmount"
      :show-icon="false"
      :show-collapse="false"></button-pay>
    </div>
    <div class="dialog"
      v-if="coffeeVisible">
      <div class="content-block">
        <h3>使用咖啡豆</h3>
        <div class="item">
          <span class="label">可用咖啡豆</span>
          <span class="count">{{ originCoffeepoint }}</span>
        </div>
        <div class="item">
          <span class="label">使用咖啡豆</span>
          <span>{{ coffeepoint }}</span>
        </div>
        <div class="btn-group">
          <div class="btn-cancel"
            @click="notUse">不使用</div>
          <div class="btn-confirm"
            @click="confirmUse">确认使用</div>
        </div>
      </div>
    </div>
    <div class="dialog" @click="showConfirmDailog = false"
      v-if="showConfirmDailog">
      <div class="content-block is-center">
        <img src="https://m.escoffee.net/static/architecture.png" class="architecture">
        <div class="tips">请再次确认您取餐门店</div>
        <h3 class="branch-content">{{ branch.name }}</h3>
        <div class="address">
          <ic-icon name="dingwei"></ic-icon>
          <span>{{ branch.address }}</span>
        </div>
        <div class="eat-time" v-if="!isTakeaway">
          {{ currentIndex == 0 ? '就' : '取' }}餐时间：<span>{{ currentDate }}</span>
          <span>&nbsp;&nbsp;{{ dining_time }}</span>
        </div>
        <div class="btn-online" @click.stop="handleConfirm(1)">立即支付</div>
        <div class="btn-offline" v-if="!isTakeaway"
          @click.stop="handleConfirm(0)">到店支付</div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import { formatDate, time2Number, getTimestamp } from '@/utils/js/format'
  import IcIcon from '@/components/icon'
  import IcCounter from '@/components/counter'
  import ButtonPay from '@/components/button-pay'

  function getTimeIndex (range) {
    const d = new Date()
    let h = d.getHours()
    let m = d.getMinutes()
    if (m >= 30) {
      h += 1
      m = 0
    } else {
      m = 1
    }
    let index = range.findIndex(val => val === h)
    index = index === -1 ? 0 : index
    return [index, 0, m]
  }

  export default {
    data () {
      return {
        user: {},
        currentDate: formatDate(Date.now()),
        currentIndex: 0,
        list: [
          { icon: 'kafei', text: '食堂' },
          { icon: 'gouwudai-copy', text: '外带' },
          { icon: 'waimai1', text: '外卖' }
        ],
        multiIndex: [0, 0, 0],
        dining_time: '',
        range: [],
        height: '',
        cartinfo: [],
        branch: {},
        remark: '',
        address: {
          name: '',
          mobileno: '',
          address: ''
        },
        coffeeVisible: false,
        showConfirmDailog: false,
        originCoffeepoint: '',
        coffeepoint: '',
        express_fee: 0,
        totalAmount: 0,
        redPacket: null,
        isUseCoffee: true,
        noBuy: false
      }
    },
    computed: {
      isTakeaway () {
        return this.currentIndex === 2
      },
      userAddress () {
        return this.user &&
          this.user.user_address &&
          this.user.user_address[0]
      }
    },
    watch: {
      redPacket () {
        this.handleTotalMount()
      },
      isUseCoffee () {
        this.handleTotalMount()
      }
    },
    methods: {
      goPay () {
        if (this.noBuy) {
          this.$showModal('请先选择商品')
        } else {
          this.showConfirmDailog = true
        }
      },
      goSelectAddress () {
        wx.navigateTo({
          url: '/pages/address-select/address-select?id=' + this.userAddress.id
        })
      },
      goRemark () {
        wx.navigateTo({
          url: '/pages/remark/remark'
        })
      },
      goRedpacket () {
        wx.navigateTo({
          url: `/pages/redpacket-mine/redpacket-mine?from=payment&amount=${this.caclPureMount()}&id=${this.redPacket.id}`
        })
      },
      handleCountChange (item, count) {
        item.count += count

        this.handleTotalMount()

        store.commit('setCartinfo', this.cartinfo)
      },
      notUse () {
        this.coffeeVisible = false
        this.isUseCoffee = false

        this.handleTotalMount()
      },
      confirmUse () {
        this.isUseCoffee = true
        this.coffeeVisible = false

        this.handleTotalMount()
      },
      handleInput (type, event) {
        this.address[type] = event.mp.detail.value
      },
      handleWay (index, is_waimai) {
        this.currentIndex = index
        if (is_waimai == 0) {
          return this.$showModal('对不起，您当前位置超出可配送范围')
        }

        this.handleTotalMount()
      },
      handleTimeChange (e) {
        this.multiIndex = e.mp.detail.value
        this.dining_time = this.handleSetValue(this.multiIndex, this.range)
      },
      handleSetValue (index, range) {
        const [hi, di, mi] = index
        return `${range[0][hi]}${range[1][di]}${range[2][mi]}`
      },
      caclPureMount () {
        let totalAmount = 0
        this.cartinfo.forEach(({price, count}) => {
          totalAmount += price * 1 * count
        })
        return totalAmount
      },
      // calc total amout just a condition is changed
      handleTotalMount () {
        let totalAmount = this.caclPureMount()

        // dont buy
        if (totalAmount == 0) {
          this.totalAmount = 0
          this.noBuy = true
          return
        } else {
          this.noBuy = false
        }

        // takeaway: express_fee
        if (this.currentIndex === 2) {
          totalAmount += this.express_fee
        }
        if (this.redPacket) {
          totalAmount -= this.redPacket.amount
        }
        this.totalAmount = totalAmount

        this.calcCoffeepoint()
      },
      calcCoffeepoint () {
        if (!this.isUseCoffee) return
        if (this.originCoffeepoint >= this.totalAmount) {
          // because of redPacket, totalAmount maybe nagative
          this.coffeepoint = this.totalAmount
          this.totalAmount = 0
        } else {
          this.coffeepoint = this.originCoffeepoint
          this.totalAmount -= this.originCoffeepoint
        }
      },
      pay (order_id, pay_type, callback) {
        this.$get({
          action: 'wxpay',
          order_id,
          CT_token: store.state.token
        }).then(info => info).then(info => {
          if (!info) return
          const { pay_data, coffee_coins } = info
          if (coffee_coins) {
            this.$showToast('支付成功')
            callback && callback(order_id, pay_type)
            return false
          }
          wx.requestPayment({
            ...pay_data,
            success: res => {
              this.$showToast('支付成功')
              callback && callback(order_id, pay_type)
            },
            fail: res => {
              if (res.errMsg.indexOf('fail cancel')) {
                this.$showToast('取消支付')
              } else {
                this.$showModal(res.errMsg)
              }
            }
          })
        })
      },
      handleConfirm (pay_type = 1) {
        // 1: pay-online 0:pay-offline
        if (this.currentIndex != 2 &&
            Date.now() > getTimestamp(this.dining_time)) {
          return this.$showModal('选择的时间不能小于当前时间')
        }
        if (!this.userAddress && this.currentIndex === 2) {
          if (!this.address.name) {
            return this.$showModal('请填写收货人姓名')
          }
          if (!this.address.mobileno) {
            return this.$showModal('请填写收货人手机号')
          }
          if (!this.address.address) {
            return this.$showModal('请填写收货人详细地址')
          }
        }
        let data = {
          CT_token: store.state.token,
          action: 'addorder',
          branch_id: this.branch.id,
          type: this.currentIndex,
          dining_time: time2Number(this.dining_time),
          remark: this.remark || '',
          cartinfo: this.cartinfo,
          coffee_coins: this.coffeepoint,
          pay_type
        }
        if (this.redPacket) {
          data.user_coupon_id = this.redPacket.id
        }
        if (this.userAddress) {
          data.address_id = this.userAddress.id
        } else {
          data = {
            ...data,
            ...this.address
          }
        }
        this.$get(data, true).then(info => {
          if (!info) return

          if (pay_type == 1) {
            return this.pay(info.order_id, pay_type, this.navigateToDetail)
          }
          this.navigateToDetail(info.order_id)
        })
      },
      navigateToDetail (order_id, pay_type) {
        wx.navigateTo({
          url: `/pages/order/order?order_id=${order_id}&pay_type=${pay_type}`
        })
      }
    },
    onShow () {
      const range = []
      const origin = []
      for (let i = 9; i < 22; i++) {
        origin.push(i)
        const temp = i + ''
        const int = temp[1] ? `${temp}` : `0${temp}`
        range.push(int)
      }
      this.range = [range, [':'], ['00', '30']]
      this.multiIndex = getTimeIndex(origin)
      this.dining_time = this.handleSetValue(this.multiIndex, this.range)

      // remark feild from remark page
      this.remark = this.$root.$mp.query.remark
    },
    onReady () {
      const { cartinfo, branch } = store.state
      const selectRedPacket = this.$root.$mp.query.redinfo
      this.cartinfo = cartinfo
      this.branch = branch
      this.express_fee = branch.express_fee || 0
      this.user = store.state.user
      this.originCoffeepoint = this.user.coffee_coins || 0

      // any item changed, must recalc total amount
      let totalAmount = this.caclPureMount()
      this.redPacket = selectRedPacket
        ? JSON.parse(selectRedPacket)
        : (this.user.user_coupon.valid_coupon || []).find(item => totalAmount > item.min_require)
      // default is tangshi, dont need express_fee
      this.handleTotalMount()
    },
    onUnload () {
      this.showConfirmDailog = false
    },
    components: { IcIcon, IcCounter, ButtonPay }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-payment
    box-sizing border-box
    background-color $background-color
    // padding-bottom 100px
    .vendor-info
      display flex
      align-items center
      justify-content space-between
      padding 15px
      margin-bottom 10px
      background-color #fff
      .branch
        font-size 14px
        padding-bottom 15px
      .address
        font-size 12px
        color #999

    .select-info
      background-color #fff
      padding 15px
      font-size 16px
      color #666
      margin-top 15px
      h3
        margin-top 16px
        margin-bottom 10px
      .get-way
        display flex
        align-items center
        text-align center
        font-size 18px
        .iconfont
          font-size 26px
      .item-way
        flex 1
        height 50px
        line-height @height
        border 1px solid #ccc
        border-right 0
        &:last-child
          border-right 1px solid #ccc
        &:first-child
          border-top-left-radius 6px
          border-bottom-left-radius 6px
        &:last-child
          border-top-right-radius 6px
          border-bottom-right-radius 6px
        &.checked
          color #ff793f
          border-color @color
          border-right 1px solid @color
        &.no-border
          border-left 0
        &.disabled
          background-color #eee
          border 1px solid #eee
        span
          padding-left 10px

      .eat-time
        display flex
        align-items center
        border 1px solid #ccc
        border-radius 6px
        .item-icon
          padding 5px 6px
          background-color #f3f3f3
          text-align center
          margin-right 20px
          border-top-left-radius @border-radius
          border-bottom-left-radius @border-radius
        .iconfont
          font-size 26px
      .first-use input
        border 1px solid #ccc
        border-radius 6px
        height 40px
        line-height @height
        font-size 14px
        padding 0 10px
      .use-top
        display flex
        margin-bottom 10px
        input
          flex 1
          &:first-child
            margin-right 15px

    .reuse
      position relative
      margin-top 20px
      .icon-jiantou
        right 0
        center-y()
      .user-info
        padding-bottom 7px
        font-size 14px
        .name
          margin-right 10px
      .user-address
        font-size 12px
        color #999

    .articel-info
      margin-top 15px
      padding 0 15px
      background-color #fff
      .item
        position relative
        display flex
        align-items center
        justify-content space-between
        padding 14px 0
        border-bottom 1px dashed #d8d8d8
        color #666
        box-sizing border-box
        .remark-left
          width 30%
          padding-right 16px
        .remark-right
          width 70%
          text-align right
        .sale
          color $primary
          padding-right 25px
        .arrow-right
          position absolute
          center-y()
          right 15px
      .icon-jiantou
        position absolute
        right 0
      .name_zh
        font-size 16px
      .name_en
        font-size 12px
        color #999
      .currency
        font-size 12px
      .price
        font-size 20px
      .amount-statistic
        text-align right
        padding 18px 0
        .desc
          font-size 13px
        .currency
          font-size 12px
        .amount
          font-size 24px

    .dialog
      position fixed
      z-index: $z-index['dialog']
      top 0
      left 0
      width 100%
      height 100%
      background-color rgba(0, 0, 0, .6)

    .content-block
      position absolute
      left 50%
      top 50%
      transform translate3d(-50%, -50%, 0)
      width 70%
      background-color #fff
      border-radius 6px
      padding 15px
      color #999
      &.is-center
        text-align center
        width 80%
      .tips
        padding-top 35px
      .architecture
        center-x()
        width 150px
        height 100px
        top -74px
      h3
        font-size 16px
        padding-bottom 30px
      .item
        display flex
        justify-content space-between
        align-items center
        padding 10px 0
        border-bottom 1px dashed #d8d8d8
        .label
          color #999
        .count
          font-size 18px
        input
          box-sizing border-box
          width 60px
          height 30px
          line-height @height
          border 1px solid #ccc
          border-radius 8px
          padding 0 10px

      .btn-group
        display flex
        margin-top 15px
        .btn-confirm, .btn-cancel
          flex 1
          height 35px
          line-height @height
          color #fff
          border-radius 25px
          text-align center
        .btn-confirm
          background-color #e15f41
        .btn-cancel
          background-color #999
          margin-right 10px

      .address
        display flex
        justify-content center
        align-items center
        margin-bottom 35px

      .branch-content
        font-size 18px
        color #333
        padding 25px 15px 20px

      .btn-offline, .btn-online
        width 80%
        height 35px
        line-height @height
        color #fff
        border-radius 25px
        text-align center
        margin 0 auto
      .btn-offline
        background-color #778beb
      .btn-online
        background-color #e15f41
        margin-top 40px
        margin-bottom 15px

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
</style>
