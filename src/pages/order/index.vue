<template>
  <div class="page-order">
    <div class="status-container"
      :style="{ 'background-image': bgimg } ">
      <!-- 堂食，外带 0，1 -->
      <div class="type-0" v-if="type != 2">
        <div class="status-0" v-if="status == 0 && !isOnlinePay">
          <h3 class="status">等待支付</h3>
          <div class="status-desc">超过预约时间半小时将自动取消订单</div>
          <div class="timer-block">
            <div>预约到达门店时间</div>
            <div class="timer">{{ dingTime }}</div>
          </div>
        </div>
        <div class="status-0" v-if="status == 0 && isOnlinePay">
          <h3 class="status">待支付</h3>
          <div class="status-desc">逾期未支付订单将自动取消</div>
          <div class="timer">{{ expiresTime }}</div>
          <div class="btn-round" @click="pay">立即支付</div>
        </div>
        <div class="status-1" v-if="status == 1">
          <h3>待取餐</h3>
          <div class="status-desc">订单已完成，请尽快到达门店取餐</div>
        </div>
        <div class="status-2" v-if="status == 2">
          <h3>已完成</h3>
          <div class="status-desc">感谢您的耐心等待，祝您用餐愉快</div>
        </div>
        <div class="timer-block" v-if="status == 1 && !isOnlinePay">
          <div>预约到达门店时间</div>
          <div class="timer">{{ dingTime }}</div>
        </div>
        <div class="code-block" v-if="status == 1 && isOnlinePay">
          <div>取餐码</div>
          <div class="btn-round is-filled">{{ orderinfo.dining_code }}</div>
        </div>
        <div class="star-block" v-if="status == 2">
          <div>亲，给个好评吧</div>
          <i class="iconfont icon-daohang"
            v-for="i in 5" :key="i"></i>
        </div>
        <div class="process-container">
          <span :class="{'is-active': status == 0}">付款</span>
          <span class="dot-line"></span>
          <span :class="{'is-active': status == 1}">到达门店</span>
          <span class="dot-line"></span>
          <span :class="{'is-active': status == 2}">完成</span>
        </div>
      </div>
      <!-- 外卖 2 -->
      <div class="type-2" v-if="type == 2">
        <div class="status-0" v-if="status == 0">
          <h3 class="status">待支付</h3>
          <div class="status-desc">逾期未支付订单将自动取消</div>
          <div class="timer"></div>
          <div class="btn-round" @click="pay">立即支付</div>
        </div>
        <div class="status-1" v-if="status == 1">
          <h3>等待配送</h3>
          <div class="status-desc">
            外卖小哥哥正在赶往目的地，请您耐心等待...
          </div>
          <div class="btn-round" @click="visible = true">发红包</div>
        </div>
        <div class="star-block" v-if="status == 2">
          <div>亲，给个好评吧</div>
          <i class="iconfont icon-daohang"
            v-for="i in 5" :key="i"></i>
        </div>
        <div class="process-container">
          <span :class="{'is-active': status == 0}">付款</span>
          <span class="dot-line"></span>
          <span :class="{'is-active': status == 1}">等待配送</span>
          <span class="dot-line"></span>
          <span :class="{'is-active': status == 2}">完成</span>
        </div>
      </div>
    </div>
    <div class="address-info">
      <div class="left">
        <div>{{ branch.name }}</div>
        <div class="address">{{ branch.address }}</div>
      </div>
      <div class="right">
        <a class="btn-round" @click="openLocation">导航</a>
      </div>
    </div>
    <div class="articel-info">
      <ul>
        <li class="item" v-for="(item, index) in cartinfo"
          :key="index">
          <div>
            <div class="name_zh">{{ item.goods_name }}</div>
            <span class="name_en"></span>
          </div>
          <div>
            <span class="currency">￥</span>
            <span class="price">{{ item.price }}</span>
          </div>
          <div>
            <span>&times;</span><span>{{ item.count }}</span>
          </div>
        </li>
        <li class="item">
          <div>快递费</div>
          <div>
            <span>￥</span>
            <span>{{ orderinfo.express_fee_price }}</span>
          </div>
        </li>
        <li class="item">
          <div>红包</div>
          <div class="sale">
            <span>-￥</span>
            <span>{{ orderinfo.coupon_money  }}</span>
          </div>
        </li>
        <li class="item">
          <div>咖啡豆</div>
          <div class="sale">
            <span>-￥</span>
            <span>{{ orderinfo.coffee_coins }}</span>
          </div>
        </li>
        <li class="amount-statistic">
          <span class="desc">小计：</span>
          <span class="currency">￥</span>
          <span class="amount">{{ orderinfo.total_money }}</span>
        </li>
      </ul>
    </div>
    <div class="order-info">
      <ul>
        <li class="order-item" v-if="!isSelfGetting">
          <div class="left">收货人</div>
          <div class="right">{{ orderinfo.name }}</div>
        </li>
        <li class="order-item" v-if="!isSelfGetting">
          <div class="left">配送地址</div>
          <div class="right">{{ orderinfo.address }}</div>
        </li>
        <li class="order-item">
          <div class="left">订单号</div>
          <div class="right">{{ orderinfo.order_num }}</div>
        </li>
        <li class="order-item">
          <div class="left">下单时间</div>
          <div class="right">{{ addTime }}</div>
        </li>
        <li class="order-item" v-if="orderinfo.remark">
          <div class="left">备注</div>
          <div class="right">{{ orderinfo.remark }}</div>
        </li>
      </ul>
    </div>
    <share :visible="visible" @close="visible = false"></share>
  </div>
