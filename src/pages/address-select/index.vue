<template>
  <div class="page-address-select">
    <ul class="list">
      <li class="item" v-for="(item, index) in addressList"
        :key="index">
        <div class="checkbox-container">
          <ic-checkbox></ic-checkbox>
        </div>
        <div class="content">
          <div class="user-info">
            <span class="name">{{ item.name }}</span>
            <span class="tel">{{ item.mobileno }}</span>
            <span class="tag" v-if="item.is_use == '1'">默认</span>
          </div>
          <div class="address">{{ item.address }}</div>
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
        addressList: []
      }
    },
    methods: {
      addAddress (item = '') {
        wx.navigateTo({
          url: `/pages/address-edit/address-edit?info=${JSON.stringify(item)}`
        })
      }
    },
    onShow () {
      this.addressList = store.state.user && store.state.user.user_address || []
    },
    components: { IcButton, IcCheckbox, IcIcon }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-address-select
    background-color $background-color
    .list
      background-color #fff
      padding 0 25px
      .item
        display flex
        justify-content space-between
        align-items center
        padding 15px 0
        &:not(:last-child)
          border-bottom 1px dashed #eee
      .checkbox-container, edit
        flex 1
      .edit
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
      bottom 0
</style>
