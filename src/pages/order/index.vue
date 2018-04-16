<template>
  <div class="page-order">
    <div class="status-container"
      :style="{ 'background-image': bgimg } ">
      <!-- 堂食，外带 0，1 -->
      <div class="type-0" v-if="type != 2">
        <div class="status--1">
          <h3 class="status">等待支付</h3>
          <div class="status-desc">超过预约时间半小时将自动取消订单</div>
        </div>
        <div class="status-0">
          <h3>待取餐</h3>
          <div class="status-desc">订单已完成，请尽快到达门店取餐</div>
        </div>
        <div class="timer-block" v-if="no_pay == 1">
          <div>预约到达门店时间</div>
          <div class="timer"></div>
        </div>
        <div class="code-block" v-if="no_pay == 0">
          <div>取餐码</div>
          <div class="btn-round is-filled"></div>
        </div>
        <div class="process-container">
          <span class="is-ative">付款</span>
          <span class="dot-line"></span>
          <span>到达门店</span>
          <span class="dot-line"></span>
          <span>完成</span>
        </div>
      </div>
      <!-- 外卖 2 -->
      <div class="type-2" v-if="type == 2">
        <div class="status--1">
          <h3 class="status">待支付</h3>
          <div class="status-desc">逾期未支付订单将自动取消</div>
          <div class="timer"></div>
          <div class="btn-round">立即支付</div>
        </div>
        <div class="status-0">
          <h3>等待配送</h3>
          <div class="status-desc">
            外卖小哥哥正在赶往目的地，请您耐心等待...
          </div>
          <div class="btn-round">发红包</div>
        </div>
        <div class="process-container">
          <span class="is-ative">付款</span>
          <span class="dot-line"></span>
          <span>等待配送</span>
          <span class="dot-line"></span>
          <span>完成</span>
        </div>
      </div>
    </div>
    <div class="address-info">
      <div class="left">
        <div>{{ branch.content }}</div>
        <div class="address">{{ branch.address }}</div>
      </div>
      <div class="right">
        <a class="btn-round" href="/pages/order/order">导航</a>
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
          <i class="iconfont icon-jiantou"></i>
        </li>
        <li class="item">
          <div>咖啡豆</div>
          <div class="sale">
            <span>-￥</span>
            <span>{{ orderinfo.coffee_coins }}</span>
          </div>
          <i class="iconfont icon-jiantou"></i>
        </li>
        <li class="amount-statistic">
          <span class="desc">小计：</span>
          <span class="currency">￥</span>
          <span class="amount">{{ total_money }}</span>
        </li>
      </ul>
    </div>
    <div class="order-info">
      <ul>
        <li class="order-item" v-if="!isSelfGetting">
          <div class="left">收货人</div>
          <div class="right">{{ orderinfo.order_num }}</div>
        </li>
        <li class="order-item" v-if="!isSelfGetting">
          <div class="left">配送地址</div>
          <div class="right">{{ orderinfo.order_num }}</div>
        </li>
        <li class="order-item">
          <div class="left">订单号</div>
          <div class="right">{{ orderinfo.order_num }}</div>
        </li>
        <li class="order-item">
          <div class="left">下单时间</div>
          <div class="right">{{ orderinfo.add_time }}</div>
        </li>
        <li class="order-item">
          <div class="left">备注</div>
          <div class="right">{{ orderinfo.remark }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    data () {
      return {
        status: '-1',
        cartinfo: [],
        orderinfo: {},
        branch: {},
        type: '',
        no_pay: 0
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
      isSelfGetting () {
        return this.type == 0 || this.type == 1
      }
    },
    methods: {
      setTitle () {
        wx.setNavigationBarTitle({
          title: this.isSelfGetting ? '到店取餐' : '外卖'
        })
      }
    },
    onShow () {
      this.branch = store.state.buyGoods.branch
      const { order_id, type, no_pay } = this.$root.$mp.query
      // you can get `type` param from 'orderinfo' interface
      // here we get `type` from query for showing take priority
      this.type = type
      this.no_pay = no_pay
      this.setTitle()

      this.$get({
        action: 'orderinfo',
        order_id,
        CT_token: store.state.token
      }).then(info => {
        if (!info) return
        const { cartinfo, orderinfo } = info
        this.cartinfo = cartinfo
        this.orderinfo = orderinfo
      })
    }
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
      .type-0, .type-1, .type-2
        padding 25px 0 40px
      .status--1, .status-0, .status-1, .status-2
        padding-top 50px
      h3
        font-size 18px
        color #666
      .status-desc
        font-size 12px
        color #ccc
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
        &.is-filled
          background-color #706fd3
          color #fff
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
        a
          box-sizing border-box
          display inline-block
          height 40px
          line-height 40px
          padding 0 15px
          text-align center
          color $primary
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
