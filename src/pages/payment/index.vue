<template>
  <div class="page-payment">
    <scroll-view scroll-y
      :style="{ height: height }">
      <a class="vendor-info"
        :href="'/pages/vendor-detail/vendor-detail?id=' + branch.id">
        <div class="info-content">
          <div class="branch">{{ branch.content }}</div>
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
              'no-border': index === currentIndex + 1
            }"
            @click="handleWay(index)">
            <ic-icon :name="item.icon"></ic-icon>
            <span>{{ item.text }}</span>
          </li>
        </ul>
        <ul>
          <li>
            <h3>请选择就餐时间</h3>
              <picker mode="selector"
                :range="range"
                :value="timeIndex"
                @change="handleTimeChange">
                <div class="eat-time">
                  <div class="item-icon">
                    <ic-icon name="clock"></ic-icon>
                  </div>
                  <div>{{ dining_time }}</div>
                </div>
              </picker>
          </li>
          <li>
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
            <a v-else
              class="reuse" href="/pages/address-select/address-select">
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
              <ic-counter @change="handleCountChange"
                :index="index"
                :value="item.count"></ic-counter>
            </div>
          </li>
          <li class="item">
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
            <div class="sale" v-else>无可用红包</div>
            <i class="iconfont icon-jiantou"></i>
          </li>
          <li class="item" @click="coffeeVisible = true">
            <div>咖啡豆</div>
            <div class="sale" v-if="coffeepoint">
              <span>-￥</span>
              <span>{{ coffeepoint }}</span>
            </div>
            <div class="sale" v-else>选择咖啡豆</div>
            <i class="iconfont icon-jiantou"></i>
          </li>
          <li class="amount-statistic">
            <span class="desc">小计：</span>
            <span class="currency">￥</span>
            <span class="amount">{{ totalAmount }}</span>
          </li>
        </ul>
      </div>
      <div class="remark">
        <h3>备注</h3>
        <textarea placeholder="请输入您的需求"
          @input="handleTextarea"
          :value="remark"
          :auto-height="true"
          :show-confirm-bar="false"></textarea>
      </div>
    </scroll-view>
    <div class="btn-fixed">
     <button-pay
      text="去支付"
      @confirm="showConfirmDailog = true"
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
          <span class="count"></span>
        </div>
        <div class="item">
          <span class="label">使用咖啡豆</span>
          <input :value="coffeepoint"
            type="digit" @input="handleCoffeeInput">
        </div>
        <div class="statistics">
          <span>已抵扣</span>
          <span class="currency">-￥</span>
          <span class="point">{{ coffeepoint }}</span>
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
        <h3 class="branch-content">{{ branch.content }}</h3>
        <div class="address">
          <ic-icon name="dingwei"></ic-icon>
          <span>{{ branch.address }}</span>
        </div>
        <div class="eat-time">
          取餐时间：<span>{{ currentDate }}</span>
          <span>&nbsp;&nbsp;{{ dining_time }}</span>
        </div>
        <div class="btn-online" @click.stop="handleConfirm">立即支付</div>
        <div class="btn-offline" @click.stop="handleConfirm(1)">到店支付</div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import { formatDate } from '@/utils/js/format'
  import IcIcon from '@/components/icon'
  import IcCounter from '@/components/counter'
  import ButtonPay from '@/components/button-pay'

  function getNearTime () {
    const d = new Date()
    let h = d.getHours()
    let m = d.getMinutes()
    h = String(h).slice(1) ? h : `0${h}`
    m = String(m).slice(1) ? m : `0${m}`

    // lost leading zero when arithmetic
    let t = String(parseInt(`${h}.${m}` * 2) / 2)
      .replace(/\.5/, ':30')
    if (t.indexOf(':') === -1) {
      t = `${t}:00`
    }
    t = t.split(':')
    return t[0][1] ? t.join(':') : `0${t[0]}:${t[1]}`
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
        timeIndex: 0,
        dining_time: '',
        range: [],
        height: '',
        cartinfo: [],
        totalAmount: 0,
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
        coffeepoint: 0,
        express_fee: 0
      }
    },
    computed: {
      userAddress () {
        return this.user &&
          this.user.user_address &&
          this.user.user_address[0]
      },
      redPacket () {
        return this.user &&
          this.user.user_coupon &&
          this.user.user_coupon.find(item => this.totalAmount > item.min_require)
      }
    },
    methods: {
      goRedpacket () {
        wx.navigateTo({
          url: '/pages/redpacket-select/redpacket-select'
        })
      },
      handleCountChange ({ index, count }) {
        let totalAmount = 0
        this.cartinfo.forEach((item, index) => {
          totalAmount += item.price * 1 * count
        })
        this.totalAmount = totalAmount + this.express_fee - this.coffeepoint
        if (this.redPacket) {
          this.totalAmount -= this.redPacket.amount
        }
      },
      handleTextarea (e) {
        this.remark = e.mp.detail.value
      },
      notUse () {
        this.coffeepoint = 0
        this.coffeeVisible = false
      },
      confirmUse () {
        if (this.coffeepoint > this.originCoffeepoint) {
          return wx.showModal({
            title: '提示',
            content: '不能超过持有的咖啡豆数量',
            confirColor: '#ff7a3d'
          })
        }
        this.coffeeVisible = false
        this.totalAmount -= this.coffeepoint
      },
      handleCoffeeInput (e) {
        this.coffeepoint = e.mp.detail.value
      },
      handleInput (type, event) {
        this.address[type] = event.mp.detail.value
      },
      handleWay (index) {
        this.currentIndex = index
      },
      handleTimeChange (e) {
        this.timeIndex = e.mp.detail.value
        this.dining_time = this.range[this.timeIndex]
      },
      handleConfirm (no_pay = 0) {
        function getTimeNumber (str = '') {
          return str.replace(':30', '.5').replace(':00', '.') * 2
        }
        if (getTimeNumber(this.dining_time) < getTimeNumber(getNearTime())) {
          return wx.showModal({
            title: '提示',
            content: '选择的时间不能小于当前时间'
          })
        }
        let data = {
          CT_token: store.state.token,
          action: 'addorder',
          branch_id: this.branch.id,
          type: this.currentIndex,
          user_coupon_id: '',
          dining_time: getTimeNumber(this.dining_time),
          remark: this.remark,
          cartinfo: this.cartinfo,
          no_pay
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
          wx.navigateTo({
            url: `/pages/order/order?order_id=${info.order_id}&type=${this.currentIndex}&no_pay=${no_pay}`
          })
        })
      }
    },
    onShow () {
      const range = []
      for (let i = 0; i < 24; i++) {
        const temp = i + ''
        const int = temp[1] ? `${temp}:00` : `0${temp}:00`
        const float = temp[1] ? `${temp}:30` : `0${temp}:30`
        range.push(int, float)
      }
      this.range = range
      this.timeIndex = range.indexOf(getNearTime()) || 0
      this.dining_time = range[this.timeIndex]
    },
    onReady () {
      const sysinfo = wx.getSystemInfoSync()
      this.height = `${sysinfo.windowHeight - 68}px`

      const { cartinfo, totalAmount, branch } = store.state.buyGoods
      this.cartinfo = cartinfo
      this.branch = branch
      this.express_fee = branch.express_fee || 0
      this.user = store.state.user
      this.originCoffeepoint = this.user.coffee_coins || 0

      this.totalAmount = totalAmount + this.express_fee
      if (this.redPacket) {
        this.totalAmount -= this.redPacket.amount
      }
    },
    components: { IcIcon, IcCounter, ButtonPay }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-payment
    box-sizing border-box
    height 100%
    overflow hidden
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
      .icon-jiantou
        right 0
        center-y()
      .user-info
        padding-bottom 15px
        font-size 16px
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
    .remark
      background-color #fff
      padding 15px
      h3
        margin-bottom 10px
      textarea
        border 1px solid #ccc
        border-radius 6px
        padding 15px
        min-height 150px
        width 100%
        box-sizing border-box

    .btn-fixed
      position fixed
      left 0
      bottom 0
      width 100%

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

      .statistics
        font-size 12px
        text-align right
        color #999
        .currency
          color $primary
          margin-left 25px
        .point
          color $primary
          font-size 18px

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
</style>