</template>

<script>
  import store from '@/store'
  import Share from '../order/share-popup'
  import { formatTime, formatDate } from '@/utils/js/format'

  export default {
    data () {
      return {
        cartinfo: [],
        orderinfo: {},
        branch: {},
        visible: false
      }
    },
    computed: {
      bgimg () {
        const prefix = 'https://m.escoffee.net/static/'
        return {
          '-1': `url(${prefix}ddbg_start.png)`,
          '0': `url(${prefix}ddbg_start.png)`,
          '1': `url(${prefix}ddbg_processing.png)`,
          '2': `url(${prefix}ddbg_end.png)`
        }[this.status]
      },
      type () { // 0:堂食 1:外带 2:外卖
        return this.orderinfo.order_type
      },
      isSelfGetting () {
        return this.type == 0 || this.type == 1
      },
      isOnlinePay () {
        return this.orderinfo.pay_type == 1
      },
      dingTime () {
        return formatTime(this.orderinfo.dining_time)
      },
      status () { // 0 unpay 1 paied 2 order-end
        return this.orderinfo.status || -1
      },
      addTime () {
        return formatDate(this.orderinfo.add_time * 1000, true)
      },
      expiresTime () {
        return formatTime((this.orderinfo.dining_time / 2 + 0.5) * 2)
      }
    },
    methods: {
      openLocation () {
        const { lat, log, address } = this.branch
        // lat and log must be numbers in openLocation api
        wx.openLocation({
          latitude: lat * 1,
          longitude: log * 1,
          name: address
        })
      },
      setTitle () {
        wx.setNavigationBarTitle({
          title: this.isSelfGetting ? '到店取餐' : '外卖'
        })
      },
      pay () {
        this.$get({
          action: 'wxpay',
          order_id: this.orderinfo.id,
          CT_token: store.state.token
        }).then(info => info).then(info => {
          if (!info) return
          const { pay_data, coffee_coins } = info
          if (coffee_coins) return this.$showToast('支付成功')
          wx.requestPayment({
            ...pay_data,
            success: res => {
              this.$showToast('支付成功')
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
      }
    },
    onShow () {
      this.branch = store.state.branch
      const { order_id, pay_type } = this.$root.$mp.query

      const data = {
        action: 'orderinfo',
        order_id,
        CT_token: store.state.token
      }
      // pay-offline
      if (pay_type == 0) {
        data.no_pay = 1
      }
      this.$get(data).then(info => {
        if (!info) return
        const { cartinfo, orderinfo } = info
        this.cartinfo = cartinfo
        this.orderinfo = orderinfo

        this.setTitle()
      })
    },
    onShareAppMessage () {
      return {
        path: `/pages/grab-redpacket/grab-redpacket?user_id=${store.state.user.id}`,
        imageUrl: '',
        success: () => {
          this.visible = false
        }
      }
    },
    onUnload () {
      store.commit('setBranch', {})
      store.commit('setCartinfo', [])
      wx.navigateBack({
        delta: getCurrentPages().length + 1
      })
    },
    components: { Share }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-order
    background-color $background-color
    padding-bottom 30px

    .status-container
      background-color #fff
      background-size 95%
      background-repeat no-repeat
      background-position center
      text-align center
      color #ccc
      .type-0, .type-1, .type-2
        padding 25px 0 40px
      .status-0, .status-1, .status-2
        margin-top 35px
      h3
        font-size 18px
        color #333
      .timer-block
        margin 20px auto
      .timer
        font-weight bold
        font-size 18px
        padding-top 10px
        color $primary
      .status-desc
        font-size 12px
        padding 10px 15px 15px
      .process-container
        display flex
        align-items center
        width 70%
        margin 0 auto
        .dot-line
          height 1px
          width 35px
          border-bottom 1px dashed #999
          margin 0 15px
      .btn-round
        display inline-block
        box-sizing border-box
        height 35px
        line-height @height
        color #ff793f
        border 1px solid @color
        border-radius 25px
        padding 0 45px
        background-color #fff
        margin 20px auto
        &.is-filled
          background-color #706fd3
          color #fff
          padding 0 50px
          border 0
          padding 0 50px
      .is-active
        color #ff793f

    .address-info
      display flex
      align-items center
      justify-content space-between
      padding 15px
      margin-bottom 10px
      background-color #fff
      .left
        flex 3
      .right
        flex 1
        text-align right
        padding-left 20px
      .btn-round
        box-sizing border-box
        display inline-block
        height 30px
        line-height @height
        min-width 90px
        text-align center
        color $primary
        border 1px solid $primary
        border-radius 20px
      .address
        font-size 12px
        color #999
        padding-top 10px

    .articel-info
      margin-bottom 15px
      padding 0 15px
      background-color #fff
      .btn-round
        height 30px
        line-height @height
        border 1px solid $primary
        color $primary
        padding 0 20px
        border-radius 20px
        text-align center
      .item
        position relative
        display flex
        align-items center
        justify-content space-between
        padding 14px 0
        border-bottom 1px dashed #d8d8d8
        color #666
        .sale
          color $primary
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

    .order-info
      background-color #fff
      .order-item
        display flex
        margin 0 15px
        border-bottom 1px dashed #d8d8d8
        padding 15px 0
        align-items center
        justify-content space-between
        &:last-child
          border-bottom 0
        .left
          flex 1
        .right
          flex 3
          text-align right
          ellipsis()
</style>
