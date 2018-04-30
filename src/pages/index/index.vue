<template>
  <div class="page-index">
    <div class="card-userinfo">
      <img class="vip-img" src="https://m.escoffee.net/static/vip.png">
      <div class="info">
        <img class="avatar" :src="userInfo.avatar" alt="用户头像">
        <div class="nickname">{{ userInfo.nickname }}</div>
        <div class="vip">VIP</div>
        <div class="vip-level">{{ userInfo.level_name }}</div>
      </div>
    </div>
    <ul class="quick-entry">
      <li>
        <a href="/pages/map/map">
          <ic-icon name="kafei"></ic-icon>
          <div>点单</div>
        </a>
      </li>
      <li>
        <a href="/pages/shopping-mall/shopping-mall">
          <ic-icon name="tubiao-"></ic-icon>
          <div>商城</div>
        </a>
      </li>
      <li>
        <a href="/pages/convert-coffeepoint/convert-coffeepoint">
          <ic-icon name="jinbiduihuan"></ic-icon>
          <div>兑换码</div>
        </a>
      </li>
    </ul>
    <ul class="list">
      <li>
        <a href="" class="item">
          <div class="item-left">
            <ic-icon name="douzi"></ic-icon>
            <span>咖啡豆</span>
          </div>
          <div>{{ userInfo.coffee_coins }}</div>
        </a>
      </li>
      <li>
        <a href="" class="item">
          <div class="item-left">
            <ic-icon name="jifen"></ic-icon>
            <span>积分</span>
          </div>
          <div>{{ userInfo.credit }}</div>
        </a>
      </li>
      <li>
        <a href="/pages/phone-bind/phone-bind" class="item">
          <div class="item-left">
            <ic-icon name="shouji"></ic-icon>
            <span>手机绑定</span>
          </div>
          <div class="item-right">
            <span :class="{'is-empty': !mobileno}">
              {{ mobileno || '请绑定手机号' }}
            </span>
            <ic-icon name="jiantou"></ic-icon>
          </div>
        </a>
      </li>
    </ul>
    <div class="sale-container">
      <div class="sale-title">
        <ic-icon name="tubiaolunkuo-"></ic-icon>
        <span>我的红包</span>
        <a class="redpacket-entry" href="/pages/redpacket-mine/redpacket-mine?from=mine">查看更多>></a>
      </div>
      <scroll-view class="scroller-sale" scroll-x>
        <template v-if="coupon.length > 0">
          <ic-sale v-for="(item, index) in coupon"
            show-button
            @button-click="handleClick"
            :info="item"
            :key="index"></ic-sale>
        </template>
        <div v-else class="empty">无可用优惠券</div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import IcButton from '@/components/button'
import IcIcon from '@/components/icon'
import IcSale from '@/components/sale'
import { formatPhone } from '@/utils/js/format'

export default {
  data () {
    return {
      userInfo: {},
      token: ''
    }
  },
  computed: {
    mobileno () {
      return formatPhone(this.userInfo.mobileno)
    },
    coupon () {
      const ret = []
      const { invalid_coupon, valid_coupon } = this.userInfo.user_coupon || {}
      ret.push.apply(ret, valid_coupon, invalid_coupon)
      return ret
    }
  },
  methods: {
    handleClick () {
      wx.navigateTo({
        url: '/pages/map/map'
      })
    },
    login () {
      // 调用登录接口
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res.code)
          },
          fail: () => {
            reject(new Error('调用wx.login接口失败'))
          }
        })
      }).then(code => {
        return this.getUserInfo(code)
      }).then(({ code, userInfo }) => {
        return this.$get({
          action: 'wxlogin',
          code,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        })
      }).then(info => {
        if (info) {
          this.token = info.CT_token
          store.commit('setToken', this.token)
        }
      }).catch(e => {
        wx.showToast({
          icon: 'none',
          duration: 3000,
          title: e.message || '请求出了点问题~'
        })
      })
    },
    getUserInfo (code = '') {
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          lang: 'zh_CN',
          success: ({ userInfo }) => {
            this.userInfo = userInfo
            resolve({ code, userInfo })
            store.commit('setUser', userInfo)
          },
          fail: () => {
            reject(new Error('调用wx.getUserInfo接口失败'))
          }
        })
      })
    },
    getAccountInfo (token) {
      return this.$get({
        action: 'getuserinfo',
        CT_token: token
      }, true).then(info => {
        this.userInfo = Object.assign({}, this.userInfo, (info || {}))
        store.commit('setUser', this.userInfo)
        return info
      })
    }
  },
  onShow () {
    try {
      const token = store.state.token
      if (token) {
        this.getAccountInfo(token)
      } else {
        this.login().then(_ => {
          this.getAccountInfo(this.token)
        })
      }
      store.commit('setToken', token || this.token)
    } catch (e) {
      console.error(e)
    }
  },
  components: { IcIcon, IcButton, IcSale }
}
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-index
    background-color $background-color
    .card-userinfo
      position relative
      padding 50px 25px 10px
      background-color #fff
      .vip-img
        box-shadow 0 9px 15px -10px rgba(0, 0, 0, 0.53)
        width 100%
        height 183px
        margin-top -25px
      .info
        position absolute
        left 0
        top 0
        width 100%
        bottom 0
        text-align center
        color #fff
      .nickname
        padding-top 10px
      .avatar
        width 50px
        height @width
        border-radius 50%
      .vip
        font-size 30px
        font-style italic
        padding-top 20px
        padding-bottom 5px
      .vip-level
        font-size 12px
    .quick-entry
      background-color #fff
      display flex
      text-align center
      align-items center
      padding-bottom 15px
      margin-bottom 15px
      font-size 16px
      color #666
      li
        flex 1
    .iconfont
      font-size 22px

    .list
      background-color #fff
      margin-bottom 25px
      color #999
      .iconfont
          color #ccc
      .item
        display flex
        justify-content space-between
        align-items center
        padding 8px 15px
        border-bottom 1px solid #eee
      .item-left
        display flex
        align-items center
      .item-left span
        padding-left 15px
      .item-right
        text-align right
        span
          color #ccc
        .is-empty
          color $primary

    .sale-container
      padding 15px
      background-color #fff
      width 100%
      overflow hidden
      white-space nowrap
      box-sizing border-box
      .sale-title
        position relative
        display flex
        align-items center
        margin-bottom 15px
        color #999
        span
          padding-left 15px
      .redpacket-entry
        font-size 12px
        center-y()
        right 0
    .scroller-sale
      height 145px
      width 100%
      .ic-sale-box
        margin-right 25px
        margin-bottom 16px
      .empty
        font-size 18px
        color #ccc
        padding 20px 0
        text-align center
</style>
