<template>
  <div class="page-address-select">
    <ul class="list">
      <li class="item" v-for="(item, index) in addressList"
        :key="index">
        <div class="item-left" @click="handleClick(item, index)">
          <div class="checkbox-container">
            <div class="ic-checkbox">
              <div class="checkbox-inner"
                :class="{ 'checked': defaultId == item.id }">
                <span class="checkbox-circle" v-if="defaultId == item.id"></span>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="user-info">
              <span class="name">{{ item.name }}</span>
              <span class="tel">{{ item.mobileno }}</span>
              <span class="tag" v-if="item.is_use == '1'">默认</span>
            </div>
            <div class="address">{{ item.address }}</div>
          </div>
        </div>
        <div class="edit">
          <ic-icon name="edit" @click="addAddress(item)"></ic-icon>
        </div>
      </li>
    </ul>
    <div class="btn-container">
      <ic-button type="primary" block content="新增地址"
        @click="addAddress"></ic-button>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import IcCheckbox from '@/components/checkbox'
  import IcButton from '@/components/button'
  import IcIcon from '@/components/icon'

  export default {
    props: {
      info: Array
    },
    data () {
      return {
        addressList: [],
        defaultId: ''
      }
    },
    methods: {
      addAddress (item = '') {
        wx.navigateTo({
          url: `/pages/address-edit/address-edit?info=${JSON.stringify(item)}`
        })
      },
      handleClick (item, index) {
        const address = store.state.user.user_address || []
        const selectedAddress = address.splice(index, 1)[0]
        address.unshift(selectedAddress)
        store.commit('setUser', store.state.user)
        wx.navigateTo({
          url: `/pages/payment/payment?address=${item}`
        })
      }
    },
    onShow () {
      this.addressList = store.state.user && store.state.user.user_address || []
      this.defaultId = this.$root.$mp.query.id
      console.log(this.defaultId)
    },
    components: { IcButton, IcCheckbox, IcIcon }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-address-select, page
    height 100%
    background-color $background-color
    padding-bottom 28px
    .list
      background-color #fff
      padding 0 16px
      .item
        position relative
        padding-right 50px
      .item-left
        display flex
        justify-content space-between
        align-items center
        padding 15px 0
        &:not(:last-child)
          border-bottom 1px dashed #eee
      .checkbox-container, edit
        flex 1
      .edit
        center-y()
        right 0
        text-align right
        .icon-edit
          font-size 30px
      .content
        flex 5
        padding 0 35px 0 15px
      .user-info
        font-size 16px
        font-weight bold
      .name
        padding-right 15px
      .tel
        padding-right 7px
      .tag
        background-color $primary
        color #fff
        font-size 12px
        border-radius 11px
        padding 0 8px
        height 21px
        line-height @height
      .address
        font-size 12px
        color #999

    .btn-container
      position fixed
      left 0
      width 100%
      bottom -5px

  $checkbox-width = 24px
  .ic-checkbox
    display flex
    align-items center
    .checkbox-inner
      display inline-block
      position relative
      font-size 14px
      color #666
      width $checkbox-width
      height $checkbox-width
      border-radius 50%
      border 1px solid #ccc
      text-align center
      background-color #fff
      margin-right 15px
      .checkbox-circle
        position absolute
        display inline-block
        width ($checkbox-width / 2)
        height @width
        top 50%
        left 50%
        margin-top - (@height / 2)
        margin-left -(@width / 2)
        border-radius 50%
        background-color #ff793f
      &.disabled
        background-color #f7f7f7
      &.checked
        border 1px solid #ff793f
    .checkbox-label
      color #666666
</style>
